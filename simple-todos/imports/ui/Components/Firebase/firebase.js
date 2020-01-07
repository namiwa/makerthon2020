import firebase from 'firebase'
import app from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth';
import 'firebase/database';

const config = {
    /**
     * Add personal firebase store for testing, do not commit the changes
     */
}

class Firebase {
    constructor() {
        app.initializeApp(config);

        this.auth=app.auth();
        this.db=app.firestore();
    }

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    // *** User API ***
    user = uid => this.db.doc(`users/${uid}`);

    users = () => this.db.collection('users');

    // event = uid => this.db.doc(`events/${uid}`);
    //
    // events = () => this.db.collection('events');
}
// export default Firebase;
const exFirebase = new Firebase();

export default { exFirebase }

