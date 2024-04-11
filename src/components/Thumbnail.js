import {
	View,
	Text,
	StyleSheet,
	ImageBackground,
	TouchableOpacity,
} from 'react-native';
import React from 'react';

import Icon from './Icon';

import theme from 'theme';

const iconSize = theme.normalize(8);

const Thumbnail = ({ style, onPressDelete, isUploaded, ...rest }) => {

	return (
		<View style={[theme.styles.thumbnail, style]}>
			<ImageBackground style={styles.img} {...rest}>
				{
					isUploaded 
					&&
						<View
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<Text
								style={{
									...theme.getFontProps('semibold', 12, 12),
									color: theme.colors.greyBlue,
								}}
							>
								Фото загружено
							</Text>
						</View>
				}
			</ImageBackground>
			{
				onPressDelete 
				&&
					<TouchableOpacity
						style={styles.iconContainer}
						hitSlop={theme.hitSlop}
						onPress={onPressDelete}
					>
						<Icon
							style={styles.icon}
							name="cross"
							size={iconSize}
							color={theme.colors.black}
						/>
					</TouchableOpacity>
			}
		</View>
	);
};

export default React.memo(Thumbnail);

const styles = StyleSheet.create({
	img: {
		flex: 1,
	},
	iconContainer: {
		position: 'absolute',
		top: theme.spacing(1),
		right: theme.spacing(1),
		height: theme.normalize(20),
		width: theme.normalize(20),
		borderRadius: theme.normalize(20) / 2,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: theme.colors.white,
	},
	icon: {
		textAlign: 'center',
	},
});
