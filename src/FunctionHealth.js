import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectors } from './redux';
import * as health from './health';

class FunctionHealth extends Component {
  static propTypes = {
    namespace: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    deployment: PropTypes.object,
    pods: PropTypes.array,
    loading: PropTypes.bool.isRequired
  };

  render() {
    const { deployment, pods, loading } = this.props;
    if (loading || !deployment) return null;

    const podsByStatus = pods.reduce((byStatus, pod) => {
      const status = health.check(pod);
      byStatus[status] = byStatus[status] || [];
      byStatus[status].push(pod);
      return byStatus;
    }, {});
    const status = health.statusOrder
      .filter(phase => phase === health.status.Running || (podsByStatus[phase] && podsByStatus[phase].length))
      .map(phase => `${podsByStatus[phase] ? podsByStatus[phase].length : 0} ${phase}`)
      .join(', ');
    return (
      <span className='plm type-xs type-neutral-4'>
        {`${status} of ${deployment.spec.replicas} Desired`}
      </span>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { namespace, name } = ownProps;
  return {
    deployment: selectors.getResource(state, 'deployments', namespace, name),
    pods: (selectors.listResource(state, 'pods') || []).filter(pod => pod.metadata.namespace === namespace && pod.metadata.labels.function === name),
    loading: selectors.loading(state, 'deployments') || selectors.loading(state, 'pods')
  };
}

export default connect(mapStateToProps)(FunctionHealth);
