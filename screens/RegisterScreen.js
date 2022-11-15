import {
  StyleSheet,
  Text,
  View,
  StatusBar
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { auth } from "../firebase";
import { Input, Button } from "@rneui/themed";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
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
    <View behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Text h3 style={{ marginBottom: 50, fontSize: 28 }}>
        Create a Chat account
      </Text>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Full name"
          autoFocus
          type=""
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Input
          placeholder="Email"
          textContentType="emailAddress"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          textContentType="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <Input
          placeholder="Profile Picture URL (optional)"
          value={imageUri}
          onChangeText={(text) => setImageUri(text)}
          onSubmitEditing={register}
        />
      </View>
      <Button onPress={register} style={styles.button} title="Register" />
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  button: { width: 200, marginTop: 10 },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
  inputContainer: { width: 300 },
});
