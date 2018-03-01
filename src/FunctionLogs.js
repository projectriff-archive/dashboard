import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'pivotal-ui/react/panels';
import { selectors, connect } from './resourceRedux';
import k8s from './k8s';
import moment from 'moment';

function byTimestamp(a, b) {
  if (a.timestamp === b.timestamp) return 0;
  else if (a.timestamp < b.timestamp) return -1;
  else return 1;
}

class FunctionLogs extends Component {
  static propTypes = {
    namespace: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
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
    const { name, loading } = this.props;
    const { logs } = this.state;
    if (loading) return null;
    const lines = Object.keys(logs).reduce((lines, log) => lines.concat(logs[log]), []);
    lines.sort(byTimestamp);
    return (
      <Panel header={`Function logs: ${name}`} loading={loading}>
        <code style={{ wordBreak: 'break-all' }}>
          {lines.map(l => {
            return (
              <div key={`${l.namespace}/${l.name}/${l.container}/${l.timestamp}`}>
                <span>[{moment(l.timestamp).format('LTS')}]</span>
                <span>[{l.pod.split('-')[2]}]</span>
                <span> </span>
                <span>{l.content}</span>
              </div>
            );
          })}
        </code>
      </Panel>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { namespace, name } = ownProps;
  return {
    pods: (selectors.listResource(state, k8s.pods.type) || []).filter(pod => pod.metadata.namespace === namespace && pod.metadata.labels.function === name),
    loading: selectors.loading(state, k8s.pods.type)
  };
}

export default connect(mapStateToProps)(FunctionLogs);
