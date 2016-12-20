import firebase from 'firebase'
import { getConfig } from '../common'

const config = getConfig().import.firebase

console.log(config)


firebase.initializeApp(config);

const db = firebase.database();

console.log(db)
