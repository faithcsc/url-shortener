import React from 'react'
import Grid from '@material-ui/core/Grid'
import CopyButton from './CopyButton'

class LinkWithCopy extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      displayLink: props.displayLink,
      actualLink: props.actualLink,
      truncatedLink: props.truncatedLink,
    }
  }

  render() {
    const displayLink =
      this.state.truncatedLink === undefined
        ? this.state.displayLink
        : this.state.truncatedLink
    return (
      <Grid container>
        <Grid item xs={12} sm={9} className="text left">
          <a href={this.state.actualLink}>{displayLink}</a>
        </Grid>
        <Grid item xs={12} sm={3} className="text right">
          <CopyButton copyValue={this.state.displayLink} />
        </Grid>
      </Grid>
    )
  }
}

export default LinkWithCopy
