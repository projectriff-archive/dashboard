import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import FunctionList from './FunctionList';
import TopicList from './TopicList';
import { Grid, FlexCol } from 'pivotal-ui/react/flex-grids';
import { Switch, Route, Redirect } from 'react-router-dom';
import Function from './Function';

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
        <Switch>
          <Route path='/namespaces/:namespace/functions/:func' component={Function} />
          <Route path='/namespaces/:namespace' exact />
          <Redirect to={`/namespaces/${namespace}`} />
        </Switch>
      </Fragment>
    );
  }
}

export default Namespace;
