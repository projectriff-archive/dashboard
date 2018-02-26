import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectors } from './redux';

// TODO extreamly dodgy, someone must have good health status logic we can use
function statusForPod({ metadata, status: { phase, conditions, containerStatuses } }) {
  if (metadata.deletionTimestamp) return 'Shutdown';
  if (phase === 'Pending') return 'Startup';
  if (phase === 'Running') {
    if (conditions.find(condition => condition.type ==='Ready').status === 'True') {
      if (containerStatuses && containerStatuses.some(status => status.restartCount > 0)) {
        return 'Restarted';
      } else {
        return 'Running';
      }
    } else {
      return 'Error';
    }
  }
  return 'Unknown';
}

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

    const podsByPhase = pods.reduce((byPhase, pod) => {
      byPhase[statusForPod(pod)].push(pod);
      return byPhase;
    }, {
      Error: [],
      Restarted: [],
      Startup: [],
      Shutdown: [],
      Running: [],
      Unknown: []
    });
    const status = Object.keys(podsByPhase)
      .filter(phase => phase === 'Running' || podsByPhase[phase].length)
      .map(phase => `${podsByPhase[phase].length} ${phase}`)
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
