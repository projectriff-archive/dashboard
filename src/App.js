import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import NamespacePicker from './NamespacePicker';
import Namespace from './Namespace';
import './App.css';
import { Grid, FlexCol } from 'pivotal-ui/react/flex-grids';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { actions, selectors } from './redux';

class App extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    load: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.load();
  }

  switchNamespace = namespace => {
    const { history } = this.props;
    history.push(`/namespaces/${namespace}`);
  };

  render() {
    const { loading, namespaces } = this.props;

    return (
      <Switch>
        <Redirect exact from='/' to='/namespaces/default' />
        <Route path="/namespaces/:namespace" render={({ match: { params: { namespace } }}) =>
          <Fragment>
            <Grid>
              <FlexCol fixed>
                <NamespacePicker
                  namespace={namespace}
                  namespaces={namespaces}
                  onChange={this.switchNamespace}
                  loading={loading}
                />
              </FlexCol>
            </Grid>
            <Namespace namespace={namespace} />
          </Fragment>
        } />
        <Redirect to='/' />
      </Switch>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    loading: selectors.loading(state),
    namespaces: selectors.listNamespaces(state)
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    load() {
      dispatch(actions.load());
    }
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
