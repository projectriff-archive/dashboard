import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { UnorderedList } from 'pivotal-ui/react/lists';
import { InputListItem, OutputListItem } from './IconListItem';
import { selectors, connect } from './resourceRedux';
import k8s from './k8s';

class FunctionTopics extends Component {
  static propTypes = {
    func: PropTypes.object.isRequired,
    inputTopic: PropTypes.object,
    outputTopic: PropTypes.object,
    loading: PropTypes.bool.isRequired
  };

  render() {
    const { func, inputTopic, outputTopic, loading } = this.props;
    if (loading || !func || !inputTopic) return null;
    return (
      <UnorderedList unstyled>
        <InputListItem>
          {func.metadata.namespace !== inputTopic.metadata.namespace ?
            `${func.metadata.namespace}/${inputTopic.metadata.name}`
          :
            func.spec.input
          }
        </InputListItem>
        <OutputListItem>
          {!outputTopic ?
            <em className='type-neutral-2'>reply channel</em>
          : func.metadata.namespace !== outputTopic.metadata.namespace ?
            `${func.metadata.namespace}/${outputTopic.metadata.name}`
          :
            outputTopic.metadata.name
          }
        </OutputListItem>
      </UnorderedList>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { func } = ownProps;
  return {
    inputTopic: selectors.getResource(state, k8s.topics.type, null, func.spec.input),
    outputTopic: func.spec.output ? selectors.getResource(state, k8s.topics.type, null, func.spec.output) : null,
    loading: selectors.loading(state, k8s.topics.type)
  };
}

export default connect(mapStateToProps)(FunctionTopics);
