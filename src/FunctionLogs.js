import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { selectors, connect } from './resourceRedux';
import k8s from './k8s';
import moment from 'moment';

function byTimestamp(a, b) {
  if (a.timestamp === b.timestamp) return 0;
  else if (a.timestamp < b.timestamp) return -1;
  else return 1;
}

function charCodesProduct(str) {
  let product = 1;
  for (let i = 0; i < str.length; i++) {
    product *= str.charCodeAt(i);
  }
  return product;
}

class FunctionLogs extends Component {
  static propTypes = {
    func: PropTypes.object.isRequired,
    pods: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired
  };

  state = {
    logs: {}
  };

  componentWillMount() {
    this.pollForLogs(true);
  }

  componentWillUnmount() {
    this.pollForLogs(false);
  }

  pollForLogs(run) {
    clearTimeout(this.timer);
    if (!run) return;
    this.timer = setTimeout(async () => {
      await this.fetchLogs();
      this.pollForLogs(true);
    }, 1000);
  }

  async fetchLogs() {
    const { pods } = this.props;
    const logs  = (await Promise.all(pods.map(async pod => {
      const { namespace, name } = pod.metadata;
      const container = 'main';
      const source = `${namespace}/${name}/${container}`;
      const res = await fetch(`/api/v1/namespaces/${namespace}/pods/${name}/log?container=${container}&tailLines=5000&timestamps`);
      if (res.status >= 400) return { source, lines: [] };
      const text = await res.text();
      if (text.startsWith('failed ')) return { source, lines: [] };
      const lines = text.trim().split(/\n\r?/).map(line => {
        const chunks = line.split(' ');
        let timestamp = chunks[0];
        // force timestamp to include trailing 0
        while (timestamp.length < 30) timestamp = `${timestamp.slice(0, -1)}0Z`
        return {
          timestamp,
          content: chunks.slice(1).join(' '),
          namespace,
          function: this.props.name,
          pod: name,
          container
        };
      });
      return { source, lines };
    }))).reduce((logs, log) => {
      const { source, lines } = log;
      logs[source] = (logs[source] || []).concat(lines);
      logs[source].sort(byTimestamp);
      logs[source] = logs[source].filter((line, i) => {
        const prev = logs[source][i - 1];
        if (!prev) return true;
        return line.timestamp !== prev.timestamp || line.content !== prev.content;
      });
      return logs;
    }, { ...this.state.logs });

    this.setState({ logs });
    this.timer = setTimeout(this.pollForLogs.bind(this), 1000);
  }

  render() {
    const { loading } = this.props;
    const { logs } = this.state;
    if (loading) return null;
    const lines = Object.keys(logs).reduce((lines, log) => lines.concat(logs[log]), []);
    lines.sort(byTimestamp);
    return (
      <code style={{ wordBreak: 'break-all' }}>
        {lines.map(line => {
          const instance = line.pod.split('-')[2]
          return (
            <div key={`${line.namespace}/${line.name}/${line.container}/${line.timestamp}`} style={{ backgroundColor: `hsla(${charCodesProduct(instance) % 360}, 50%, 45%, 0.2)`}}>
              <span>[{moment(line.timestamp).format('LTS')}]</span>
              <span>[{instance}]</span>
              <span> </span>
              <span>{line.content}</span>
            </div>
          );
        })}
      </code>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { func } = ownProps;
  return {
    pods: (selectors.listResource(state, k8s.pods.type) || []).filter(pod => pod.metadata.namespace === func.metadata.namespace && pod.metadata.labels.function === func.metadata.name),
    loading: selectors.loading(state, k8s.pods.type)
  };
}

export default connect(mapStateToProps)(FunctionLogs);
