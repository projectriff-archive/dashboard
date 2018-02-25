import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownItem } from 'pivotal-ui/react/dropdowns';
import { Icon } from 'pivotal-ui/react/iconography';

class NamespacePicker extends Component {
  static propTypes = {
    namespace: PropTypes.string.isRequired,
    namesapces: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    loading: PropTypes.bool
  };

  render() {
    const { namespace, namespaces, onChange, loading } = this.props;

    return (
      <Dropdown title={`Namespace: ${namespace}`} floatMenu menuAlign='left' size='large'>
        {loading && !namespaces ?
          <DropdownItem disabled>
            <Icon src='spinner-md' /> Loading
          </DropdownItem>
        :
          namespaces.map(({ metadata: { name, uid }}) => {
            return <DropdownItem key={uid} onSelect={() => onChange(name)}>{name}</DropdownItem>
          })
        }
      </Dropdown>
    );
  }
}

export default NamespacePicker;
