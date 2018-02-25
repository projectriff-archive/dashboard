import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListItem, UnorderedList } from 'pivotal-ui/react/lists';
import { Icon } from 'pivotal-ui/react/iconography';
import 'pivotal-ui/css/whitespace';
import { connect } from 'react-redux';
import { selectors } from './redux';

// TODO pick a better name, I hate this
class TopicFunctions extends Component {
  static propTypes = {
    topic: PropTypes.object.isRequired,
    sources: PropTypes.array.isRequired,
    consumers: PropTypes.array.isRequired
  };

  render() {
    const { topic, sources, consumers } = this.props;
    return (
      <UnorderedList unstyled>
        <ListItem><Icon src='arrow_forward' verticalAlign='baseline' className='mrs' /><em>direct access</em></ListItem>
        {sources.map(source => {
          const { uid, namespace, name } = source.metadata;
          return (
            <ListItem key={uid}><Icon src='arrow_forward' verticalAlign='baseline' className='mrs' />
              {namespace !== topic.metadata.namespace ? `${namespace}/${name}` : name}
            </ListItem>
          );
        })}
        {consumers.map(consumer => {
          const { uid, namespace, name } = consumer.metadata;
          return (
            <ListItem key={uid}><Icon src='arrow_back' verticalAlign='baseline' className='mrs' />
              {namespace !== topic.metadata.namespace ? `${namespace}/${name}` : name}
            </ListItem>
          );
        })}
        {!consumers.length && <ListItem><Icon src='arrow_back' verticalAlign='baseline' className='mrs' /><em>none</em></ListItem>}
      </UnorderedList>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { topic } = ownProps;
  const funcs = selectors.listResource(state, 'functions');
  return {
    sources: funcs.filter(func => func.spec.output === topic.metadata.name),
    consumers:  funcs.filter(func => func.spec.input === topic.metadata.name)
  };
}

export default connect(mapStateToProps)(TopicFunctions);
