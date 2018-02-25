import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListItem, UnorderedList } from 'pivotal-ui/react/lists';
import { Icon } from 'pivotal-ui/react/iconography';
import 'pivotal-ui/css/whitespace';

class FunctionTopics extends Component {
  static propTypes = {
    func: PropTypes.object.isRequired
  };

  render() {
    const { func } = this.props;
    return (
      <UnorderedList unstyled>
        <ListItem><Icon src='arrow_forward' verticalAlign='baseline' className='mrs' />{func.spec.input}</ListItem>
        <ListItem><Icon src='arrow_back' verticalAlign='baseline' className='mrs' />{func.spec.output || <em>reply channel</em>}</ListItem>
      </UnorderedList>
    );
  }
}

export default FunctionTopics;
