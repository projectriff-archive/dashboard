import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListItem } from 'pivotal-ui/react/lists';
import { Icon } from 'pivotal-ui/react/iconography';
import 'pivotal-ui/css/whitespace';

class IconListItem extends Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    children: PropTypes.any
  };

  render() {
    const { icon, children } = this.props;
    return (
        <ListItem>
          <Icon src={icon} verticalAlign='baseline' className='mrs' />
          {children}
        </ListItem>
    );
  }
}

function InputListItem(props) {
  return <IconListItem icon='arrow_forward' {...props} />;
}

function OutputListItem(props) {
  return <IconListItem icon='arrow_back' {...props} />;
}

export default IconListItem;
export { InputListItem, OutputListItem };
