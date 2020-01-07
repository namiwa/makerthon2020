import React from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
 
import App from '../imports/ui/App';
import { FirebaseContext } from '../imports/ui/Components/Firebase/context';
import Firebase from '../imports/ui/Components/Firebase/firebase';

  const store = Firebase;
// Meteor.startup(() => {
//     console.log(FirebaseContext);
//     console.log(Firebase);
//     ReactDOM.render(
//         <FirebaseContext.Provider value={ store }>
//             <App />
//         </FirebaseContext.Provider>,
//         document.getElementById('root')
//     );
// });

export const context = React.createContext(null);
export default context;

Meteor.startup(() => {
    ReactDOM.render(
        <context.Provider value={ Firebase }>
            <App />
        </context.Provider>,
        document.getElementById('root')
    );
});
