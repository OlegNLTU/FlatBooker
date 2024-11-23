import React, { useState,useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Typography, Card, CardContent, TextField, ImageList, ImageListItem, CircularProgress, Badge } from '@mui/material';
import { toast } from 'react-toastify';
import { LocalizationProvider, DateRangePicker, PickersDay  } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { isSameDay, isWithinInterval, isBefore } from 'date-fns';
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
          toast.error('Error booking flat: ' + error.message);
      } finally {
          setLoading(false);
      }
    };

    useEffect(() => {
      if (flat) { 
          fetchBookedDates();
      }
    }, [flat]);


    const isDateBooked = (date) => {
      console.log(bookedDates)
      return bookedDates.some(({ startDate, endDate }) => {
          const start = new Date(startDate);
          const end = new Date(endDate);
  
          if (isNaN(start) || isNaN(end)) {
              return false;
          }
  
          return isWithinInterval(date, { start, end });
      });
    };
    
    const renderDayContent = (day, pickersDayProps) => {
      const isBooked = isDateBooked(day);
      const isPast = isBefore(day, new Date());
      
      return (
        <Badge
          key={day.toString()}
          overlap="circular"
          badgeContent={isBooked ? '🌚' : undefined}>
          <PickersDay
            {...pickersDayProps}
            sx={{
              backgroundColor: isBooked ? '#f8d7da' : isPast ? '#e0e0e0' : undefined,
              color: isBooked ? '#721c24' : isPast ? '#888' : undefined,
              borderRadius: '50%',
            }}
            disabled={isPast || isBooked}
          />
        </Badge>
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
                            renderInput={(startProps, endProps) => (
                                <>
                                    <TextField {...startProps} fullWidth margin="normal" />
                                    <TextField {...endProps} fullWidth margin="normal" />
                                </>
                            )}
                            renderLoading={() => <CircularProgress />}  // Custom loading spinner
                            slots={{
                              day: renderDayContent,
                            }}
                            slotProps={""}/>
                    </LocalizationProvider>

                    <Button
                        onClick={handleBookFlat}
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        style={{ marginTop: '20px' }}>
                        {loading ? <CircularProgress size={24} /> : 'Book Flat'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}