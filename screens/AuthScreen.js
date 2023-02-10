import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import PageContainer from '../components/PageContainer';
import SignInForm from '../components/SignInForm';
import SignUpForm from '../components/SignUpForm';
import colors from '../constants/colors';
import { ImageBackground } from "react-native";
var inputstyle ;
const AuthScreen = props => {

    const [isSignUp, setIsSignUp] = useState(false);
    return <SafeAreaView style={{ flex: 1 }}>
        <PageContainer>
        <ScrollView 
            style={{marginTop: isSignUp ? "2%": "25%"}}       
            disableScrollViewPanResponder={true}
            showsVerticalScrollIndicator={false}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === "ios" ? "height" : undefined}
                keyboardVerticalOffset={100}>
                <Image
                    source={require("../assets/images/logo.png")}
                    style={{ width: 100, height: 100, borderRadius: 15, marginTop: '0%' }}
                />
                {
                    isSignUp ?   
                        <Text style={{ marginTop: '5%', fontSize: 28, color: 'white', fontWeight: 'bold', marginBottom: '5%' }}>
                            Create an account
                        </Text>:
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 28, marginTop: '5%', marginBottom: '5%' }}> Welcome to Chat App</Text> 
                }
                <View style={{
                            marginTop: 15,
                            backgroundColor: 'white',
                            width: 315,
                            height: isSignUp ? 600: 400,
                            alignItems: "center",
                            borderRadius: 20,
                            
                }}>
                    {
                        isSignUp ?
                            <SignUpForm /> :
                            <SignInForm />
                    }

                    <TouchableOpacity
                        onPress={() => setIsSignUp(prevState => !prevState)}
                        style={styles.linkContainer}>
                        <Text style={styles.link}>{`Switch to ${isSignUp ? "sign in" : "sign up"}`}</Text>
                    </TouchableOpacity>
                </View>
 
            </KeyboardAvoidingView>
            </ScrollView>
            </PageContainer>
    </SafeAreaView>
};

const styles = StyleSheet.create({
    linkContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15
    },
    link: {
        color: colors.blue,
        fontFamily: 'medium',
        letterSpacing: 0.3
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 30,
        marginTop: '10%'
    },
    keyboardAvoidingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
    },
})

export default AuthScreen;