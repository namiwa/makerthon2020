import React, { Component } from "react";
import { Card, Item, Grid, Image } from 'semantic-ui-react';

import { FirebaseContext } from '../Firebase';
import * as Firebase from '../Firebase/firebase';
import { withFirebase } from '../Firebase';
import '../Firebase/firebase';
import { compose } from 'recompose';

import './account.css';

class AccountForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            events: [],
            email: ''
        }
    }

    getAccountEvents = async () => {
        let uid = this.props.firebase.exFirebase.auth.currentUser.uid;
        let document = this.props.firebase.exFirebase.db.collection('users').doc(uid);

        let arr = [];
        await document.get().then(function(doc) {
            console.log("Document data:", doc.data());
            arr = doc.data().events;
        }).then(() => {
            console.log(arr)
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });

        let finalarr=[];
        // for(let s in arr) {
        //     let docu = await this.props.firebase.exFirebase.db.collection('events').doc(s);
        //     console.log(docu);
        //
        //     await docu.get().then(function(doc) {
        //         let eventName = doc.data().description;
        //         finalarr.push(eventName);
        //         console.log(eventName);
        //     }).then(() => {
        //         console.log(eventName);
        //     }).catch(function(error) {
        //         console.log("Error getting document:", error);
        //     });
        // }
        //
        let data = await Promise.all(arr.map( async (ele) => {
            let docu = await this.props.firebase.exFirebase.db.collection('events').doc(ele);
            await docu.get().then(function(doc) {
                let eventName = doc.data().name;
                finalarr.push(eventName);
                console.log(eventName);
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
        }))

        console.log(finalarr);
        console.log(data);
        console.log(arr);
        return finalarr;
    }

    getAccountName = async () => {
        let uid = this.props.firebase.exFirebase.auth.currentUser.uid;
        let document = this.props.firebase.exFirebase.db.collection('users').doc(uid);

        let name = "";
        await document.get().then(function(doc) {
            console.log("Document data:", doc.data());
            name = doc.data().username;
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });

        console.log(name);
        return name;
    }

    getAccountEmail = async () => {
        let uid = this.props.firebase.exFirebase.auth.currentUser.uid;
        let document = this.props.firebase.exFirebase.db.collection('users').doc(uid);

        let email = "";
        await document.get().then(function(doc) {
            console.log("Document data:", doc.data());
            console.log(doc.data().email);
            email = doc.data().email;
            console.log(email);
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });

        console.log(email);
        return email;
    }


    data = async () => {
        const events = await this.getAccountEvents();
        const name = await this.getAccountName();
        const email = await this.getAccountEmail();

        this.setState({
            ...this.state,
            name: name,
            events: events,
            email: email
        })
    }


    componentDidMount() {
        this.data()
    }

     render() {
        return (
            <div id='account-cards'>
                <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped size='tiny' />
                <br/>
                <h1>{this.state.name}</h1>
                <h3>Joined Events</h3>
                <Grid textAlign='center'>
                    <Grid.Column>
                    {
                        <Card.Group id='account-cards'>
                            {
                                this.state.events.map((event) => {
                                    return(
                                        <Card>
                                            <Card.Content>
                                                <Card.Header as='a'>{event}</Card.Header>
                                            </Card.Content>
                                        </Card>
                                    )
                                })
                            }
                        </Card.Group>
                    }
                    </Grid.Column>
                </Grid>
            </div>
            // /* <ul>
            //     <p>Name : {this.state.name}</p>
            //     <p>Email : {this.state.email}</p>
            //     <div> {this.state.events.map((event) => {
            //         return (<p>{ event }</p>)
            //     })} </div>
            // </ul> */
        );
    }


}

const AccountPage = compose(withFirebase)(AccountForm);

export default AccountPage;
