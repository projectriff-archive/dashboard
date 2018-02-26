import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ResourceList from './ResourceList';
import FunctionTopics from './FunctionTopics';
import FunctionHealth from './FunctionHealth';
import k8s from './k8s';

class FunctionList extends Component {
  static propTypes = {
    namespace: PropTypes.string.isRequired
  };

  renderFunction(func) {
    return (
      <Fragment>
        {func.metadata.name}
        <FunctionHealth namespace={func.metadata.namespace} name={func.metadata.name} />
        <FunctionTopics func={func} />
      </Fragment>
    );
  }

  render() {
    const { namespace } = this.props;

    return (
      <ResourceList type={k8s.functions.type} namespace={namespace}>
        {this.renderFunction}
      </ResourceList>
    );
  }
}

export default FunctionList;
