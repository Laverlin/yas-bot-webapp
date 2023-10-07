import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import packageJson from '../../package.json';
import { auto, right } from '@popperjs/core';
import Stack from '@mui/material/Stack';
import logo from '../yas-logo.png'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Snackbar } from '@mui/material';

interface IUser {
    token: string
}

const AppToolbar: React.FC<IUser> = (user) => {
    
    const [isOpen, setIsOpen] = React.useState(false);

    const copyToken = (token: string) => {
        navigator.clipboard.writeText(token);
        setIsOpen(true);
    }

    const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        setIsOpen(false);
    };

    const isShowCopyIcon = user.token === "" ? 'hidden':'visible';

    const actionSnackbar = (
        <React.Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      );

    return (
    <>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                <Stack sx={{ width: '100%' }}>
                    <Stack direction="row">
                        <Box src={logo} component="img" sx={{ height: 32, width: 32, paddingTop: '5px', marginRight: '5px' }}></Box>
                        <Typography variant="h5" sx={{ marginTop: '6px' }}>
                            Routes 
                        </Typography>
                        <IconButton size='small'
                            onClick={ () => copyToken(user.token) }
                            sx={{ height: 20, width: 20, margin: '3px', marginLeft: auto, visibility: isShowCopyIcon }} >
                            <ContentCopyIcon sx={{ height: 14, width: 14, color:'white' }} />
                        </IconButton>
                        <Typography variant='subtitle2' sx={{ textAlign:'start', paddingTop: '3px' }} >
                            {user.token}
                        </Typography>
                    </Stack>
                    <Typography variant='caption' component='span' sx={{ flexGrow: 1, textAlign: right, marginTop: 'auto' }}>
                        v{packageJson.version}
                    </Typography>
                </Stack>
                </Toolbar>
            </AppBar>
        </Box>
        <Snackbar
            open = {isOpen}
            autoHideDuration = {900}
            onClose = {handleCloseSnackbar}
            message = "Token copied"
            action = {actionSnackbar}
        />
    </>
  );
}

export default AppToolbar;