import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { HeaderButton } from 'react-navigation-header-buttons';
import colors from '../constants/colors';

const CustomHeaderButton = props => {
    return <HeaderButton
                { ...props }
                IconComponent={Ionicons}
                iconSize={25}
                color={props.color ?? colors.blue }
                style={{marginLeft:-10}}
            />
};

export default CustomHeaderButton;