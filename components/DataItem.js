import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import colors from '../constants/colors';
import ProfileImage from './ProfileImage';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import SubmitButton from './SubmitButton';
import { TouchableOpacity } from 'react-native-gesture-handler';

const imageSize = 55;

const DataItem = props => {

    const { title, subTitle, image, type, isChecked, icon } = props;

    const hideImage = props.hideImage && props.hideImage === true;
    
    return (
        <TouchableWithoutFeedback onPress={props.onPress}>
            <View style={styles.container}>
                

                {
                    !icon && !hideImage &&
                    <ProfileImage 
                        uri={image}
                        size={imageSize}
                    />
                }

                {
                    icon &&
                    <View style={styles.leftIconContainer}>
                        <AntDesign name={icon} size={20} color={colors.primary} />
                    </View>
                }


                <View style={styles.textContainer}>
                    
                    <TouchableOpacity>
                    <Text
                        numberOfLines={1}
                        style={{...styles.title, ...{color: type === "button" ? colors.blue : colors.textColors}}}>
                        {title}
                    </Text>
                    </TouchableOpacity>

                    {
                        subTitle &&
                        <Text
                            numberOfLines={1}
                            style={styles.subTitle}>
                            {subTitle}
                        </Text>
                    }
                    
                    

                </View>


                {
                    type === "checkbox" &&
                    <View style={{ ...styles.iconContainer, ...isChecked && styles.checkedStyle }}>
                        <Ionicons name="checkmark" size={18} color="white" />
                    </View>
                }

                {
                    type === "link" &&
                    <View>
                        <Ionicons name="chevron-forward-outline" size={18} color={colors.grey} />
                    </View>
                }
                

            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        // paddingVertical: 7,
        
        
        alignItems: 'center',
        minHeight: 70,
        borderRadius:10,
        width:340,
        paddingLeft: 5,
        marginBottom:5
    },
    textContainer: {
        marginLeft: 14,
        flex: 1,

        borderBottomColor: '#777777',
        borderBottomWidth: 1,
        
    },
    title: {
        fontFamily: 'medium',
        fontSize: 16,
        letterSpacing: 0.3,
        
    },
    subTitle: {
        fontFamily: 'regular',
        color: 'white',
        letterSpacing: 0.3,
        marginBottom: 10
    },
    iconContainer: {
        borderWidth: 1,
        borderRadius: 50,
        borderColor: colors.lightGrey,
        backgroundColor: 'white'
    },
    checkedStyle: {
        backgroundColor: colors.primary,
        borderColor: 'transparent'
    },
    leftIconContainer: {
        backgroundColor: colors.extraLightGrey,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width: imageSize,
        height: imageSize
    }
});

export default DataItem;