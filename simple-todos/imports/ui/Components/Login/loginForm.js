import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { SignUpLink } from '../Signup/signup';
import { withFirebase } from '../Firebase/context';
import * as ROUTES from '../../Constants/Routes';

import {Form, Button} from 'semantic-ui-react';
import './loginForm.css';

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { email, password } = this.state;
        console.log(this.props)
        this.props.firebase.exFirebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.change();
            })
            .catch(error => {
                this.setState({ error });
            });
        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { email, password, error } = this.state;
        const isInvalid = password === '' || email === '';
        return (
            <Form id='log-in' onSubmit={this.onSubmit}>
                <Form.Field>
                    <label>Credentials 1</label>
                    <input name='email' type='email' onChange={this.onChange} />
                </Form.Field>
                <Form.Field>
                    <label>Credentials 2</label>
                    <input name='password' type='password' onChange ={this.onChange} />
                </Form.Field>
                <Button type='submit'>Login</Button>
                <SignUpLink />
            </Form>
        );
    }
}


const SignInForm = compose(withFirebase)(LoginForm);
export default SignInForm;
