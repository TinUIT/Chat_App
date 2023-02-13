import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import DataItem from '../components/DataItem';
import Input from '../components/Input';
import PageContainer from '../components/PageContainer';
import PageTitle from '../components/PageTitle';
import ProfileImage from '../components/ProfileImage';
import SubmitButton from '../components/SubmitButton';
import colors from '../constants/colors';
import { addUsersToChat, removeUserFromChat, updateChatData } from '../utils/actions/chatActions';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducer';

const ChatSettingsScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const chatId = props.route.params.chatId;
    const chatData = useSelector(state => state.chats.chatsData[chatId] || {});
    const userData = useSelector(state => state.auth.userData);
    const storedUsers = useSelector(state => state.users.storedUsers);
    const starredMessages = useSelector(state => state.messages.starredMessages[chatId] ?? {});

    const initialState = {
        inputValues: { chatName: chatData.chatName },
        inputValidities: { chatName: undefined },
        formIsValid: false
    }

    const [formState, dispatchFormState] = useReducer(reducer, initialState);

    const selectedUsers = props.route.params && props.route.params.selectedUsers;
    useEffect(() => {
        if (!selectedUsers) {
            return;
        }

        const selectedUserData = [];
        selectedUsers.forEach(uid => {
            if (uid === userData.userId) return;

            if (!storedUsers[uid]) {
                console.log("No user data found in the data store");
                return;
            }

            selectedUserData.push(storedUsers[uid]);
        });

        addUsersToChat(userData, selectedUserData, chatData);

    }, [selectedUsers]);

    const inputChangedHandler = useCallback((inputId, inputValue) => {
        const result = validateInput(inputId, inputValue);
        dispatchFormState({ inputId, validationResult: result, inputValue })
    }, [dispatchFormState]);

    const saveHandler = useCallback(async () => {
        const updatedValues = formState.inputValues;

        try {
            setIsLoading(true);
            await updateChatData(chatId, userData.userId, updatedValues);

            setShowSuccessMessage(true);

            setTimeout(() => {
                setShowSuccessMessage(false)
            }, 1500);
        } catch (error) {
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [formState]);

    const hasChanges = () => {
        const currentValues = formState.inputValues;
        return currentValues.chatName != chatData.chatName;
    }

    const leaveChat = useCallback(async () => {
        try {
            setIsLoading(true);

            await removeUserFromChat(userData, userData, chatData);

            props.navigation.popToTop();
        } catch (error) {
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [props.navigation, isLoading])

    if (!chatData.users) return null;

    return <View style={{ ...styles.container }}>
        <PageTitle />

        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollView}>
            <ProfileImage
                showEditButton={true}
                size={80}
                chatId={chatId}
                userId={userData.userId}
                uri={chatData.chatImage}
            />

            <Input
                id="chatName"
                label="Chat name"
                autoCapitalize="none"
                initialValue={chatData.chatName}
                allowEmpty={false}
                onInputChanged={inputChangedHandler}
                errorText={formState.inputValidities["chatName"]}
            />
            <TouchableOpacity>
                <DataItem
                    title="Search messages"
                    icon="search1"
                    type="button"
                    onPress={() => props.navigation.navigate("SearchMessageScreen", { title: "Search messages", chatId})}
                />
                <DataItem
                    title="Add users"
                    icon="plus"
                    type="button"
                    onPress={() => props.navigation.navigate("NewChat", { isGroupChat: true, existingUsers: chatData.users, chatId })}
                />
                <DataItem
                    title="Starred messages"
                    icon="staro"
                    type="button"
                    onPress={() => props.navigation.navigate("DataList", { title: "Starred messages", data: Object.values(starredMessages), type: "messages", })}
                />
            </TouchableOpacity>


            <View style={styles.sectionContainer}>
                <View style={styles.SeeContainer}>
                    <Text style={styles.heading}>{chatData.users.length} Participants</Text>
                    {chatData.users.length > 4 &&
                        <TouchableOpacity
                            type={"link"}
                            hideImage={true}
                            onPress={() => props.navigation.navigate("DataList", { title: "Participants", data: chatData.users, type: "users", chatId })}>
                            <Text style={styles.seeallText}> See all </Text>
                        </TouchableOpacity>}

                </View>



                {
                    chatData.users.slice(0, 4).map(uid => {
                        const currentUser = storedUsers[uid];
                        return <DataItem
                            key={uid}
                            image={currentUser.profilePicture}
                            title={`${currentUser.firstName} ${currentUser.lastName}`}
                            subTitle={currentUser.about}
                            type={uid !== userData.userId && "link"}
                            onPress={() => uid !== userData.userId && props.navigation.navigate("Contact", { uid, chatId })}
                        />
                    })
                }


            </View>



            {showSuccessMessage && <Text>Saved!</Text>}

            {
                isLoading ?
                    <ActivityIndicator size={'small'} color={colors.primary} /> :
                    hasChanges() && <SubmitButton
                        title="Save changes"
                        color={colors.primary}
                        onPress={saveHandler}
                        disabled={!formState.formIsValid}
                    />
            }
            <View style={{ width: '100%' }}>

            </View>
        </ScrollView>

        {
            <SubmitButton
                title="Leave chat"
                color={colors.red}
                onPress={() => leaveChat()}
                style={{ marginBottom: 20 }}
            />
        }
    </View>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#1B313E',
        borderTopColor: 'black',
        borderTopWidth: 0.5,
    },
    scrollView: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    sectionContainer: {
        width: '100%',
        marginTop: 10,
    },
    heading: {
        marginVertical: 8,
        color: "white",
        fontFamily: 'bold',
        letterSpacing: 0.3
    },
    SeeContainer: {
        flexDirection: 'row',
        width: '100%',

    },
    seeallText: {
        marginLeft: 170,
        marginTop: 9,
        fontSize: 15,
        color: colors.primary,
    }
})

export default ChatSettingsScreen;