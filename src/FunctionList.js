import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ResourceList from './ResourceList';
import FunctionTopics from './FunctionTopics';

class FunctionList extends Component {
  static propTypes = {
    namespace: PropTypes.string.isRequired
  };

  renderFunction(func) {
    return <FunctionTopics func={func} />;
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
