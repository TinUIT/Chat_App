import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD7APluopQvzQfTJ2DZjNF1wfCEdFsffIg",
  authDomain: "chat-app-9bbb0.firebaseapp.com",
  projectId: "chat-app-9bbb0",
  storageBucket: "chat-app-9bbb0.appspot.com",
  messagingSenderId: "985548449156",
  appId: "1:985548449156:web:90f6b187f5b0913ff5a9d1",
  measurementId: "G-D7FG7R0ZME"
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };
