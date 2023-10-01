import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


interface IUser {
    userId: number
}

const RouteList: React.FC<IUser> = (user) => {
    
    if (user.userId === 0) {
        return (
            <Paper sx={{ width: '100%' }}>
                <Typography variant='body1' >
                    The route list is empty
                </Typography>
            </Paper>
        )
    }
    return (
        <Box sx={{ width: '100%' }}>
            <Stack spacing={2}>
                <Item>Item 1</Item>
                <Item>Item 2</Item>
                <Item>Item 3</Item>
            </Stack>
        </Box>
    );
}

export default RouteList;