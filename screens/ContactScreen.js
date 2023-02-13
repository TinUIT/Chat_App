import React, { useCallback, useEffect, useState, useMemo, } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import DataItem from '../components/DataItem';
import PageContainer from '../components/PageContainer';
import PageTitle from '../components/PageTitle';
import ProfileImage from '../components/ProfileImage';
import SubmitButton from '../components/SubmitButton';
import colors from '../constants/colors';
import { getUserChats } from '../utils/actions/userActions';
import { removeUserFromChat, BlockContact,UnBlockContact } from '../utils/actions/chatActions'
import { ScrollView } from 'react-native-gesture-handler';

const ContactScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const storedUsers = useSelector(state => state.users.storedUsers);
    const userData = useSelector(state => state.auth.userData);
    const currentUser = storedUsers[props.route.params.uid];    

    const storedChats = useSelector(state => state.chats.chatsData);
    const [commonChats, setCommonChats] = useState([]);
    const chatId = props.route.params.chatId;
    const chatData = chatId && storedChats[chatId];

    // const chatData = useSelector(state => state.chats.chatsData[chatId] || {});



    const starredMessages = useSelector(state => state.messages.starredMessages[chatId] ?? {});
    // console.log(starredMessages)
    useEffect(() => {

        const getCommonUserChats = async () => {
            const currentUserChats = await getUserChats(currentUser.userId);
            setCommonChats(
                Object.values(currentUserChats).filter(cid => storedChats[cid] && storedChats[cid].isGroupChat)
            )
        }

        getCommonUserChats();

    }, [])

    const removeFromChat = useCallback(async () => {
        try {
            setIsLoading(true);
            //Remove user
            await removeUserFromChat(userData, currentUser, chatData);

            props.navigation.goBack();
        } catch (error) {
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [props.navigation, isLoading])

    return <View style={{ ...styles.container }}>
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topContainer}>
            <ProfileImage
                uri={currentUser.profilePicture}
                size={80}
                style={{ marginBottom: 20 }}
            />

            <PageTitle text={`${currentUser.firstName} ${currentUser.lastName}`} style={{ textColor: 'white' }} />
            {
                currentUser.about &&
                <Text style={styles.about} numberOfLines={2}>{currentUser.about}</Text>
            }
        </View>
        
        <DataItem
            title="Search messages"
            icon="search1"
            type="button"
            onPress={() => props.navigation.navigate("SearchMessageScreen", { title: "Search messages", chatId})}
        />
        <DataItem
            title="Starred messages"
            icon="staro"
            type="button"
            onPress={() => props.navigation.navigate("DataList", { title: "Starred messages", data: Object.values(starredMessages), type: "messages", })}
        />

        {
            commonChats.length > 0 &&
            <>
                <Text style={styles.heading}>{commonChats.length} {commonChats.length === 1 ? "Group" : "Groups"} in Common</Text>
                {
                    commonChats.map(cid => {
                        const chatData = storedChats[cid];
                        return <DataItem
                            key={cid}
                            title={chatData.chatName}
                            subTitle={chatData.latestMessageText}
                            type="link"
                            onPress={() => props.navigation.push("ChatScreen", { chatId: cid })}
                            image={chatData.chatImage}
                        />
                    })
                }
            </>
        }



        {
            chatData && chatData.isGroupChat &&
            (
                isLoading ?
                    <ActivityIndicator size='small' color={colors.primary} /> :
                    <   SubmitButton
                        title="Remove from chat"
                        color={colors.red}
                        onPress={removeFromChat}
                    />
            )
        }
        {    chatData && !chatData.isGroupChat && (
            chatData.blockContact==userData.userId ?
            (<SubmitButton

                title={'Unblock'}
                color={colors.blue}
                onPress={() => UnBlockContact(chatId)}
            /> ) : 
            
            <SubmitButton
                disabled={chatData.blockContact!==userData.userId  && chatData.blockContact}
                title={'Block'}
                color={colors.red}
                onPress={() => BlockContact(chatId, userData.userId)}/>)
                

        }
        {console.log(chatData.blockContact)}


        </ScrollView>
    </View>
   
}

const styles = StyleSheet.create({
    topContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#1B313E',
        borderTopColor: 'black',
        borderTopWidth: 0.5,
    },
    about: {
        fontFamily: 'medium',
        fontSize: 16,
        letterSpacing: 0.3,
        color: colors.grey
    },
    heading: {
        fontFamily: 'bold',
        letterSpacing: 0.3,
        color: colors.nearlyWhite,
        marginVertical: 8
    }
});

export default ContactScreen;