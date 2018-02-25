import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { UnorderedList } from 'pivotal-ui/react/lists';
import { InputListItem, OutputListItem } from './IconListItem';

class FunctionTopics extends Component {
  static propTypes = {
    func: PropTypes.object.isRequired
  };

  render() {
    const { func } = this.props;
    return (
      <UnorderedList unstyled>
        <InputListItem>{func.spec.input}</InputListItem>
        <OutputListItem>{func.spec.output || <em>reply channel</em>}</OutputListItem>
      </UnorderedList>
    );
  }
}

export default FunctionTopics;
