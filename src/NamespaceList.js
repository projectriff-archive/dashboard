import React, { Component, Fragment } from 'react';

import { ErrorAlert } from 'pivotal-ui/react/alerts';
import { DefaultButton } from 'pivotal-ui/react/buttons';
import { Icon } from 'pivotal-ui/react/iconography';
import { ListItem, UnorderedList } from 'pivotal-ui/react/lists';
import { Panel } from 'pivotal-ui/react/panels';

class NamespaceList extends Component {
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
        const res = await fetch('/api/v1/namespaces/');
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
    const { loading, error, namespaces } = this.state;

    return (
      <Panel header='Namespaces' loading={loading}>
        {loading && !namespaces
          ? <Icon src='spinner-md' style={{'fontSize': '48px'}} />
          : <Fragment>
            {error
              ? <ErrorAlert withIcon>
                  Unable to load namesapces
                  <details>{'' + error}</details>
                </ErrorAlert>
              : <UnorderedList unstyled>
                  {namespaces.items.map(namespace => {
                    const { name, uid } = namespace.metadata;
                    return <ListItem key={uid}>{name}</ListItem>
                  })}
                </UnorderedList>
            }
            <DefaultButton
              disabled={loading}
              onClick={this.fetch}
            >
              <Icon src='refresh' />
            </DefaultButton>
          </Fragment>
        }
      </Panel>
    );
  }
}

export default NamespaceList;
