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
    
    const { title, data, type, chatId } = props.route.params;
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [noResultsFound, setNoResultsFound] = useState(false);
    const [users, setUsers] = useState();
    const [messages, setMessages] = useState();
    
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
                    
                    if (messageData.text == "The message is unsent!") return null;
                    return <DataItem
                                title={`${userData.firstName} ${userData.lastName}`}
                                subTitle={messageData.text}
                                image={userData.profilePicture}
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