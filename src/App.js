import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import NamespacePicker from './NamespacePicker';
import ResourceList from './ResourceList';
import './App.css';
import { DefaultButton } from 'pivotal-ui/react/buttons';
import { Icon } from 'pivotal-ui/react/iconography';
import { Grid, FlexCol } from 'pivotal-ui/react/flex-grids';
import {
  Route,
  Redirect,
  Switch,
  withRouter
} from 'react-router-dom';


class App extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };

  state = {
    // horrible hack that needs to die
    _refreshCount: 0
  };

  switchNamespace = namespace => {
    const { history } = this.props;
    history.push(`/namespaces/${namespace}`);
  };

  refresh = () => {
    this.setState({
      _refreshCount: this.state._refreshCount + 1
    });
  };

  render() {
    const { _refreshCount } = this.state;

    return (
      <Switch>
        <Redirect exact from='/' to='/namespaces/default' />
        <Route path="/namespaces/:namespace" render={({ match: { params: { namespace } }}) =>
          <Fragment>
            <Grid>
              <FlexCol fixed>
                <NamespacePicker namespace={namespace} onChange={this.switchNamespace} />
              </FlexCol>
              <FlexCol fixed>
                <DefaultButton onClick={this.refresh}>
                  <Icon src='refresh' />
                </DefaultButton>
              </FlexCol>
            </Grid>
            <Grid key={`${namespace}-${_refreshCount}`}>
              {/* TODO remove key hack once components can handle prop updates */}
              <FlexCol>
                <ResourceList namespace={namespace} type='functions' />
              </FlexCol>
              <FlexCol>
                <ResourceList namespace={namespace} type='topics' />
              </FlexCol>
            </Grid>
          </Fragment>
        } />
        <Redirect to='/' />
      </Switch>
    );
  }
}

export default withRouter(App);
