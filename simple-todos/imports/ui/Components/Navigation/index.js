import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../Constants/Routes';
import LogOutButton from '../Logout/logout';

const Navigation = () => (
    <div>
        <ul>
            <li>
                <Link to={ROUTES.LOGIN}>Sign In</Link>
            </li>
            <li>
                <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
            </li>
            <li>
                <Link to={ROUTES.HEADER}>Home</Link>
            </li>
            <li>
                <Link to={ROUTES.CARD}>Cards List</Link>
            </li>
            <li>
                <LogOutButton/>
            </li>
        </ul>
    </div>
);
export default Navigation;