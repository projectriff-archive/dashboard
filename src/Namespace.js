import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FunctionList from './FunctionList';
import TopicList from './TopicList';
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
          <FunctionList namespace={namespace} />
        </FlexCol>
        <FlexCol>
          <TopicList namespace={namespace} />
        </FlexCol>
      </Grid>
    );
  }
}

export default Namespace;
