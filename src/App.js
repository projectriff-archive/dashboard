import React, { Component } from 'react';
import NamespacePicker from './NamespacePicker';
import ResourceList from './ResourceList';
import logo from './logo.svg';
import './App.css';
import { DefaultButton } from 'pivotal-ui/react/buttons';
import { Icon } from 'pivotal-ui/react/iconography';
import { Grid, FlexCol } from 'pivotal-ui/react/flex-grids';



class App extends Component {
  state = {
    namespace: 'default',
    _hack: 0
  };

  switchNamespace = namespace => {
    this.setState({ namespace });
  };

  refresh = () => {
    this.setState({
      _hack: this.state._hack + 1
    });
  };

  render() {
    const { namespace, _hack } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <article className="App-intro">
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

          <Grid key={`${namespace}-${_hack}`}>
            {/* TODO remove key7 hack once components can handle prop updates */}
            <FlexCol>
              <ResourceList namespace={namespace} type='functions' />
            </FlexCol>
            <FlexCol>
              <ResourceList namespace={namespace} type='topics' />
            </FlexCol>
          </Grid>
        </article>
      </div>
    );
  }
}

export default App;
