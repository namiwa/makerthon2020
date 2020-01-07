import React, { Component, createRef } from 'react';
import { Menu, Input, Grid, Sticky} from 'semantic-ui-react';

import Create from './Create/create';
import Account from './Account/account'

import CardPage from './Card/cardList';
import { Redirect } from 'react-router-dom';

import './menu.css';

import { FirebaseContext } from './Firebase';
import * as Firebase from './Firebase/firebase';
import { withFirebase } from './Firebase';
import './Firebase/firebase';
import { compose } from 'recompose';

class MenuForm extends Component {
    constructor(props) {
        super(props);
        let contextRef = createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.state = {
            activeItem: 'CC events',
            search: '',
            accountName: ''
        }
    }

    getName = async () => {
        let uid = this.props.firebase.exFirebase.auth.currentUser.uid;
        let document = this.props.firebase.exFirebase.db.collection('users').doc(uid);

        let name = "";
        await document.get().then(function(doc) {
            name = doc.data().username;
        }).catch(function(error) {
        console.log("Error getting document:", error);
        });

        return name;
    }

    currentEvent = () => (
        (this.state.activeItem === "CC events") ? (
            <CardPage searchby={this.state.search}/>
        ) : (this.state.activeItem === "Create events") ?(
            <Create />
        ) : (
            <Account />
        )
    )

    handleItemClick = (e, { name }) => {
        this.setState({activeItem: name}, function() {
            this.currentEvent();
        });
    }

    handleChange = () => {
        this.props.change();
        return(
            <Redirect to='/' />
        )   
    } 

    onChange = () => {
        this.setState({ search : event.target.value})
    }

    data = async () => {
        const name = await this.getName();
        this.setState({
            ...this.state,
            name: name
        })
        console.log(name)
    }
 
    componentDidMount() {
        this.data()
    }

    render() {
        console.log(this.state)
        return(
            <div ref={this.contextRef} >
                <Sticky context={this.contextRef}>
                    <Grid textAlign='center' id='menu-bar'>
                        <Menu secondary size='large'>
                            <Menu.Item
                                name='CC events'
                                active={this.state.activeItem === 'CC events'}
                                onClick={this.handleItemClick}
                                id='CC-events'
                            />
                            <Menu.Item 
                                name='Create events'
                                active={this.state.activeItem === 'Create events'}
                                onClick= {this.handleItemClick}
                            />
                            <Menu.Item
                                name='Account'
                                active={this.state.activeItem === 'Account'}
                                onClick= {this.handleItemClick}
                            />
                            <Menu.Item 
                                className='log-out'
                                name='Logout'
                                onClick={this.handleChange}
                            />
                            <Menu.Item>
                                <Input icon='search' placeholder='Search...' onChange={this.onChange}/>
                            </Menu.Item>
                        </Menu>
                    </Grid>
                </Sticky>

                {
                    this.currentEvent()
                }
            </div>
        );
    }
};

const MenuBar = compose(withFirebase)(MenuForm);

export default MenuBar;
