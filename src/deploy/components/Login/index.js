import React from 'react';
import './styles.css'

export default ({ firebase }) => {
  const login = () => {
    // Using a popup.
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user

      console.log(token, user)
    });
  }
  return (
    <div className='Login'>
      <div className='Login-box'>
        <button type="button" onClick={login} className="pt-button pt-large pt-icon-add">Login with Google</button>
      </div>
    </div>
  )
}
