import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ResourceList from './ResourceList';
import TopicFunctions from './TopicFunctions';
import k8s from './k8s';

class TopicList extends Component {
  static propTypes = {
    namespace: PropTypes.string.isRequired
  };

  renderTopic(topic) {
    const { partitions } = topic.spec;
    return (
      <Fragment>
        <span className='em-default'>{topic.metadata.name}</span>
        <span className='plm type-xs type-neutral-4'>{partitions} partition{partitions > 1 ? 's' : ''}</span>
        <TopicFunctions topic={topic} />
      </Fragment>
    );
  }

  render() {
    const { namespace } = this.props;

    return (
      <ResourceList type={k8s.topics.type} namespace={namespace}>
        {this.renderTopic}
      </ResourceList>
    );
  }
}

export default TopicList;
