import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ResourceList from './ResourceList';
import FunctionTopics from './FunctionTopics';
import FunctionHealth from './FunctionHealth';
import k8s from './k8s';
import { Link, withRouter } from 'react-router-dom';

class FunctionList extends Component {
  static propTypes = {
    namespace: PropTypes.string.isRequired,
    match: PropTypes.object.isRequired
  };

  renderFunction(func) {
    const { match } = this.props;
    return (
      <Fragment>
        <Link to={`${match.url}/functions/${func.metadata.name}`}>{func.metadata.name}</Link>
        <FunctionHealth namespace={func.metadata.namespace} name={func.metadata.name} />
        <FunctionTopics func={func} />
      </Fragment>
    );
  }

  render() {
    const { namespace } = this.props;

    return (
      <ResourceList type={k8s.functions.type} namespace={namespace}>
        {this.renderFunction.bind(this)}
      </ResourceList>
    );
  }
}

export default withRouter(FunctionList);
