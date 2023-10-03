import { useEffect, useState }  from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { IconButton, Typography, Chip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { IYasRoute } from '../abstract/IYasRoute';
import { format, formatDistanceToNow } from 'date-fns'
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import RoomIcon from '@mui/icons-material/RoomOutlined'

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
  }));


interface IUser {
    userId: string
}

const RouteList: React.FC<IUser> = (user) => {

    const [yasRoutes, setYasRoutes] = useState<IYasRoute[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<IYasRoute>();

    const onClickDelete = (route: IYasRoute) => {
        setSelectedRoute(route);
    }

    const handleCloseConfirmation = (routeId: number | undefined, isDelete: boolean) => {
        setSelectedRoute(undefined);
    }

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
        <>
            <Box sx={{ width: '100%' }}>
                <Stack spacing={1} sx={{ margin:'5px'}}>
                    {yasRoutes.map((route) => 
                        <Item key={route.RouteId}>
                            <Stack direction="row" sx={{alignItems:'center'}}>
                                <Box sx={{width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                    <Typography variant='body1' component="span" sx={{fontWeight: 'bold', paddingTop:'15px'}}>
                                        {route.RouteName}
                                    </Typography>
                                    <Chip icon={<RoomIcon/>} label={route.WayPoints.length} size='small' sx={{fontSize:'10px', marginLeft: '10px', marginBottom:'15px'}}/>
                                    
                                    <Typography variant='caption' component="div">
                                        { format(new Date(route.RouteDate), "do MMM yyyy") },&nbsp;{ format(new Date(route.RouteDate), "HH:mm") }
                                    </Typography>
                                    <Typography variant='caption' component="div">
                                        { formatDistanceToNow(new Date(route.RouteDate),{addSuffix: true}) }
                                    </Typography>
                                </Box>
                                <IconButton 
                                    onClick={ () => onClickDelete(route) }
                                    size="large" sx={{height: 50, width: 50}}
                                >
                                    <DeleteIcon fontSize='medium'/>
                                </IconButton>
                            </Stack>
                        </Item>
                    )}
                </Stack>
            </Box>

            <Dialog
                open={ selectedRoute !== undefined }
                onClose={ () => handleCloseConfirmation(0, false) }
            >
                <DialogTitle>
                    {"Please Confirm"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        The route <b>{selectedRoute?.RouteName}</b> will be deleted.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={ () => handleCloseConfirmation(0, false) } variant="contained" autoFocus> Cancel </Button>
                    <Button onClick={ () => handleCloseConfirmation(selectedRoute?.RouteId, true) }> Ok </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default RouteList;