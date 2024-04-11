import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import Waiter from './Waiter'
import { EmptyAvatarSvg } from './Svg'
import theme from 'theme';

const Avatar = ({ 
	name,
	avatar, 
	diameter, 
	withStub, 
	style,
	isLoading,
}) => {
	
	return (
		<View
			style={[
				styles.avatar,
				{
					height: diameter,
					width: diameter,
					borderRadius: diameter / 2,
				},
				style,
			]}
		>
			{
				avatar 
				&& 
					<Image style={styles.img} source={{ uri: avatar }} />
			}
			{withStub && !avatar && (
				<View style={styles.avatarStub}>
					<Text style={styles.avatarStubText}>
						Загрузите аватар
					</Text>
				</View>
			)}
			{ isLoading && <Waiter size='large' /> }
			{
				!withStub && !avatar && !isLoading && (
					<EmptyAvatarSvg style={styles.img} />
				)
			}
		</View>
	);
};

export default React.memo(Avatar);

const styles = StyleSheet.create({
	avatar: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: theme.colors.lightGrey,
		overflow: 'hidden',
	},
	avatarStub: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		backgroundColor: theme.colors.lightGrey,
		borderRadius: 50,
		width: 88,
		height: 88,
	},
	avatarStubText: {
		color: theme.colors.darkGrey,
		fontWeight: '600',
		textAlign: 'center',
	},
	img: {
		width: '100%',
		height: '100%',
	},
});
