import React, { useCallback, useEffect, useReducer, useState } from 'react';
import Input from '../components/Input';
import SubmitButton from '../components/SubmitButton';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducer';
import { signIn } from '../utils/actions/authActions';
import { ActivityIndicator, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import colors from '../constants/colors';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import CustomHeaderButton from './CustomHeaderButton';
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseApp } from '../utils/firebaseHelper';
import { result } from 'validate.js';
import { useSelector } from "react-redux";

const isTestMode = false;

const initialState = {
    inputValues: {
        email: isTestMode ? "" : "",
        password: isTestMode ? "" : "",
    },
    inputValidities: {
        email: isTestMode,
        password: isTestMode,
    },
    formIsValid: isTestMode
}

const SignInForm = props => {
    const dispatch = useDispatch();
    const userData = useSelector(state => state.auth.userData);
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [formState, dispatchFormState] = useReducer(reducer, initialState);
    const [seePassword, setSeePassword] = useState(true);
    // const [email, setEmail] = useState(null);

    const inputChangedHandler = useCallback((inputId, inputValue) => {
        const result = validateInput(inputId, inputValue);
        dispatchFormState({ inputId, validationResult: result, inputValue })
    }, [dispatchFormState]);

    useEffect(() => {
        if (error) {
            Alert.alert("An error occured", error, [{ text: "Okay" }]);
        }
    }, [error])

    const authHandler = useCallback(async () => {
        try {
            setIsLoading(true);
            const action = signIn(
                formState.inputValues.email,
                formState.inputValues.password,
            );
            setError(null);
            await dispatch(action);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    }, [dispatch, formState]);
    const resetPassword = useCallback(async () => {
        if (formState.inputValues.email != null) {
            const app = getFirebaseApp();
            const auth = getAuth(app);
            sendPasswordResetEmail(auth, formState.inputValues.email)
                .then(() => {
                    Alert.alert("Notify", "Check email to reset password", [{ text: "OK" }])
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    Alert.alert("Notify", "Please enter a valid email", [{ text: "OK" }])
                });
            
        }
        else { Alert.alert("Notify", "Please enter a valid email", [{ text: "OK" }]) }


    }, [dispatch, formState]);

    return (
        <View style={styles.InputCover}>
            <Input
                id="email"
                label="Email"
                icon="mail"
                iconPack={Feather}
                autoCapitalize="none"
                keyboardType="email-address"
                onInputChanged={inputChangedHandler}
                initialValue={formState.inputValues.email}
                errorText={formState.inputValidities["email"]}
            // value={email}

            />

            <Input
                id="password"
                label="Password"
                icon="lock"
                iconPack={Feather}
                autoCapitalize="none"
                secureTextEntry={seePassword}
                onInputChanged={inputChangedHandler}
                initialValue={formState.inputValues.password}
                errorText={formState.inputValidities["password"]}
            >

            </Input>
            <TouchableOpacity
                style={styles.wrapperIcon}
                onPress={() => setSeePassword(!seePassword)}>
                <Image source={
                    seePassword
                        ? require('../assets/images/show_pass.png')
                        : require('../assets/images/hide_pass.png')
                }
                    style={styles.Icon} >

                </Image>
                <Text style={{ fontSize: 13, color: '#666666' }}>   Show password!</Text>
            </TouchableOpacity>


            {
                isLoading ?
                    <ActivityIndicator size={'small'} color={colors.primary} style={{ marginTop: 10 }} /> :
                    <SubmitButton
                        title="Sign in"
                        onPress={authHandler}
                        style={{ marginTop: 20 }}
                        disabled={!formState.formIsValid} />
            }
            <TouchableOpacity
                style={{ alignItems: 'center', marginTop: 15, marginBottom: -5 }}
                onPress={resetPassword}
            >
                <Text style={styles.link}>Forgot password ?</Text>

            </TouchableOpacity>

        </View>
    )
};

const styles = StyleSheet.create({
    InputCover: {
        marginTop: '10%',
        width: 275,
    },

    wrapperIcon: {

        // bottom: 55,
        // marginLeft:"50%",
        // paddingLeft:"50%",
        // position: 'relative',
        flexDirection: 'row',
        left: 5,
        marginTop: "-3%",
    },
    Icon: {
        left: 5,
        width: 20,
        height: 20,
    },
    link: {
        color: colors.blue,
        fontFamily: 'medium',
        letterSpacing: 0.3
    }

})


export default SignInForm;