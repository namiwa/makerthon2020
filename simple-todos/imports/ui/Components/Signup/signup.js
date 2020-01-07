import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {Form, Button} from 'semantic-ui-react';

import * as ROUTES from '../../Constants/Routes';

import { FirebaseContext } from '../Firebase';
import Firebase from 'firebase';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import './signup.css';

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { username, email, passwordOne } = this.state;
        this.props.firebase.exFirebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                // Create a user in your Firebase realtime database
                return this.props.firebase
                    .user(authUser.user.uid)
                    .set({
                        username,
                        email,
                    });
            })
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                // this.props.history.push(ROUTES.CARD);
                this.props.change();
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            error,
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            username === '';

        return (
            <div id='signup-form'>
                <h1>Sign Up</h1>
                {/* do you need to put firebase commands here? I took out the SignUpPage component and combined it here */ }
                <Form onSubmit={this.onSubmit}>
                    <Form.Field>
                        <label>Username</label>
                        <input name="username" value={username} onChange={this.onChange} type="text" placeholder="Full Name" />
                    </Form.Field>
                    <Form.Field>
                        <label>Email</label>
                        <input name="email" value={email} onChange={this.onChange} type="text" placeholder="Full Name" />
                    </Form.Field>
                    <Form.Field>
                        <label>Password</label>
                        <input name="passwordOne" value={passwordOne} onChange={this.onChange} type="password" placeholder="Password" />
                    </Form.Field>
                    <Form.Field>
                        <label>Confirm Password</label>
                        <input name="passwordTwo" value={passwordTwo} onChange={this.onChange} type="password" placeholder="Confirm Password" />
                    </Form.Field>
                    <Button disabled={isInvalid} type='submit' onClick={() => {
                        this.state = INITIAL_STATE;
                        this.forceUpdate();
                    }}><Link to='/'>Sign Up</Link></Button>
                    <p>Already signed up? <Link to='/'>Login</Link> instead</p>
                </Form>
                {/* //Arun's previous code
                    <form onSubmit={this.onSubmit}>
                    <input
                        name="username"
                        value={username}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Full Name"
                    />
                    <input
                        name="email"
                        value={email}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Email Address"
                    />
                    <input
                        name="passwordOne"
                        value={passwordOne}
                        onChange={this.onChange}
                        type="password"
                        placeholder="Password"
                    />
                    <input
                        name="passwordTwo"
                        value={passwordTwo}
                        onChange={this.onChange}
                        type="password"
                        placeholder="Confirm Password"
                    />
                    <button disabled={isInvalid} type="submit">Sign Up</button>
                    {error && <p>{error.message}</p>} 
                    </form> */}
            </div>
        );
    }
}

const SignUpForm = compose(
    withRouter,
    withFirebase,
)(SignUpFormBase);

const SignUpLink = () => (
    <p>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

export default SignUpForm;
export { SignUpLink };