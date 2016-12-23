import firebase from 'firebase'
import { getConfig } from './config'

const config = getConfig().deploy.firebase
firebase.initializeApp(config)

export const getFirebase = () => firebase