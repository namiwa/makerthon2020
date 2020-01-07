import React from 'react';
import { withFirebase } from '../Firebase';
const LogOutButton = ({ firebase }) => (
    <button type="button" onClick={firebase.doSignOut}>
        Log Out
    </button>
);
export default withFirebase(LogOutButton);