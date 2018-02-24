import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ErrorAlert } from 'pivotal-ui/react/alerts';
import { Collapse } from 'pivotal-ui/react/collapse';
import { Icon } from 'pivotal-ui/react/iconography';
import { ListItem, UnorderedList } from 'pivotal-ui/react/lists';
import { Panel } from 'pivotal-ui/react/panels';

import { get, url } from './k8s';

const strings = {
  topics: {
    singular: 'topic',
    plural: 'topics'
  },
  functions: {
    singular: 'function',
    plural: 'functions'
  }
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

class ResourceList extends Component {
  static propTypes = {
    namespace: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  };

  state = {
    loading: true,
    error: null,
    resources: null
  };

  componentWillMount() {
    this.mounted = true;
    this.fetch();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  fetch = (namespace = this.props.namespace) => {
    this.setState({ loading: true }, async () => {
      try {
        const { namespace, type } = this.props;
        const resources = await get(url`/apis/projectriff.io/v1/namespaces/${namespace}/${type}`);
        if (!this.mounted) return;
        this.setState({
          loading: false,
          resources
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
    const { type } = this.props;
    const { loading, error, resources } = this.state;

    return (
      <Panel header={capitalize(strings[type].plural)} loading={loading}>
        {loading && !resources
          ? <Icon src='spinner-md' style={{'fontSize': '48px'}} />
          : <Fragment>
            {error
              ? <ErrorAlert withIcon>
                  Unable to load {strings[type].plural}
                  <Collapse header='Detail'>{'' + error}</Collapse>
                </ErrorAlert>
              : resources.items.length
                ? <UnorderedList unstyled>
                    {resources.items.map(({ metadata: { name, uid }}) => {
                      return <ListItem key={uid}>{name}</ListItem>
                    })}
                  </UnorderedList>
                : `No ${strings[type].plural} found`
            }
          </Fragment>
        }
      </Panel>
    );
  }
}

export default ResourceList;
