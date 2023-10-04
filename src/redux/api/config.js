import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

const FBConfig = {
  apiKey: "AIzaSyBseq5PfB-lCkaKjCvv1WZHgRXKWZvyIxM",
  authDomain: "easyconnect-ng.firebaseapp.com",
  projectId: "easyconnect-ng",
  storageBucket: "easyconnect-ng.appspot.com",
  messagingSenderId: "46230751870",
  appId: "1:46230751870:web:07fb0ebd60164e4456662f",
  measurementId: "G-4EEXGDGTZD"
};

firebase.initializeApp(FBConfig);

export default firebase;