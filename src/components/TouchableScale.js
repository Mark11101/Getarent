import React from 'react';
import TouchableScale from 'react-native-touchable-scale';

const TouchableScaleComponent = ({ activeScale = 0.9, tension = 1, friction = 1, children, ...rest }) => {

    return (
        <TouchableScale                                  
            activeScale={activeScale}
            tension={tension}
            friction={friction}
            {...rest}
        >
            {children}
        </TouchableScale>
    )
};

export default TouchableScaleComponent;
