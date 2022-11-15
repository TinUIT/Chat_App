import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  StatusBar
} from "react-native";
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { Button, Input } from "@rneui/themed";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require("../assets/logo.png")}
       
        style={{ width: 200, height: 200, borderRadius: 30, marginBottom: 20 }}
      />
      <View style={styles.inputContainer}>
     
        <Input
          style={styles.inputContainer}
          placeholder="Email"
          autoFocus
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text.replace(/\s/g, ''))}
        />
        <Input
          style={styles.inputContainer}
          placeholder="Password"
          secureTextEntry
          type="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={signIn}
        />
      </View>
      <Button containerStyle={styles.button} onPress={signIn} title="Login" />

      <Button
        onPress={() => navigation.navigate("Register")}
        containerStyle={styles.button}
        title="Register"
        type="outline"
      />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  inputContainer: { width: 300 },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});
