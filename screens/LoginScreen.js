import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { Button, Input } from "@rneui/themed";
import { BackgroundImage } from "@rneui/base";
import { ImageBackground } from "react-native";


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [seePassword, setSeePassword] = useState(true);
  const [checkValidEmail, setCheckValidEmail] = useState(false);

  const handleCheckEmail = text => {
    let re = /\S+@\S+\.\S+/;
    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    setEmail(text);
    if (re.test(text) || regex.test(text)) {
      setCheckValidEmail(false);
    } else {
      setCheckValidEmail(true);
    }
  };

  const handleLogin = () => {
    const checkPassowrd = checkPasswordValidity(password);
    if (!checkPassowrd) {
      user_login({
        email: email.toLocaleLowerCase(),
        password: password,
      })
        .then(result => {
          if (result.status == 200) {
            AsyncStorage.setItem('AccessToken', result.data.token);
            navigation.replace('Home');
          }
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      alert(checkPassowrd);
    }
  };


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      console.log(authUser);
      if (authUser) {
        navigation.replace("Home");
      }
    });
    return unsubscribe;
  }, []);

  const signIn = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error));
  };
  return (
    <SafeAreaView style={{ flex: 1}}>
      <ImageBackground source={require("../assets/background.jpg")} style={{ height: '100%' }}>

        <KeyboardAvoidingView behavior="padding" style={styles.container}>

          <StatusBar style="light" />
          <Image
            source={require("../assets/logo.jpg")}

            style={{ width: 100, height: 100, borderRadius: 30, marginTop: '10%' }}
          />
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 30, marginTop: '5%', marginBottom: '5%' }}> Welcome to Chat App</Text>

          <View style={styles.inputContainer}>


            <View style={styles.InputCover}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor='dark'
                autoFocus
                type="email"
                value={email}
                onChangeText={(text) => handleCheckEmail(text)}
              />
              {checkValidEmail ? (
                <Text style={styles.textFailed}>Wrong format email!</Text>
              ) : (
                <Text style={styles.textFailed}> </Text>
              )}
              <View style={styles.wrapperInputPass}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor='dark'
                  secureTextEntry={seePassword}
                  type="password"
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  onSubmitEditing={signIn}
                />
                <TouchableOpacity 
                  style={styles.wrapperIconEye}
                  onPress={() => setSeePassword(!seePassword)}>
                  <Image 
                  source={
                    seePassword 
                    ? require('../assets/show_pass.png') 
                    : require('../assets/hide_pass.png')
                    } 
                    style={styles.Icon} />
                </TouchableOpacity>
              </View>


            </View>
            <View style={{ alignItems: 'flex-end', width: 275, width: '80%', marginTop: -5, marginBottom: '5%' }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 10 , marginTop:'5%'}}>Forgot Password ?</Text>
            </View>
            {email == '' || password == '' || checkValidEmail == true ? (
        <TouchableOpacity
          disabled
          style={styles.buttonDisable}
          onPress={handleLogin}>
          <Button containerStyle={styles.button} onPress={signIn} title="Login" color="#A63F52" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Button containerStyle={styles.button} onPress={signIn} title="Login" color="#F26398" />
        </TouchableOpacity>
      )}
            

            <Button
              onPress={() => navigation.navigate("Register")}
              containerStyle={styles.buttonRegister}
              title="Register"
              color="#F2C2CF"



            />

          </View>

        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>


  );

};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: '2%',
    paddingTop: '10%',

    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {

    marginTop: 15,
    backgroundColor: 'white',
    width: 315,
    height: 400,
    alignItems: "center",
    borderRadius: 20,
  },

  InputCover: {
    paddingTop: '15%',
    width: 275,

  },
  input: {
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: 'rgb(220,220,220)',
    marginBottom: '1%',
    paddingLeft: 15,
    // justifyContent: "center",
    height: 50,

  },
  textFailed: {
    alignSelf: 'flex-end',
    color: 'red',
    marginBottom: '5%',
    fontSize:13,
        
  },
  wrapperInputPass:{


  },
  wrapperIconEye:{
    position: 'absolute',
    right: 0,
    padding: 10,
    paddingTop:13,

  },
  Icon:{
    width: 30,
    height: 24,
  },




  button: {
    width: 230,
    marginTop: '10%',
    borderRadius: 100,
    shadowRadius: 50,
    textAlign: "center",
  },
  buttonRegister: {
    width: 230,
    marginTop: 10,
    borderRadius: 50,
    borderColor: 'rgba(78, 116, 289, 1)',
    boder: 50,

  }
});
