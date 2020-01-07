import React from 'react';
import { Form, Button, Popup, Grid } from 'semantic-ui-react';
import './joinForm.css';
import {compose} from "recompose";
import {withFirebase} from "../Firebase";

const JoinPage = (props) => (
    <div>
        <Form>
            <Grid columns={2}>
                <Grid.Column textAlign='center' stretched width={14}>
                    <p>You are signing up for: </p>
                    <b className='event-name'>{props.event}</b>
                </Grid.Column>
                <Grid.Column width={2}>
                    <Popup 
                        className='close-form' 
                        trigger={<Button icon='close' onClick={props.goback}/>}
                        inverted
                    >
                        <p>Click here to close this form</p>
                    </Popup>
                </Grid.Column>
                <Grid.Column textAlign='center' width={14}>
                    <Button className='sign-up' onClick={props.signedup}> Click here to register </Button>
                </Grid.Column>
            </Grid>
        </Form>
    </div>
)

// export default JoinForm;

const JoinForm = compose(withFirebase)(JoinPage);

export default JoinForm;