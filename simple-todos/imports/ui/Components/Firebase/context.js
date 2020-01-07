import React from 'react';
import firebase from './firebase'
import context from '../../../../client/main'
const FirebaseContext = React.createContext(null);


export const withFirebase = Component => props => (
    <context.Consumer>
        {firebase => <Component {...props} firebase={firebase} />}
    </context.Consumer>
);

export default FirebaseContext;
