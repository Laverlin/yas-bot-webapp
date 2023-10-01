import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import packageJson from '../../package.json';
import { right } from '@popperjs/core';

interface IUser {
    userId: string
}

const AppToolbar: React.FC<IUser> = (user) => {
    
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            YAS Route Manager [{user.userId}]
          </Typography>
          <Typography variant='caption' component='span' sx={{ flexGrow: 1, textAlign: right, marginTop: 'auto' }}>
            version: {packageJson.version}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default AppToolbar;