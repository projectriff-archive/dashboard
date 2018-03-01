import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import FunctionList from './FunctionList';
import TopicList from './TopicList';
import { Grid, FlexCol } from 'pivotal-ui/react/flex-grids';
import { Route } from 'react-router-dom';
import FunctionLogs from './FunctionLogs';

class Namespace extends Component {
  static propTypes = {
    namespace: PropTypes.string.isRequired
  };

  render() {
    const { namespace } = this.props;

    return (
      <Fragment>
        <Grid>
          <FlexCol>
            <FunctionList namespace={namespace} />
          </FlexCol>
          <FlexCol>
            <TopicList namespace={namespace} />
          </FlexCol>
        </Grid>
        <Route path="/namespaces/:namespace/functions/:name" render={({ match: { params: { name } }}) =>
          <FunctionLogs key={`${namespace}/${name}`} namespace={namespace} name={name} />
        } />
      </Fragment>
    );
  }
}

export default Namespace;
