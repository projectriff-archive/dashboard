import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Dropdown, DropdownItem } from 'pivotal-ui/react/dropdowns';

import { ErrorAlert } from 'pivotal-ui/react/alerts';
import { Icon } from 'pivotal-ui/react/iconography';

class NamespacePicker extends Component {
  static propTypes = {
    namespace: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  };

  state = {
    loading: true,
    error: null,
    namespaces: null
  };

  componentWillMount() {
    this.mounted = true;
    this.fetch();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  fetch = () => {
    this.setState({ loading: true }, async () => {
      try {
        const res = await fetch('/api/v1/namespaces');
        if (res.status >= 400) throw new Error('Unable to load namespaces');
        const namespaces = await res.json();
        if (!this.mounted) return;
        this.setState({
          loading: false,
          namespaces
        });
      } catch (e) {
        if (!this.mounted) return;
        this.setState({
          loading: false,
          error: e
        });
      }
    });
  };

  render() {
    const { namespace, onChange } = this.props;
    const { loading, error, namespaces } = this.state;

    return (
      <Dropdown title={`Namespace: ${namespace}`} floatMenu menuAlign='left' size='large'>
        {loading && !namespaces
          ? <DropdownItem disabled>
              <Icon src='spinner-md' /> Loading
            </DropdownItem>
          : error
            ? <DropdownItem disabled>
                <ErrorAlert withIcon> Unable to load namesapces</ErrorAlert>
              </DropdownItem>
            : namespaces.items.map(({ metadata: { name, uid }}) => {
                return <DropdownItem key={uid} onSelect={() => onChange(name)}>{name}</DropdownItem>
              })
        }
      </Dropdown>
    );
  }
}

export default NamespacePicker;
