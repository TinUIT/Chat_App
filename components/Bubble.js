import React, { useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import colors from '../constants/colors';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import uuid from 'react-native-uuid';
import * as Clipboard from 'expo-clipboard';
import { Feather, FontAwesome,Entypo } from '@expo/vector-icons';
import { starMessage, UnSend } from '../utils/actions/chatActions';
import { useSelector } from 'react-redux';  


function formatAmPm(dateString) {
    const date = new Date(dateString);
    var hours = date.getHours();
    var minutes = date.getMinutes();        
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm ;
  }

const MenuItem = props => {

    const Icon = props.iconPack ?? Feather;

    return <MenuOption onSelect={props.onSelect}>
        <View style={styles.menuItemContainer}>
            <Text style={styles.menuText}>{props.text}</Text>
            <Icon name={props.icon} size={18} />
        </View>
    </MenuOption>
}

const Bubble = props => {
    const { text, type, messageId, chatId, userId, date, setReply, replyingTo, name, imageUrl } = props;

    const starredMessages = useSelector(state => state.messages.starredMessages[chatId] ?? {});
    const storedUsers = useSelector(state => state.users.storedUsers);

    const bubbleStyle = { ...styles.container };
    const textStyle = { ...styles.text };
    const wrapperStyle = { ...styles.wrapperStyle }

    const menuRef = useRef(null);
    const id = useRef(uuid.v4());

    let Container = View;
    let isUserMessage = false;
    const dateString = date && formatAmPm(date);

    switch (type) {
        case "myunsend":
            textStyle.color = colors.grey;
            wrapperStyle.justifyContent = 'flex-end';
            bubbleStyle.backgroundColor = '#E7FED6';
            bubbleStyle.maxWidth = '90%';
            bubbleStyle.marginRight=0;
            Container = TouchableWithoutFeedback;
            break;
        case "theirunsend":
            textStyle.color = colors.grey;
            wrapperStyle.justifyContent = 'flex-start';
            bubbleStyle.maxWidth = '90%';
            Container = TouchableWithoutFeedback;
            break;
        case "system":
            textStyle.color = '#65644A';
            bubbleStyle.backgroundColor = colors.beige;
            bubbleStyle.alignItems = 'center';
            bubbleStyle.marginTop = 10;
            break;
        case "error":
            bubbleStyle.backgroundColor = colors.red;
            textStyle.color = 'white';
            bubbleStyle.marginTop = 10;
            break;
        case "myMessage":
            wrapperStyle.justifyContent = 'flex-end';
            bubbleStyle.backgroundColor = '#E7FED6';
            bubbleStyle.maxWidth = '90%';
            bubbleStyle.marginRight=0;
            Container = TouchableWithoutFeedback;
            isUserMessage = true;
            break;
        case "theirMessage":
            wrapperStyle.justifyContent = 'flex-start';
            bubbleStyle.maxWidth = '90%';
            Container = TouchableWithoutFeedback;
            isUserMessage = true;
            break;
        case "reply":
            bubbleStyle.backgroundColor = '#F2F2F2';
            break;
        case "info":
            bubbleStyle.backgroundColor = 'white';
            bubbleStyle.alignItems= 'center';
            textStyle.color = colors.textColor;
            break;
        default:
            break;
    }

    const copyToClipboard = async text => {
        try {
            await Clipboard.setStringAsync(text);
        } catch (error) {
            console.log(error);
        }
    }
    

    const isStarred = isUserMessage && starredMessages[messageId] !== undefined;
    const replyingToUser = replyingTo && storedUsers[replyingTo.sentBy];
    const [isDateShow, setDateShow] = useState(false);
    const clickMenu = async(type) =>{
        if (type !== "unsend") {
            menuRef.current.props.ctx.menuActions.openMenu(id.current)
        }
    }

    return (
        <View>
            {isDateShow &&  <Text style={styles.Show}>{((new Date(date)).getDate())}/{((new Date(date)).getMonth()+1)}/{((new Date(date)).getFullYear())}</Text>} 
        <View style={wrapperStyle}>
             
            <Container onLongPress={() => clickMenu(type)} style={{ width: '100%' }}
                     onPress={()=>{isDateShow ? setDateShow(false): setDateShow(true)} }>
                <View style={bubbleStyle}>

                    {
                        name && type !== "info" &&
                        <Text style={styles.name}>{name}</Text>
                    }

                    {
                        replyingToUser &&
                        <Bubble
                            type='reply'
                            text={replyingTo.text}
                            name={`${replyingToUser.firstName} ${replyingToUser.lastName}`}
                        />
                    }

                    {
                        !imageUrl &&
                        <Text style={textStyle}>
                            {text}
                        </Text>
                    }

                    {
                        imageUrl &&
                        <Image source={{ uri: imageUrl }} style={styles.image} />
                    }

                {
                    dateString && type !== "info" && <View style={styles.timeContainer}>
                        { isStarred && <FontAwesome name='star' size={14} color={colors.textColor} style={{ marginRight: 5 }} /> }
                        <Text style={styles.time}>{dateString}</Text>
                    </View>
                }

                <Menu name={id.current} ref={menuRef}>
                    <MenuTrigger />

                    <MenuOptions>
                        <MenuItem text='Copy to clipboard' icon={'copy'} onSelect={() => copyToClipboard(text)} />
                        <MenuItem text={`${isStarred ? 'Unstar' : 'Star'} message`} icon={isStarred ? 'star-o' : 'star'} iconPack={FontAwesome} onSelect={() => starMessage(messageId, chatId, userId)} />
                        <MenuItem text='Reply' icon='arrow-left-circle' onSelect={setReply} />
                        {type!=="theirMessage" && type!=='theirunsend' && type!=='myunsend' && <MenuItem text='Unsend' icon={'back-in-time'} iconPack={Entypo} onSelect={()=>UnSend(messageId,chatId)}/>}
                    </MenuOptions>
                </Menu>


                </View>
            </Container>
        </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapperStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 5,
        marginBottom: 10,
        borderColor: '#E2DACC',
        borderWidth: 1,
        marginTop:5,
        marginRight:10,
    },
    text: {
        fontFamily: 'regular',
        letterSpacing: 0.3,
        fontSize: 16
    },
    menuItemContainer: {
        flexDirection: 'row',
        padding: 5
    },
    menuText: {
        flex: 1,
        fontFamily: 'regular',
        letterSpacing: 0.3,
        fontSize: 15
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    time: {
        fontFamily: 'regular',
        letterSpacing: 0.3,
        color: colors.grey,
        fontSize: 12
    },
    name: {
        fontFamily: 'medium',
        letterSpacing: 0.3,
        fontSize: 12,
        color:"#A63F52",
        marginBottom:4,
    },
    image: {
        width: 300,
        height: 300,
        marginBottom: 5
    },
    Show: {
        color:'#FFFFFF',
        textAlign:"center",
        fontSize:12
        
    }
})

export default Bubble;