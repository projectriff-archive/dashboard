import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ResourceList from './ResourceList';
import FunctionTopics from './FunctionTopics';
import FunctionHealth from './FunctionHealth';

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
      <ResourceList type='functions' namespace={namespace}>
        {this.renderFunction}
      </ResourceList>
    );
  }
}

export default FunctionList;
