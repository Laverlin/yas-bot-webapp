import { useEffect, useState }  from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { IconButton, Typography, Chip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@mui/material';
import { IYasRoute } from '../abstract/IYasRoute';
import { format, formatDistanceToNow } from 'date-fns'
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import RoomIcon from '@mui/icons-material/RoomOutlined'
import EditIcon from '@mui/icons-material/EditOutlined'
import { FetchDeleteRoute, FetchRenameRoute, FetchRoutes } from '../fetcher';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
  }));


interface IUser {
    token: string
}

const RouteList: React.FC<IUser> = (user) => {

    const [yasRoutes, setYasRoutes] = useState<IYasRoute[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<IYasRoute>();
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [isRenameOpen, setRenameOpen] = useState(false);
    const [routeName, setRouteName] = useState("");

    const onClickDelete = (route: IYasRoute) => {
        setDeleteOpen(true);
        setSelectedRoute(route);
    }

    const handleCloseDelete = (routeId: number | undefined = 0, isDelete: boolean = false) => {
        if (isDelete) {
            FetchDeleteRoute(user.token, routeId)
                .then(isOk => {
                    if (isOk) {
                        FetchRoutes(user.token).then(routes => setYasRoutes(routes));
                }});
        }
        setDeleteOpen(false);
        setSelectedRoute(undefined);
    }

    const onClickRename = (route: IYasRoute) => {
        setRenameOpen(true);
        setSelectedRoute(route);
        setRouteName(route.routeName);
    }

    const handleCloseRename = (routeId: number | undefined = 0, newName: string = '', isRename: boolean = false) => {
        if (isRename) {
            FetchRenameRoute(user.token, routeId, newName)
                .then(isOk => {
                    if (isOk) {
                        FetchRoutes(user.token).then(routes => setYasRoutes(routes));
                }});
        }
        setRenameOpen(false);
        setSelectedRoute(undefined);
    }


    useEffect(() => {
        if (user.token !== "")
            FetchRoutes(user.token).then(routes => setYasRoutes(routes));
    }, [user.token]);

    
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
                        <Item key={route.routeId}>
                            <Stack direction="row" sx={{alignItems:'center'}}>
                                <Box sx={{width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                    <Typography variant='body1' component="span" sx={{fontWeight: 'bold', paddingTop:'15px'}}>
                                        {route.routeName}
                                    </Typography>
                                    <Chip icon={<RoomIcon/>} label={route.waypoints.length} size='small' sx={{fontSize:'10px', marginLeft: '10px', marginBottom:'15px'}}/>
                                    
                                    <Typography variant='caption' component="div">
                                        { format(new Date(route.routeDate), "do MMM yyyy") },&nbsp;{ format(new Date(route.routeDate), "HH:mm") }
                                    </Typography>
                                    <Typography variant='caption' component="div">
                                        { formatDistanceToNow(new Date(route.routeDate),{addSuffix: true}) }
                                    </Typography>
                                </Box>
                                <Stack>
                                    <IconButton 
                                        onClick={ () => onClickRename(route) }
                                        size="large" sx={{height: 50, width: 50}}
                                    >
                                        <EditIcon fontSize='medium'/>
                                    </IconButton> 
                                    <IconButton 
                                        onClick={ () => onClickDelete(route) }
                                        size="large" sx={{height: 50, width: 50}}
                                    >
                                        <DeleteIcon fontSize='medium'/>
                                    </IconButton>
                                </Stack>
                            </Stack>
                        </Item>
                    )}
                </Stack>
            </Box>

            <Dialog
                open={ isRenameOpen }
                onClose={ () => handleCloseRename() }
                fullWidth
            >
                <DialogTitle>
                    Rename <b>{ selectedRoute?.routeName }</b>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText component="div">
                        <TextField
                            variant='outlined'
                            label='new name'
                            value={ routeName }
                            size='small'
                            fullWidth
                            sx={{ marginTop: '20px' }}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setRouteName(event.target.value);
                              }}
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={ () => handleCloseRename() }> Cancel </Button>
                    <Button onClick={ () => handleCloseRename(selectedRoute?.routeId, routeName, true) } variant="contained" autoFocus> Ok </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={ isDeleteOpen }
                onClose={ () => handleCloseDelete(0, false) }
            >
                <DialogTitle>
                    {"Please Confirm"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        The route <b>{selectedRoute?.routeName}</b> will be deleted.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={ () => handleCloseDelete() } variant="contained" autoFocus> Cancel </Button>
                    <Button onClick={ () => handleCloseDelete(selectedRoute?.routeId, true) }> Ok </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default RouteList;