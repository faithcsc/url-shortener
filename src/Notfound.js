
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

function Notfound() {
    return (
        <Box textAlign="center" m={2} pt={3}>
            <Typography variant='h4'>404 Not Found</Typography>
            <Typography variant='h6'>The page you are looking for doesn't exist.</Typography>
        </Box>
    )
}


export default Notfound