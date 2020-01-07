import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as ROUTES from '../../Constants/Routes';
import { FirebaseContext } from '../Firebase';
import * as Firebase from '../Firebase/firebase';
import { withFirebase } from '../Firebase';
import '../Firebase/firebase'
import { compose } from 'recompose';

import {Form, Button} from 'semantic-ui-react';
import './create.css';

const CreatePage = () => (
    <div>
        <CreateForm />
    </div>
);

const INITIAL_STATE = {
    name: '',
    location: '',
    date: '',
    error: null,
    openForm: false
};

class CreateBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    writeUserData = e => {
        e.preventDefault();
        const userRef = this.props.firebase.exFirebase.db.collection('events').add({
            name: this.state.name,
            location: this.state.location,
            date: this.state.date
        });
        this.setState({
            ...this.state,
            ...INITIAL_STATE
        })
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    showForm = () => {
        this.setState({openForm: true})
    }

    render() {
        console.log(this.props);
        const {
            name,
            location,
            date,
            error,
        } = this.state;

        const isInvalid =
            name === '' ||
            location === '' ||
            date === '';

        return (
            <div id='create-form'>
                <h4>Interested in finding like-minded people around you? </h4>
                <Button onClick={this.showForm}> Organize your own gathering </Button>
                <br />
                {
                    (this.state.openForm) ? (
                        <Form onSubmit={this.writeUserData} id="form-field">
                            <Form.Field>
                                <label> Event Name</label>
                                <input
                                    name="name"
                                    value={name}
                                    placeholder="Event Name"
                                    onChange={this.onChange}
                                    type="text"
                                />
                            </Form.Field>
                            <Form.Field>
                                <label> Location</label>
                                <input
                                    name="location"
                                    value={location}
                                    placeholder="Location"
                                    onChange={this.onChange}
                                    type="text"
                                />
                            </Form.Field>
                            <Form.Field>
                                <label> Date</label>
                                <input
                                    name="date"
                                    value={date}
                                    placeholder="DateTime"
                                    onChange={this.onChange}
                                    type="datetime-local"
                                />
                            </Form.Field>
                            <Button disabled={isInvalid} type="submit">Create Event</Button>
                            {error && <p>{error.message}</p>}
                        </Form>
                    ) : ""
                }
            </div>
        );
    }
}

const CreateForm = compose(withFirebase)(CreateBase);

export default CreatePage;
export { CreateForm };