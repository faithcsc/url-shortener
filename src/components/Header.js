import React from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import AuthenticationButton from './auth/auth-button';

function Header() {

  return (

  <div style={{paddingTop: 20, paddingLeft: 20, paddingRight: 20}}>
      <Grid container 
      justifyContent="space-between" 
      spacing={2}>
      
      <Grid item>
        <Grid style={{ visibility: 'hidden' }}>
          {/* <AuthenticationButton style={{ alignSelf: 'center' }} /> */}
        </Grid>
      </Grid>
      <Grid style={{textAlign: 'center'}} item>
        <Typography style={{ alignSelf: 'center' }} variant="h5">
          <Link
            color="inherit"
            href={window.location.origin}
            style={{ textDecoration: 'none' }}
          >
            🔗 URL shortener
          </Link>
        </Typography>
        <Typography style={{ alignSelf: 'center' }}>
            Make short, totally not suspicious links.
        </Typography>
      </Grid>
      <Grid item>
      <Grid>
        {/* <AuthenticationButton style={{ alignSelf: 'center' }} /> */}
      </Grid>
      </Grid>

    </Grid>

  </div>

  );
}
export default Header;
