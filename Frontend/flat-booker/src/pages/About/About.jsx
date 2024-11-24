import React, { useState, useEffect } from 'react';
import './About.css';

const About = () => {
    const photos = [
        'https://media.designcafe.com/wp-content/uploads/2020/06/23184301/3bhk-interior-design-bangalore-bannerghatta-road-done-by-best-interior-designers.jpg',
        'https://address.style/adm/wp-content/uploads/2023/06/MassoneOng-MeyerHouse-Showsuite-4-scaled.jpg',
        'https://i.pinimg.com/originals/d2/39/2d/d2392dccbed4b92762b57ca45657b3b3.jpg',
        'https://images.adsttc.com/media/images/5be3/3a40/08a5/e549/e300/0315/newsletter/42442.jpg?1541618191',
        'https://www.elegantinterior.info/wp-content/uploads/2022/10/19-1030x650.jpeg',
        'https://thearchitectsdiary.com/wp-content/uploads/2021/09/Studio-7-Designs-2354.jpg'
    ];

    const cityPhotos = [
        'https://static01.nyt.com/images/2022/06/01/arts/30ukraine-lviv-architecture01/merlin_206825607_615a622a-f5ec-4a0b-a779-8a2bf562c909-superJumbo.jpg',
        'https://static01.nyt.com/images/2022/05/30/arts/30ukraine-lviv-architecture02/merlin_206825208_c3370c7a-2772-4dea-9e96-433fa1bcaa36-articleLarge.jpg?quality=75&auto=webp&disable=upscale',
        'https://ukrainetrek.com/blog/wp-content/uploads/2014/03/architecture-lviv-city-ukraine-1.jpg',
        'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/9be70f86583531.5d9de7f580a4c.png',
        'https://images.adsttc.com/media/images/6332/c036/7120/021c/861f/d683/large_jpg/displaced-in-lviv-the-kharkiv-school-of-architecture-continues-its-ukraine-focused-educational-program_1.jpg?1664270397',
        'https://c8.alamy.com/comp/R162C3/old-town-with-a-church-in-the-center-lviv-city-ukraine-bell-tower-of-the-bernardine-monastery-lviv-bird-eye-view-R162C3.jpg'
    ]

    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentSlide2, setCurrentSlide2] = useState(cityPhotos.length - 2);

    useEffect(() => {
        const interval1 = setInterval(() => {
            setCurrentSlide((prev) => (prev + 2) % photos.length);
        }, 3000);

        return () => clearInterval(interval1);
    }, [photos.length]);

    useEffect(() => {
        const interval2 = setInterval(() => {
            setCurrentSlide2((prev) => (prev - 2 + photos.length) % photos.length);
        }, 3000);

        return () => clearInterval(interval2);
    }, [photos.length]);

    const reviews = [
        {
            name: 'Lubos S.',
            photo: '/photo/user1.jpeg',
            review: 'Fantastic experience! The apartment was beautifully designed, and the location was perfect for my needs.',
        },
        {
            name: 'John D.',
            photo: '/photo/user2.jpg',
            review: 'Spacious and modern! The amenities were top-notch, and I couldn’t be happier with my stay.',
        },
        {
            name: 'Emma L.',
            photo: '/photo/user3.jpg',
            review: 'The views from the apartment were breathtaking. Highly recommend to anyone looking for a luxurious stay!',
        },
    ];

    return (
        <div className="about-container">
            <h1>Welcome to Apartment App: Your Premier Destination for Apartment Bookings</h1>
            <p className="description">
            Finding the perfect apartment has never been easier. At Apartment App, we understand that searching for a new home can be a daunting task, filled with endless listings, overwhelming choices, and a significant amount of time spent scrolling through various websites.
            That’s why we’ve created a platform designed to simplify and streamline the apartment hunting process, ensuring that you can focus on what truly matters – finding your dream home.
            Our plat form offers an extensive selection of apartments to suit every need and preference. Whether you’re searching for a cozy studio in the heart of the city, a spacious family home in the suburbs, or a luxurious penthouse with breathtaking views, you’ll find it all on Apartment App. Our user-friendly interface makes it easy to browse through our listings, with detailed descriptions, high-quality images, and comprehensive information about each property.
            </p>

            <div className="carousel">
                <h2>Our Stunning Apartments</h2>
                <div className="carousel-container" style={{ transform: `translateX(-${currentSlide * 50}%)` }}>
                    {photos.map((photo, index) => (
                        <div key={index} className="carousel-item">
                            <img src={photo} alt={`Apartment ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

            <p className="additional-text">
            But we don’t just stop at helping you find the perfect apartment. Apartment App is committed to providing a seamless and stress-free booking experience. 
            With just a few clicks, you can book your desired apartment, schedule viewings, and communicate directly with property owners.
            </p>

            <div className="carousel">
                <h2>Lviv. The Cultural Capital</h2>
                <div className="carousel-container" style={{ transform: `translateX(-${currentSlide2 * 50}%)` }}>
                    {cityPhotos.reverse().map((cityPhoto, index) => (
                        <div key={index} className="carousel-item">
                            <img src={cityPhoto} alt={`Feature ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="reviews-section">
                <h2>What Our Users Say</h2>
                <div className="reviews-container">
                    {reviews.map((review, index) => (
                        <div key={index} className="review-item">
                            <img
                                className="review-photo"
                                src={review.photo}
                                alt={review.name}
                            />
                            <div className="review-text">
                                <p className="review-name">{review.name}</p>
                                <p>{review.review}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
