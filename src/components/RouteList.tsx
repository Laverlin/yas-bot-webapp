import { useEffect, useState }  from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { IYasRoute } from '../abstract/YasRoute';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


interface IUser {
    userId: string
}

const RouteList: React.FC<IUser> = (user) => {
    
    const [yasRoutes, setYasRoutes ] = useState<IYasRoute[]>([]);

    useEffect(() => {
      const fetchRoutes = async () => {
        try {
          const response = await fetch(`https://ivan-b.com/api/v2.0/YASail/${user.userId}/route`);
          const data = await response.json();
          console.log(data);
          setYasRoutes(data);
        }
        catch(e){
          console.log(e);
        }
     };
     if (user.userId !== "" && yasRoutes.length === 0)
        fetchRoutes();
    });

    
    if (!Array.isArray(yasRoutes) || yasRoutes.length === 0) {
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
                {yasRoutes.map((route) => 
                    <Item key={route.RouteId}> {route.RouteName} </Item>
                )}

            </Stack>
        </Box>
    );
}

export default RouteList;