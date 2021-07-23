import React from 'react';
import { View } from 'react-native';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import AuthenticationButton from './auth/auth-button';

function Header() {
  return (
    <View style={{
      flexDirection: 'row', justifyContent: 'space-between', margin: '20px', marginBottom: '-20px',
    }}
    >
      <View>
        <Typography />
        {/* <View style={{ visibility: 'hidden' }}>
          <AuthenticationButton style={{ alignSelf: 'center' }} />
        </View> */}
      </View>
      <View>
        <Typography style={{ alignSelf: 'center' }} variant="h5">
          <Link
            color="inherit"
            href={window.location.origin}
            style={{ textDecoration: 'none' }}
          >
            🔗 URL shortener
          </Link>
        </Typography>
      </View>
      <Typography />
      {/* <View>
        <AuthenticationButton style={{ alignSelf: 'center' }} />
      </View> */}
    </View>
  );
}
export default Header;
