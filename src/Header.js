import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

function Header() {
    return (
        <Box m={1} pt={3}>
            <Grid container justify='center' >
                <Typography variant='h5'>
                    <Link color='inherit'
                        href={window.location.origin}
                        style={{ textDecoration: 'none' }}>
                        🔗 URL shortener
                    </Link>
                </Typography>
            </Grid>
            <Grid container justify='center' >
                <Typography variant='subtitle2'>
                    Make short, totally not suspicious links.
                </Typography>
            </Grid>
        </Box>
    )
}

export default Header