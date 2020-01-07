import React, {Component} from 'react';
import { Card, Icon, Button } from 'semantic-ui-react';
import './card.css';
import JoinForm from '../Join/joinForm';

import { FirebaseContext } from '../Firebase';
import * as Firebase from '../Firebase/firebase';
import { withFirebase } from '../Firebase';
import '../Firebase/firebase';
import { compose } from 'recompose';

class EntryForm extends Component {
  constructor(props) {
    super(props); 
    this.getJoinForm = this.getJoinForm.bind(this);
    this.goBack = this.goBack.bind(this);
    this.signedUp = this.signedUp.bind(this);
    this.state={
      showCard: false
    }
  }

  getJoinForm() {
    this.setState({showCard: !this.state.showCard});
  }

  goBack() {
    this.setState({showCard: false})
  }

  signedUp = async () => {
    console.log("Signed Up");
    console.log(this.props);
    this.setState({showCard: false});

    let uid = this.props.firebase.exFirebase.auth.currentUser.uid;
    let document = this.props.firebase.exFirebase.db.collection('users').doc(uid);
    let test = this.props;

    let arr = [];
    await document.get().then(function(doc) {
      console.log("Document data:", doc.data());
      arr = doc.data().events;
      console.log(arr);
      arr.push(test.name);
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });

    // let arr = document.events;
    console.log(uid, ",", arr);
    // arr.push("new event id");
    await document.update({
      events: arr
    }).then(function() {
      console.log("Document successfully updated!");
    }).catch(function(error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
    });

    console.log(this.props.description);
    alert(`You've signed up for ${ this.props.description } `);
  }

  render() {
    return(
      <div className='full-card'>
        <Card centered fluid className='activity-entry'>
          <Card.Content textAlign='left'>
            <Card.Header>{this.props.description}</Card.Header>
            <Card.Meta>
              <span></span>
            </Card.Meta>
            <Card.Description>
              <ul>
                <li><Icon name='location arrow'size='large' />: {this.props.location}</li>
                <li><Icon name='calendar' size='large'/>: {this.props.date}</li>
              </ul>
            </Card.Description>
          </Card.Content>
          <Card.Content extra className='join-button'>
            <a>
              <Button primary color='green' fluid onClick={this.getJoinForm}>Join</Button>
            </a>
          </Card.Content>
        </Card>
        {
          this.state.showCard ? 
          (
            <div className='join-form'>
              <JoinForm event={this.props.description} goback={this.goBack} signedup={this.signedUp}/>
            </div>
          ) : ""
        }
      </div>
    );  
  }
}

const EntryCard = compose(withFirebase)(EntryForm);

export default EntryCard;
