import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ResourceList from './ResourceList';
import { Grid, FlexCol } from 'pivotal-ui/react/flex-grids';

class Namespace extends Component {
  static propTypes = {
    namespace: PropTypes.string.isRequired
  };

  render() {
    const { namespace } = this.props;

    return (
      <Grid>
        <FlexCol>
          <ResourceList type='functions' namespace={namespace} />
        </FlexCol>
        <FlexCol>
          <ResourceList type='topics' namespace={namespace} />
        </FlexCol>
      </Grid>
    );
  }
}

export default Namespace;
