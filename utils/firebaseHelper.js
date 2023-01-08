// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

export const getFirebaseApp = () => {
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyD7APluopQvzQfTJ2DZjNF1wfCEdFsffIg",
        authDomain: "chat-app-9bbb0.firebaseapp.com",
        projectId: "chat-app-9bbb0",
        storageBucket: "chat-app-9bbb0.appspot.com",
        messagingSenderId: "985548449156",
        appId: "1:985548449156:web:90f6b187f5b0913ff5a9d1",
        measurementId: "G-D7FG7R0ZME",
        databaseURL: "https://chat-app-9bbb0-default-rtdb.asia-southeast1.firebasedatabase.app"
    };
    
    // Initialize Firebase
    return initializeApp(firebaseConfig);
}