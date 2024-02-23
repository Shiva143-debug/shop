import { Link, useNavigate } from 'react-router-dom'
import React, { useRef } from 'react';
// import Cookies from 'js-cookie'
import "./Header.css"
import { Toast } from 'primereact/toast';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';


const Header = () => {
    const navigate = useNavigate();
    const toast = useRef(null);
    // const onClickLogout = () => {
    // Cookies.remove('jwt_token')
    // navigate('/')
    // }

    const accept = () => {
        toast.current.show({ severity: 'success', summary: 'Confirmed', detail: 'You have LoggedOut successflly', life: 3000 });
        setTimeout(() => {
            navigate("/");
        }, 1000)

    };

    const reject = () => {
        toast.current.show({ severity: 'success', summary: 'Rejected', detail: 'You have not Logout', life: 3000 });
    };


    const onClickLogout = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Are you sure you want to Logout?',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept,
            reject
        });
    };


    return (
        <nav className="nav-header">
            <Toast ref={toast} />
            <ConfirmPopup />
            <div className="nav-content">
                <div className="nav-bar-mobile-logo-container">
                    <Link to="/home">
                        <img
                            className="website-logo"
                            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
                            alt="website logo"
                        />
                    </Link>

                    <button
                        type="button"
                        className="nav-mobile-btn"
                        onClick={onClickLogout}
                    >
                        <img
                            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-log-out-img.png"
                            alt="nav logout"
                            className="nav-bar-img"
                        />
                    </button>
                </div>

                <div className="nav-bar-large-container">
                    <Link to="/home">
                        <img
                            className="website-logo"
                            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
                            alt="website logo"
                        />
                    </Link>
                    <ul className="nav-menu">
                        <li className="nav-menu-item">
                            <Link to="/home" className="n">
                                Home  
                            </Link>
                        </li>

                        <li className="nav-menu-item">
                            <Link to="/product" className="n">
                                Products
                            </Link>
                        </li>

                        <li className="nav-menu-item">
                            <Link to="/customer" className="n">
                                Customers
                            </Link>
                        </li>
                        <li className="nav-menu-item">
                            <Link to="/reports" className="n">
                                Reports
                            </Link>
                        </li>
                        {/* <li className="nav-menu-item">
                            <Link to="/map" className="nav-link">
                                Map
                            </Link>
                        </li> */}

                        <li className="nav-menu-item">
                            <Link to="/invoice" className="n">
                                Invoice
                            </Link>
                        </li>
                        <button
                        type="button"
                        className="logout-desktop-btn"
                        onClick={onClickLogout}
                    >
                        Logout
                    </button>
                    </ul>

                </div>
            </div>
            <div className="nav-menu-mobile">
                <ul className="nav-menu-list-mobile">
                    <li className="nav-menu-item-mobile">
                        <Link to="/home" className="nav-link">
                            <img
                                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-home-icon.png"
                                alt="nav home"
                                className="nav-bar-img"
                            />
                        </Link>
                    </li>

                    <li className="nav-menu-item-mobile">
                        <Link to="/product" className="nav-link">
                            <img
                                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-products-icon.png"
                                alt="nav products"
                                className="nav-bar-img"
                            />
                        </Link>
                    </li>
                    <li className="nav-menu-item-mobile">
                        <Link to="/customer" className="nav-link">
                            <img
                                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-cart-icon.png"
                                alt="nav cart"
                                className="nav-bar-img"
                            />
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Header
