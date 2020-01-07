import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
 
import Header from './Components/Header/header';
import LoginForm from './Components/Login/loginForm';
import SignupForm from './Components/Signup/signup';

import MenuBar from './Components/menu';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this)
        this.state = {
            isLoggedIn : false
        }
    }

    handleChange() {
        this.setState({isLoggedIn : !this.state.isLoggedIn})
    }

    render() {
        return(
            <Router>
                <div>
                    <Header />
                    <Route path='/'>
                        {
                            this.state.isLoggedIn ? 
                            <div className='menu-bar'>
                                <MenuBar change={this.handleChange}/>
                            </div>
                            :       
                            <Switch>
                                <Route exact path='/'>
                                    <LoginForm change={this.handleChange}/>
                                </Route>
                                <Route exact path='/signup' component={SignupForm} />
                            </Switch>   
                        }      
                    </Route>
                </div>
            </Router>
        );
    }
}