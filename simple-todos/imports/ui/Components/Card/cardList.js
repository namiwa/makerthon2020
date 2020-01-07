import React, { Component } from "react";
import { Link, withRouter } from 'react-router-dom';
import { Grid, Loader } from 'semantic-ui-react';
import EntryCard from './card.js';
import './cardList.css';
import { FirebaseContext } from '../Firebase';
import * as Firebase from '../Firebase/firebase';
import { withFirebase } from '../Firebase';
import '../Firebase/firebase';
import { compose } from 'recompose';

class CardList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entries : [],
            isLoading: false
        }
    }

    readEventData = e => {
        let entries = [];
        const writeCard = this.props.firebase.exFirebase.db.collection('events').get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    entries.push({Name: doc.id, Description: doc.data().name, Location: doc.data().location,
                        Date:doc.data().date });
                });
            });
        return entries;
    }

    filterEntries = (searchby) => {
        if(searchby === '') {
            return this.state.entries;
        } else {
            let filteredEntries = [];
            this.state.entries.forEach((entry) => {
                if(entry.Description.toLowerCase().includes(searchby.toLowerCase()) || entry.Location.toLowerCase().includes(searchby.toLowerCase())) {
                    filteredEntries.push(entry);
                }
            })
            return filteredEntries;
        }
    }

    componentDidMount() {
        this.setState({entries: this.readEventData()})
        this.forceUpdate()
        setInterval(() => {
            this.setState({isLoading: false})
        }, 200)
    }

    render() {
        let filteredArr = this.filterEntries(this.props.searchby);
        return(
            <Grid textAlign='left' columns={3} className='card-list' stackable>
                {
                    (this.state.isLoading) ? (
                        <Loader active/>
                    ) : (
                        filteredArr.map((entry) => (
                            <Grid.Column stretched>
                                <EntryCard name={entry.Name} description={entry.Description} location={entry.Location} date={entry.Date} />
                            </Grid.Column>
                        ))
                    )
                }
            </Grid>
        );
    }

}

const CardPage = compose(withFirebase)(CardList);

export default CardPage;

