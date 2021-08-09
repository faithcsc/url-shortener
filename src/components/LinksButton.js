import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'

const LinksButton = () => {
  const { isAuthenticated } = useAuth0()
  return (
    <Box m={1} display={!!!isAuthenticated ? 'none' : 'block'}>
      <Button
        size="large"
        color="default"
        disableElevation
        onClick={() => {
          window.location = window.location.origin + '/links'
        }}
      >
        Links
      </Button>
    </Box>
  )
}

export default LinksButton
