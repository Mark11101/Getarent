import {
	Text,
	View,
	Platform,
	Animated,
	UIManager,
	LayoutAnimation,
	TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';

import theme from 'theme';
import Icon from '../Icon';

import s from './styles';

const AccordionView = ({ 
	title, 
	style, 
	onPress, 
	children,
	titleStyle,
	expandedViewStyle,
	withoutArrow = false, 
}) => {

	const [isExpanded, setIsExpanded] = useState(false);

	const arrowView = [s.arrowView];

	const rotateAnimation = React.useRef(new Animated.Value(isExpanded ? 0 : 1)).current;;

	Animated.timing(rotateAnimation, {
		toValue: isExpanded ? 1 : 0,
		duration: 200,
		useNativeDriver: true,
	}).start();

	const rotateInterpolate = rotateAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '180deg'],
	});

	const animatedArrowStyles = { transform: [{ rotate: rotateInterpolate }] };
	arrowView.push(animatedArrowStyles);

	if (Platform.OS === 'android') {
		UIManager.setLayoutAnimationEnabledExperimental(true);
	}

	const toggleExpand = () => {

		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setIsExpanded(!isExpanded);
		onPress && onPress(isExpanded);
	};

	return (
		<View style={style}>
			<TouchableOpacity
				style={[s.row, titleStyle && { paddingVertical: 0 }]}
				onPress={toggleExpand}
			>
				<Text style={[titleStyle ? titleStyle : s.title]}>
					{title}
				</Text>
				{
					!withoutArrow
					&&
						<Animated.View style={arrowView}>
							<Icon
								name="arrow-open"
								size={theme.normalize(12)}
								color={theme.colors.greyBlue}
								style={s.arrowIcon}
							/>
						</Animated.View>
				}
			</TouchableOpacity>
			<View style={s.parentHr} />
			{
                isExpanded 
                &&
                    <View style={[s.expandedView, expandedViewStyle]}>
                        {children}
                    </View>
            }
		</View>
	);
}

export default AccordionView;
