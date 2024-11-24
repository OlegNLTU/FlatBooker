import { useState } from "react";
import { FaBars, FaRegChartBar, FaTh, FaUserAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    const menuItem = [
        {
            path: "/grid",
            name: "Grid",
            icon: <FaRegChartBar />,
        },
        {
            path: "/about",
            name: "About",
            icon: <FaUserAlt />,
        },
    ];

    const sidebarStyle = {
        backgroundColor: "#000000",
        minHeight: "100%",
        width: isOpen ? "250px" : "80px",
        transition: "width 0.3s ease",
        overflow: "hidden",
        top: 0,
        left: 0,
        color: "#ffffff",
        paddingTop: "20px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
    };

    const containerStyle = {
        display: "flex",
    };

    const logoStyle = {
        display: isOpen ? "block" : "none",
        fontSize: "26px",
        fontWeight: 900,
        marginLeft: "20px",
        color: "#ffffff",
        fontFamily: 'Roboto, sans-serif',
        letterSpacing: "2px",
        textTransform: "uppercase",
    };

    const barsStyle = {
        fontSize: "35px", 
        color: "#ffffff",
        cursor: "pointer",
        position: "absolute",
        top: "20px",
        right: "28px",
    };

    const linkStyle = {
        display: "flex",
        alignItems: "center",
        color: "#ffffff",
        textDecoration: "none",
        margin: "8px 10px",
        borderRadius: "8px",
        padding: "10px",
        transition: "background-color 0.3s ease",
    };

    const linkHoverStyle = {
        backgroundColor: "#444444",
    };

    const iconStyle = {
        fontSize: "30px",
        color: "#ffffff",
        marginRight: "10px",
    };

    const linkTextStyle = {
        display: isOpen ? "block" : "none",
        color: "#ffffff",
    };

    return (
        <div style={containerStyle}>
            <div style={sidebarStyle} className="sidebar">
                <div className="top_section">
                    <h1 style={logoStyle} className="logo">
                        Flat Booker
                    </h1>
                    <div style={barsStyle} className="bars" onClick={toggle}>
                        <FaBars />
                    </div>
                </div>
                {menuItem.map((item, index) => (
                    <NavLink
                        to={item.path}
                        key={index}
                        className="link"
                        activeClassName="active"
                        style={linkStyle}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = linkHoverStyle.backgroundColor;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                        }}
                    >
                        <div style={iconStyle} className="icon">{item.icon}</div>
                        <div style={linkTextStyle} className="link_text">{item.name}</div>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
