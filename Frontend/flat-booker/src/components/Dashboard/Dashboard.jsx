import {Navigate, Route, Routes} from "react-router-dom";
import SideBar from '../Sidebar/Sidebar';
import Home from '../../pages/Home/Home';
import Grid from '../../pages/Grid/Grid';
import About from '../../pages/About/About';
import FlatInfo from "../../pages/FlatPage/FlatInfo";

import '../../TestCssForApp.css';

const Dashboard = () => {
    return (
        <div style={{display: "flex"}}>
            <SideBar />
            <Routes>
                    <Route path="home" element={<Home/>}/>
                    <Route path="grid" element={<Grid/>}/>
                    <Route
                        index
                        element={<Navigate to="/dashboard/home" replace />}
                    />
                    <Route path="about" element={<About/>}/>
                    <Route path="flat-info" element={<FlatInfo/>}/>
            </Routes>
        </div>
    )
}

export default Dashboard;