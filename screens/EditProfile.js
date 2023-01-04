import { StyleSheet, Text, View, TouchableOpacity,
    ImageBackground, Image,
   } from "react-native";
  import React from "react";
  import { useLayoutEffect } from "react";
  import { Button, Input } from "@rneui/themed";
  import { useState } from "react";
  import Entypo  from "react-native-vector-icons/Entypo";
  import { db } from "../firebase";

  // import Picture from '.\assets\anh-chan-dung.jpg';
  
  const EditProfile = ({ navigation }) => {
    const [input, setInput] = useState("");
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [me, setMe] = useState("");
    const [mail, setMail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    useLayoutEffect(() => {
      navigation.setOptions({
        title: "Edit profile",
        headerBackTitle: "Chats",
      });
    }, [navigation]);
    const createChat = async () => {
      await db
        // .collection("chats")
        // .add({
        //   chatName: input,
        // })
        .then(() => {
          navigation.navigate("Home");
        })
        .catch((error) => alert(error));
    };
    return (
      <View style={styles.container}>
        <Image
          source={require("../assets/anh-chan-dung.jpg")}
          style={{width: 100, height: 100 }}
        />
        <Text >Leo</Text>
        <Input 
          placeholder="Name"
          value={name}
          onChangeText={(text) => setName(text)}
          onSubmitEditing={createChat}
          leftIcon={<Entypo name="user" size={24} color="black" />}
        />
        <Input
          placeholder="Age"
          value={age}
          onChangeText={(text) => setAge(text)}
          onSubmitEditing={createChat}
          leftIcon={<Entypo name="ruler" size={24} color="black" />}
        />
        <Input
          placeholder="Gender"
          value={gender}
          onChangeText={(text) => setGender(text)}
          onSubmitEditing={createChat}
          leftIcon={<Entypo name="man" size={24} color="black" />}
        />
        <Input
          placeholder="About me"
          value={me}
          onChangeText={(text) => setMe(text)}
          onSubmitEditing={createChat}
          leftIcon={<Entypo name="text-document" size={24} color="black" />}
        />
        <Input
          placeholder="Mail"
          value={mail}
          onChangeText={(text) => setMail(text)}
          onSubmitEditing={createChat}
          leftIcon={<Entypo name="mail" size={24} color="black" />}
        />
        <Input
          placeholder="Phone"
          value={phone}
          onChangeText={(text) => setPhone(text)}
          onSubmitEditing={createChat}
          leftIcon={<Entypo name="phone" size={24} color="black" />}
        />
        <Input
          placeholder="Address"
          value={address}
          onChangeText={(text) => setAddress(text)}
          onSubmitEditing={createChat}
          leftIcon={<Entypo name="location" size={24} color="black" />}
        />
        <Button style={styles.button} disabled={!input} onPress={createChat} title="Up date"/>
      </View>
  
    );
  };
  
  export default EditProfile;
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: "while",
      padding: 15,
      height: "100%",
      alignItems: 'center',
    },
    // button:{
    //   width: 400,
    // },
  });
  