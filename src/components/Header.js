import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import api from 'api';
import Icon from './Icon';
import ArrowLeftIcon from 'img/arrow-left-bold.svg';

import theme from 'theme';

const size = theme.normalize(16);
const goBack = () => api.navigation.goBack();

const Header = ({
	style,
	title,
	children,
    titleStyle,
	big = false,
	white = false,
	backBtnDisabled,
	roundBackBtn = false,
	withPressBack = true,
	onPressBack = goBack,
	...rest
}) => {
	
	return (
		<View style={[
			styles.container, 
			style,
			!withPressBack && styles.withoutPressBack,
		]} {...rest}>
			{
				withPressBack
				&&
					<TouchableOpacity 
						hitSlop={theme.hitSlop} 
						onPress={onPressBack}
						disabled={backBtnDisabled}
						style={roundBackBtn && styles.round}
					>
						{
							roundBackBtn
							?
								<ArrowLeftIcon width={15} height={15} />
							:
								<Icon
									name="back"
									style={!roundBackBtn && styles.icon}
									color={white ? theme.colors.white : backBtnDisabled ? theme.colors.grey : theme.colors.black}
									{...{ size }}
								/>
						}
					</TouchableOpacity>
			}
			{!!title && (
				<Text style={[
					big ? styles.titleBig : styles.title, 
					white && { color: theme.colors.white },
					titleStyle,
			]}>
					{title}
				</Text>
			)}
			{children}
		</View>
	);
};

export default React.memo(Header);

const styles = StyleSheet.create({
	container: {
		...theme.styles.src.round,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: theme.spacing(6),
		paddingVertical: theme.spacing(6),
	},
	icon: {
		marginRight: theme.spacing(4),
	},
	title: {
		...theme.styles.src.P1,
	},
	titleBig: {
		...theme.styles.src.H3,
	},
	round: {
		width: 30,
		height: 30,
		backgroundColor: 'white',
		borderRadius: 100,
		justifyContent: 'center',
		alignItems: 'center',
	}
});
