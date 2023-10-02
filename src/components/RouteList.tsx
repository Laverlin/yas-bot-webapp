import { useEffect, useState }  from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import { IYasRoute } from '../abstract/IYasRoute';
import { format } from 'date-fns'



interface IUser {
    userId: string
}

const RouteList: React.FC<IUser> = (user) => {

    const [yasRoutes, setYasRoutes] = useState<IYasRoute[]>([]);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const response = await fetch(`https://ivan-b.com/api/v2.0/YASail/${user.userId}/route`);
                const data = await response.json();
                setYasRoutes(data);
            }
                catch(e){
                console.log(e);
            }
        };
        if (user.userId !== "")
            fetchRoutes();
    }, [user.userId]);

    
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
                    <Paper key={route.RouteId} sx={{padding:'15px', margin: '5px'}}>
                        <Typography variant='body1'>
                            <b>{route.RouteName}</b>
                        </Typography>
                        <Typography variant='caption'>
                            { format(new Date(route.RouteDate), "do MMM yyyy") },&nbsp;{ format(new Date(route.RouteDate), "HH:mm") }
                        </Typography>

                    </Paper>


                )}

            </Stack>
        </Box>
    );
}

export default RouteList;