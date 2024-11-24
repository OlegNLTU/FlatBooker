import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Button,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Grid = () => {
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState({ id: null, role: null });
    const [flats, setFlats] = useState([]);
    const navigate = useNavigate();
    
    const [openDialog, setOpenDialog] = useState(false);
    const [flatForm, setFlatForm] = useState({
        id: '',
        userId: '',
        address: '',
        countOfRooms: 1,
        countOfBuildingFloors: 1,
        price: 0,
        square: 0,
        floor: 1,
        individualHeating: false,
        parking: false,
        petFriendly: false,
        imageBase64: [],
    });

    const token = localStorage.getItem('token');

    const canDelete = (flat) => {
        if (token) {
            try {
                return flat.userId === userInfo.id || userInfo.role === "admin";
            } catch (error) {
                console.error('Error decoding JWT:', error.message);
            }
        }
        return false;
    };
    
    const fetchData = async () => {
        const endpoint = `https://localhost:7136/flats`;
        try {
            const response = await axios.get(
                endpoint,
                { headers: { Authorization: `Bearer ${token}`} }
            );
            setFlats(response.data);
            console.log(flats);
        } catch (error) {
            console.error('Error fetching URL page:', error);
            toast.error('Error fetching flats: ' + error.message);
        }
    };

    const handleFlatFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFlatForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageUpload = (e) => {
        const files = e.target.files;
        const promises = [...files].map((file) =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            })
        );

        Promise.all(promises)
            .then((images) => {
                setFlatForm((prev) => ({ ...prev, imageBase64: images }));
            })
            .catch(() => toast.error('Failed to upload images'));
    };

    const handleAddFlat = async () => {
        setLoading(true);
        try {
            console.log(flatForm);
            const endpoint = `https://localhost:7136/add-flat`;
            const response = await axios.post(endpoint, flatForm, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            toast.success(response.data);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data || 'Error adding flat');
        } finally {
            setLoading(false);
            setOpenDialog(false);
        }
    };

    const handleDeleteFlat = async (flatId) => {
        const endpoint = `https://localhost:7136/delete-flat/${flatId}`;

        try {
            const response = await axios.delete(
                endpoint,
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
            );
            if (response.status === 200) {
                console.log(response.data);
                toast('Flat was deleted.');
                fetchData();
            }
        }
        catch(error){
            toast(error.response.data);
        }
    };

    const handleDetailedInfo = (flat) => {
        navigate(`/flat-info`, { 
            state: { flat, token }
        });
    };
    
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (token) 
            {
                try 
                {
                    const endpoint = `https://localhost:7136/user-claims`;
                    const response = await axios.get(
                        endpoint,
                        { headers: { Authorization: `Bearer ${token}`} }
                    );
    
                    console.log(response.data);
                    const { id, role } = response.data;
    
                    console.log('User ID:', id);
                    console.log('User Role:', role);
    
                    setUserInfo({ id, role });
                } 
                catch (error) 
                {
                    console.error('Error decoding JWT:', error.message);
                }
            }
        };
        fetchUserInfo();
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '20px',
            }}>
            {
                loading 
                ? 
                (
                    <CircularProgress style={{ marginLeft: '8px' }} />
                )
                :
                (
                    <>
                        {userInfo.id !== null && (
                            <Button onClick={() => setOpenDialog(true)} variant="outlined" 
                                style={
                                    { 
                                        position: 'fixed', 
                                        bottom: '20px',
                                        zIndex: '10',
                                        width: '250px',
                                        fontSize: '20px',
                                        borderRadius: '8px', 
                                        backgroundColor: 'black',
                                        color: 'white',
                                        fontFamily: 'Roboto, sans-serif',
                                    }
                                }>
                                Add Flat
                            </Button>
                        )}

                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                                gap: '20px',
                                marginBottom: '60px',
                            }}
                        >
                            {flats.length > 0 
                                ? 
                                (
                                    flats.map((item, index) => {
                                        return (
                                            <Card key={index} style={{ width: '48%' }}>
                                            {item.imageBase64 && item.imageBase64.length > 0 && (
                                                <img
                                                    src={`${item.imageBase64[0]}`}
                                                    alt="Flat Image"
                                                    style={{
                                                        width: '100%',
                                                        height: '500px',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px',
                                                    }}
                                                />
                                            )}
                                            <CardContent>
                                                <Typography variant="h6" component="div">
                                                    {item.address}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Price: ${item.price}
                                                </Typography>
                                                <Button 
                                                    variant="contained" 
                                                    color="primary" 
                                                    style={{
                                                        marginTop: '10px',
                                                        backgroundColor: 'black',
                                                        color: 'white',
                                                        padding: '8px 16px',
                                                        fontSize: '14px',
                                                    }} 
                                                    onClick={() => handleDetailedInfo(item)}>
                                                    Detailed Info
                                                </Button>
                                                {canDelete(item) && (
                                                    <Button
                                                        variant="contained"
                                                        color="warning"
                                                        style={{
                                                            marginTop: '10px',
                                                            marginLeft: '10px',
                                                            backgroundColor: '#f44336',
                                                            padding: '8px 16px',
                                                            fontSize: '14px',
                                                        }}
                                                        onClick={() => handleDeleteFlat(item.id)}>
                                                        Delete Flat
                                                    </Button>
                                                )}
                                            </CardContent>
                                        </Card>                                    
                                        );
                                    })
                                )
                                : 
                                (
                                    <p>List is empty : (</p>
                                )
                            }
                        </div>

                        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
                            <DialogTitle>Add New Flat</DialogTitle>
                            <DialogContent>
                                <TextField
                                    name="address"
                                    label="Address"
                                    fullWidth
                                    margin="dense"
                                    value={flatForm.address}
                                    onChange={handleFlatFormChange}/>
                                <TextField
                                    name="price"
                                    label="Price($/day)"
                                    type="number"
                                    fullWidth
                                    margin="dense"
                                    value={flatForm.price}
                                    onChange={handleFlatFormChange}/>
                                <TextField
                                    name="square"
                                    label="Square (m²)"
                                    type="number"
                                    fullWidth
                                    margin="dense"
                                    value={flatForm.square}
                                    onChange={handleFlatFormChange}/>
                                <TextField
                                    name="floor"
                                    label="Floor"
                                    type="number"
                                    fullWidth
                                    margin="dense"
                                    value={flatForm.floor}
                                    onChange={handleFlatFormChange}/>
                                <TextField
                                    name="countOfRooms"
                                    label="Number of Rooms"
                                    type="number"
                                    fullWidth
                                    margin="dense"
                                    value={flatForm.countOfRooms}
                                    onChange={handleFlatFormChange}/>
                                <TextField
                                    name="countOfBuildingFloors"
                                    label="Building Floors"
                                    type="number"
                                    fullWidth
                                    margin="dense"
                                    value={flatForm.countOfBuildingFloors}
                                    onChange={handleFlatFormChange}/>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="individualHeating"
                                            checked={flatForm.individualHeating}
                                            onChange={handleFlatFormChange}
                                        />
                                    }
                                    label="Individual Heating" />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="parking"
                                            checked={flatForm.parking}
                                            onChange={handleFlatFormChange}
                                        />
                                    }
                                    label="Parking" />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="petFriendly"
                                            checked={flatForm.petFriendly}
                                            onChange={handleFlatFormChange}
                                        />
                                    }
                                    label="Pet Friendly" />
                                <input
                                    type="file"
                                    name="imageBase64"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    style={{ marginTop: '10px' }} />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
                                <Button onClick={handleAddFlat} color="primary" disabled={loading}>
                                    {loading ? 'Adding...' : 'Add'}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                )
            }
        </div>
    );
};

export default Grid;
