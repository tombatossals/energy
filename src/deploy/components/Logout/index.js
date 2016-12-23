import React from 'react';

export default class extends React.Component {
    constructor(props) {
        super(props)
        props.firebase.auth().signOut()
    }

    render() {
        return (
            <div>Logged out</div>
        )
    }
}