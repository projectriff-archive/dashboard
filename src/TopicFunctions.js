import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { UnorderedList } from 'pivotal-ui/react/lists';
import { InputListItem, OutputListItem } from './IconListItem';
import { connect } from 'react-redux';
import { selectors } from './redux';

// TODO pick a better name, I hate this
class TopicFunctions extends Component {
  static propTypes = {
    topic: PropTypes.object.isRequired,
    sources: PropTypes.array,
    consumers: PropTypes.array,
    loading: PropTypes.bool.isRequired
  };

  render() {
    const { topic, sources, consumers, loading } = this.props;
    if (loading) return null;
    return (
      <UnorderedList unstyled>
        <InputListItem><em>direct access</em></InputListItem>
        {sources.map(source => {
          const { uid, namespace, name } = source.metadata;
          return (
            <InputListItem key={uid}>
              {namespace !== topic.metadata.namespace ? `${namespace}/${name}` : name}
            </InputListItem>
          );
        })}
        {consumers.map(consumer => {
          const { uid, namespace, name } = consumer.metadata;
          return (
            <OutputListItem key={uid}>
              {namespace !== topic.metadata.namespace ? `${namespace}/${name}` : name}
            </OutputListItem>
          );
        })}
        {!consumers.length && <OutputListItem>><em>none</em></OutputListItem>}
      </UnorderedList>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { topic } = ownProps;
  const funcs = selectors.listResource(state, 'functions');
  return {
    sources: funcs && funcs.filter(func => func.spec.output === topic.metadata.name),
    consumers:  funcs && funcs.filter(func => func.spec.input === topic.metadata.name),
    loading:  selectors.loading(state, 'functions')
  };
}

export default connect(mapStateToProps)(TopicFunctions);
