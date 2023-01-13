import { getFirebaseApp } from '../firebaseHelper';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { child, getDatabase, ref, set, update } from 'firebase/database';
import { authenticate, logout } from '../../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData } from './userActions';
import {Alert } from 'react-native';
import RNRestart from 'react-native-restart';

let timer;

export const signUp = (firstName, lastName, email, password) => {
    return async dispatch => {
        const app = getFirebaseApp();
        const auth = getAuth(app);


        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            
            const { uid, stsTokenManager } = result.user;
            const userData = await createUser(firstName, lastName, email, uid);
            if (result.user.emailVerified == true) {
                

                
                const { accessToken, expirationTime } = stsTokenManager;

                const expiryDate = new Date(expirationTime);
                const timeNow = new Date();
                const millisecondsUntilExpiry = expiryDate - timeNow;

                

                dispatch(authenticate({ token: accessToken, userData }));
                saveDataToStorage(accessToken, uid, expiryDate);

                timer = setTimeout(() => {
                    dispatch(userLogout());
                }, millisecondsUntilExpiry);
            }
        }
        catch (error) {
            console.log(error);
            const errorCode = error.code;

            let message = Alert.alert("Notify", "Account successfully created!Please Verify your email to sign in!", [{ text: "OK" }]);
           

            if (errorCode === "auth/email-already-in-use") {
                message = "This email is already in use";
            }

            throw new Error(message);
        }
    }
}

export const signIn = (email, password) => {
    return async dispatch => {
        const app = getFirebaseApp();
        const auth = getAuth(app);

        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            console.log(result);
            if (result.user.emailVerified == false) {
                Alert.alert("Notify", "Please Verify your email to sign in!", [{ text: "OK" }])
                RNRestart.Restart();
            }
            else {
                const { uid, stsTokenManager } = result.user;
                const { accessToken, expirationTime } = stsTokenManager;

                const expiryDate = new Date(expirationTime);
                const timeNow = new Date();
                const millisecondsUntilExpiry = expiryDate - timeNow;

                const userData = await getUserData(uid);

                dispatch(authenticate({ token: accessToken, userData }));
                saveDataToStorage(accessToken, uid, expiryDate);

                timer = setTimeout(() => {
                    dispatch(userLogout());
                }, millisecondsUntilExpiry);
            }




        } catch (error) {
            const errorCode = error.code;


            let message = "Please Verify your email to sign in!";

            if (errorCode === "auth/wrong-password" || errorCode === "auth/user-not-found") {
                message = "The username or password was incorrect";
            }



            throw new Error(message);
        }
    }
}

export const userLogout = () => {
    return async dispatch => {
        AsyncStorage.clear();
        clearTimeout(timer);
        dispatch(logout());
    }
}

export const updateSignedInUserData = async (userId, newData) => {
    if (newData.firstName && newData.lastName) {
        const firstLast = `${newData.firstName} ${newData.lastName}`.toLowerCase();
        newData.firstLast = firstLast;
    }

    const dbRef = ref(getDatabase());
    const childRef = child(dbRef, `users/${userId}`);
    await update(childRef, newData);
}

const createUser = async (firstName, lastName, email, userId) => {
    const firstLast = `${firstName} ${lastName}`.toLowerCase();
    const userData = {
        firstName,
        lastName,
        firstLast,
        email,
        userId,
        signUpDate: new Date().toISOString()
    };

    const dbRef = ref(getDatabase());
    const childRef = child(dbRef, `users/${userId}`);
    await set(childRef, userData);
    return userData;
}

const saveDataToStorage = (token, userId, expiryDate) => {
    AsyncStorage.setItem("userData", JSON.stringify({
        token,
        userId,
        expiryDate: expiryDate.toISOString()
    }));
}