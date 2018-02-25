import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ResourceList from './ResourceList';
import TopicFunctions from './TopicFunctions';

class TopicList extends Component {
  static propTypes = {
    namespace: PropTypes.string.isRequired
  };

  renderTopic(topic) {
    return <TopicFunctions topic={topic} />;
  }

  render() {
    const { namespace } = this.props;

    return (
      <ResourceList type='topics' namespace={namespace}>
        {this.renderTopic}
      </ResourceList>
    );
  }
}

export default TopicList;
