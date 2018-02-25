import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ErrorAlert, InfoAlert } from 'pivotal-ui/react/alerts';
import { Collapse } from 'pivotal-ui/react/collapse';
import { Icon } from 'pivotal-ui/react/iconography';
import { ListItem, UnorderedList } from 'pivotal-ui/react/lists';
import { Panel } from 'pivotal-ui/react/panels';
import { connect } from 'react-redux';
import { selectors } from './redux';

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
    type: PropTypes.string.isRequired,
    resources: PropTypes.array,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.any
  };

  render() {
    const { type, resources, loading, error } = this.props;

    return (
      <Panel header={capitalize(strings[type].plural)} loading={loading}>
        {loading && !resources ?
          <Icon src='spinner-md' style={{'fontSize': '48px'}} />
        : error ?
          <ErrorAlert withIcon>
            Unable to load {strings[type].plural}.
            <Collapse header='Detail'>
              {'' + error}
            </Collapse>
          </ErrorAlert>
        : resources.length ?
          <UnorderedList unstyled>
            {resources.map(({ metadata: { name, uid }}) => {
              return <ListItem key={uid}>{name}</ListItem>
            })}
          </UnorderedList>
        :
          <InfoAlert withIcon>
            No {strings[type].plural} found
          </InfoAlert>
        }
      </Panel>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { type, namespace } = ownProps;
  return {
    loading: selectors.loading(state, type),
    resources: selectors.listResource(state, type, namespace),
    error: selectors.error(state, type)
  };
}

export default connect(mapStateToProps)(ResourceList);
