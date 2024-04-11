import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '../Icon';
import { formatPrice } from 'functions';
import theme from 'theme';
import styles from './styles';

const PriceRow = ({
	style,
	title,
	price,
	titleStyle,
	priceStyle,
	onPressPopup,
	textContainerStyle,
}) => {
	
	return (
		<View style={[styles.spaceBetween, style]}>
			<Text style={[styles.textContainer, textContainerStyle]}>
				<Text style={[styles.title, titleStyle]}>
					{title + ' '}
				</Text>
				{
					!!onPressPopup 
					&&
						<TouchableOpacity
							// style={styles.icon}
							hitSlop={theme.hitSlop}
							onPress={onPressPopup}
						>
							<Icon
								name="question"
								color={theme.colors.blue}
								size={theme.normalize(16)}
							/>
						</TouchableOpacity>
				}
			</Text>
			<Text style={[styles.price, priceStyle]}>
				{formatPrice(price)}
			</Text>
		</View>
	);
};

export default React.memo(PriceRow);
