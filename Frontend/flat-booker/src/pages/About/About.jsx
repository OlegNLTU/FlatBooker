import React, { useState, useEffect } from 'react';
import axios from 'axios';

const About = () =>{
    const [aboutContent, setAboutContent] = useState('');
    const token = localStorage.getItem('token');


    return(
        <div>Hello world</div>
    )
}
export default About;