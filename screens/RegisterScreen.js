import {
  StyleSheet,
  Text,
  View,
  TextInput,
  StatusBar,
  KeyboardAvoidingView
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { auth } from "../firebase";
import { Input, Button } from "@rneui/themed";
import { ImageBackground } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
const RegisterScreen = ({ navigation }) => {

  const [name, setName] = useState("");
  const [Lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUri, setImageUri] = useState("");

  const register = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: name,
          photoURL:
            imageUri ||
            "https://www.nicepng.com/png/detail/136-1366211_group-of-10-guys-login-user-icon-png.png",
        });
      })
      .catch((error) => alert(error.message));
  };
  return (
    <SafeAreaView>
      <View behavior="padding">
        <ImageBackground
          source={require("../assets/background.jpg")} style={{ height: '100%' }}
        >

          <KeyboardAvoidingView style={styles.container}>
            <StatusBar style="light" />
            <View></View>
            <Text style={{ marginTop: '10%', fontSize: 28, color: 'white', fontWeight: 'bold', marginBottom: '10%' }}>
              Create a account
            </Text>
            <View style={styles.inputContainer}>
              <View style={styles.InputCover} >
                <TextInput
                  style={styles.input}
                  placeholder="Last name"
                  autoFocus
                  type=""
                  value={Lastname}
                  onChangeText={(text) => setLastName(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Your Name"
                  autoFocus
                  type=""
                  value={name}
                  onChangeText={(text) => setName(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  textContentType="emailAddress"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry
                  textContentType="password"
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  secureTextEntry
                  textContentType="password"
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Profile Picture URL (optional)"
                  value={imageUri}
                  onChangeText={(text) => setImageUri(text)}
                  onSubmitEditing={register}
                />

              </View>
              <Button onPress={register} containerStyle={styles.button} title="Register" color="#F26398" />


            </View>

          </KeyboardAvoidingView>

        </ImageBackground>

      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({

  container: {

    alignItems: "center",
    justifyContent: "center",
    padding: 10,




  },
  inputContainer: {
    backgroundColor: "white",
    height: '90%',
    width: 400,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    alignItems: "center",

  },
  input: {
    alignItems: "center",
    borderRadius: 70,
    backgroundColor: 'rgb(220,220,220)',
    marginBottom: '5%',
    paddingLeft: 15,
    height: '10%',
    paddingTop: 0,
    paddingBottom: 0,






  },
  InputCover: {
    paddingTop: '20%',
    width: '65%',


  },
  button: {

    width: 250,
    marginTop: '5%',
    borderRadius: 100,
    shadowRadius: 50,
    textAlign: "center",
  },
});
