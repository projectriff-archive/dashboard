import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'pivotal-ui/react/panels';
import { selectors, connect } from './resourceRedux';
import k8s from './k8s';
import { Redirect } from 'react-router-dom';
import FunctionLogs from './FunctionLogs';

class Function extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    func: PropTypes.object,
    loading: PropTypes.bool.isRequired
  };

  render() {
    const { func, loading } = this.props;
    if (loading) return null;
    if (!func) return <Redirect to={`/namespaces/${this.props.match.params.namespace}`} />
    return (
      <Panel header={`Function logs: ${func.metadata.name}`} loading={loading}>
        <FunctionLogs func={func} />
      </Panel>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { match: { params: { namespace, func } } } = ownProps;
  return {
    func: selectors.getResource(state, k8s.functions.type, namespace, func),
    loading: selectors.loading(state, k8s.functions.type, k8s.pods.type)
  };
}

export default connect(mapStateToProps)(Function);
