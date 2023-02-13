import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import DataItem from '../components/DataItem';
import PageContainer from '../components/PageContainer';
import colors from '../constants/colors';
import { FontAwesome } from '@expo/vector-icons';
import commonStyles from '../constants/commonStyles';
import { SearchMessages } from '../utils/actions/userActions';

const SearchMessageScreen = props => {

    const storedUsers = useSelector(state => state.users.storedUsers);
    // const userData = useSelector(state => state.users.userData);
    const messagesData = useSelector(state => state.messages.messagesData);
    const existingUsers = props.route.params && props.route.params.existingUsers;
    
    const { title, data, type, chatId } = props.route.params;
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [noResultsFound, setNoResultsFound] = useState(false);
    const [users, setUsers] = useState();
    const [messages, setMessages] = useState();
    const d = [
        {id:'1', value:'A'},
        {id:'2', value:'A'},
    ]
    const chatMessages = useSelector(state => {
        if (!chatId) return [];
    
        const chatMessagesData = state.messages.messagesData[chatId];
    
        if (!chatMessagesData) return [];
    
        const messageList = [];
        for (const key in chatMessagesData) {
          const message = chatMessagesData[key];
    
          messageList.push({
            key,
            ...message
          });
        }
    
        return messageList;
      });
    
    const [ChatList, setChatList] = useState(chatMessages);

    useEffect(() => {
        console.log(searchTerm)
        props.navigation.setOptions({ headerTitle: title })
    }, [title])

    
    
    useEffect(() => {
        const delaySearch = setTimeout(async () => {
            if (!searchTerm || searchTerm === "") {
                setMessages();
                setNoResultsFound(false);
                return;
            }

            setIsLoading(true);

            const usersResult = await SearchMessages(searchTerm,chatId);
            console.log(usersResult)
            setMessages(usersResult);
            setUsers(usersResult.sentBy);

            if (Object.keys(usersResult).length === 0) {
                setNoResultsFound(true);
            }
            else {
                setNoResultsFound(false);
            }

            setIsLoading(false);
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [searchTerm]);

    
    return <PageContainer>
        <View style={styles.searchContainer}>
            <FontAwesome name="search" size={15} color={colors.lightGrey} />

            <TextInput
                placeholder='Search messages'
                style={styles.searchBox}
                onChangeText={(text) => setSearchTerm(text)}
            />
        </View>
        
        
        {
            isLoading && 
            <View style={commonStyles.center}>
                <ActivityIndicator size={'large'} color={colors.primary} />
            </View>
        }

        {
            !isLoading && !noResultsFound && messages &&
            <FlatList
                data={Object.keys(messages)}
                renderItem={(itemData) => {
                    const messageId = itemData.item;
                    const messageData = messages[messageId]
                    const userData = storedUsers[messageData.sentBy]
                    console.log(messageData.text)
                    

                    return <DataItem
                                title={`${userData.firstName} ${userData.lastName}`}
                                subTitle={messageData.text}
                                image={userData.profilePicture}
                                // onPress={() => userPressed(userId)}
                                // type={isGroupChat ? "checkbox" : ""}
                                // isChecked={selectedUsers.includes(userId)}
                            />
                }}
            />
        }
        {
            !isLoading && noResultsFound && (
                <View style={commonStyles.center}>
                    <FontAwesome
                        name="question"
                        size={55}
                        color={colors.lightGrey}
                        style={styles.noResultsIcon}/>
                    <Text style={styles.noResultsText}>No messages found!</Text>
                </View>
            )
        }
    </PageContainer>

};
    
    
const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.extraLightGrey,
        height: 40,
        marginVertical: 8,
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 6
    },
    searchBox: {
        marginLeft: 8,
        fontSize: 15,
        width: '100%'
    },
    
    item:{
        height: 100,
        padding:10
    },

    text:{
        fontSize:20
    }
})

export default SearchMessageScreen;