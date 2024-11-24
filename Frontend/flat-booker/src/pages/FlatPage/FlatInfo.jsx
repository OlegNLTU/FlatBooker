import React, { useState,useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Typography, Card, CardContent, TextField, ImageList, ImageListItem, CircularProgress, Badge } from '@mui/material';
import { toast } from 'react-toastify';
import { LocalizationProvider, DateRangePicker  } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

export default function FlatInfo() {
    const { state } = useLocation();
    const { flat, token } = state || {};
    const [bookedDates, setBookDates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bookingDetails, setBookingDetails] = useState([null, null]);

    const fetchBookedDates = async () => {
        const endpoint = `https://localhost:7136/flats/${flat.id}/booked-dates`;
        try {
            const response = await axios.get(
                endpoint,
                { headers: { Authorization: `Bearer ${token}`} }
            );
            setBookDates(response.data);
        } catch (error) {
            toast.error('Error fetching booked Dates: ' + error.message);
        }
    };

    const handleBookFlat = async () => {
      if (!bookingDetails[0] || !bookingDetails[1]) {
          toast.error('Please select a start and end date');
          return;
      }

      setLoading(true);
      try {
          
          const formattedBookingDetails = {
            start: bookingDetails[0].toISOString().split('T')[0],
            end: bookingDetails[1].toISOString().split('T')[0],
          };

          await axios.post(
            `https://localhost:7136/book-flat/${flat.id}`,
            formattedBookingDetails,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
          );
          toast.success('Flat booked successfully!');
          fetchBookedDates();
      } catch (error) {
        toast.error('Error occured, take a look maybe you booked date that is already booked');
      } finally {
          setLoading(false);
      }
    };

    useEffect(() => {
      if (flat) { 
          fetchBookedDates();
      }
    }, [flat]);

    const isDateBookedOrPast = (date) => {
      return (
        date < new Date() ||
        bookedDates.some(
          (range) =>{
            console.log(range)
            const start = new Date(range.start);
            const end = new Date(range.end);
            return date >= start && date <= end
          } 
        )
      );
    };

    return (
        <div style={{ margin: '20px auto', padding: '20px' }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="div">{flat.address}</Typography>
                    <Typography variant="body1" color="textSecondary">Price: ${flat.price}/day</Typography>
                    <Typography variant="body2" color="textSecondary">Square: {flat.square} m²</Typography>
                    <Typography variant="body2" color="textSecondary">Floor: {flat.floor}</Typography>
                    <Typography variant="body2" color="textSecondary">Heating: {flat.individualHeating ? 'Yes' : 'No'}</Typography>
                    <Typography variant="body2" color="textSecondary">Parking: {flat.parking ? 'Yes' : 'No'}</Typography>
                    <Typography variant="body2" color="textSecondary">Pet Friendly: {flat.petFriendly ? 'Yes' : 'No'}</Typography>

                    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                        {flat.imageBase64 && flat.imageBase64.length > 0 ? (
                            <ImageList
                                cols={2}
                                rowHeight={200}
                                gap={10}
                                style={{ width: '100%', marginTop: '20px' }}
                            >
                                {flat.imageBase64.map((image, index) => (
                                    <ImageListItem key={index}>
                                        <img
                                            src={image}
                                            alt={`Flat Image ${index + 1}`}
                                            style={{
                                                objectFit: 'cover',
                                                width: '100%',
                                                height: '100%',
                                            }}
                                            loading="lazy"
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                No images available.
                            </Typography>
                        )}
                    </div>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateRangePicker
                            startText="Start Date"
                            endText="End Date"
                            value={bookingDetails}
                            onChange={(newValue) => setBookingDetails(newValue)}
                            shouldDisableDate={(date) => isDateBookedOrPast(date)}/>
                    </LocalizationProvider>

                    <Button
                        onClick={handleBookFlat}
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        style={{
                            marginTop: '20px',
                            backgroundColor: '#000000',
                            padding: '12px 24px', // Збільшено внутрішні відступи
                            fontSize: '16px', // Збільшено розмір тексту
                            width: '360px', // Збільшено ширину
                            textAlign: 'center', // Центрування тексту всередині кнопки
                            margin: '20px auto', // Центрування самої кнопки
                            display: 'block', // Блочний елемент для автоматичного центрування
                            borderRadius: '8px', // Додано округлення
                            color: '#ffffff' // Білий текст для контрасту
                        }}>
                        {loading ? <CircularProgress size={24} /> : 'Book Flat'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}