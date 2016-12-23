import React from 'react';
import './styles.css'

export default ({ firebase }) => {
  const login = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    firebase.auth().signInWithPopup(provider).then(function(result) {
      const token = result.credential.accessToken;
      const user = result.user
      console.log(user, token)
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
