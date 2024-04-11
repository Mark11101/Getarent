import React from 'react';
import { View } from 'react-native';

import s from './style';

const Panel = ({ style, children }) => {

    return (
        <View style={[s.panel, style]}>  
            {children}  
        </View> 
    )
};

export default Panel;
