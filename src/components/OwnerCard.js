import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import SectionTitle from './SectionTitle';
import Avatar from './Avatar'
import Icon from './Icon'

import theme from 'theme';

const OwnerCard = ({
	style,
	avatar,
	rentsQty,
	name = '',
	firstName,
	lastName,
	reviewsQty,
	labels = [],
	verified = true,
	onPress,
}) => {

	const isSuperHost = labels.includes('SUPERHOST');

	return (
		<View style={[styles.container, style]}>
			<SectionTitle 
				style={styles.title} 
				title="Вам передаст ключи" 
			/>
			<View style={styles.row}>
				<TouchableOpacity onPress={onPress}>
					<Avatar
						style={styles.avatar}
						avatar={avatar}
						diameter={60}
						name={`${firstName} ${lastName}`} 
					/>
				</TouchableOpacity>
				<View style={theme.styles.flex}>
					<TouchableOpacity onPress={onPress}>
						<Text style={theme.styles.BT}>
							{name}
						</Text>
					</TouchableOpacity>
					<View style={styles.verifiedRow}>
						{
							verified 
							&&
								<Icon
									style={styles.icon}
									name="circle-checkmark"
									size={theme.normalize(16)}
									color={theme.colors.darkYellow}
								/>
						}
						<Text style={theme.styles.XS}>
							{verified ? 'Проверенный' : 'Не проверенный'}{' '}
							пользователь
						</Text>
					</View>
					<View style={styles.statsRow}>
						<View style={styles.dot} />
						<Text style={theme.styles.P2R}>
							отзывы: {reviewsQty}
						</Text>
						<View style={[styles.dot, styles.dotMargin]} />
						<Text style={theme.styles.P2R}>
							поездки: {rentsQty}
						</Text>
					</View>
				</View>
			</View>
			{
				isSuperHost 
				&&
					<View style={styles.superhost}>
						<Icon
							name="user"
							size={theme.normalize(16)}
							color={theme.colors.darkYellow}
							style={[styles.icon, styles.superhostIcon]}
						/>
						<Text style={[theme.styles.P2R, styles.superhostText]}>
							Суперхозяин — это опытный и надежный владелец в
							сообществе. Выбирая этот автомобиль, вы получаете лучший
							сервис
						</Text>
					</View>
			}
		</View>
	);
};

export default React.memo(OwnerCard);

const styles = StyleSheet.create({
	avatar: {
		marginRight: theme.spacing(5),
	},
	container: {
		paddingHorizontal: theme.spacing(6),
		paddingBottom: theme.spacing(5),
	},
	title: {
		marginBottom: theme.spacing(5),
	},
	row: {
		flexDirection: 'row',
	},
	verifiedRow: {
		height: theme.spacing(5),
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: theme.spacing(1),
	},
	icon: {
		marginRight: theme.spacing(2),
	},
	statsRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	dot: {
		height: theme.spacing(1),
		width: theme.spacing(1),
		backgroundColor: theme.colors.grey,
		marginTop: theme.spacing(1),
		marginRight: theme.spacing(2),
	},
	dotMargin: {
		marginLeft: theme.spacing(6),
	},
	superhost: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		marginTop: theme.normalize(8),
	},
	superhostIcon: {
		marginTop: theme.normalize(4),
	},
	superhostText: {
		flex: 1,
		flexWrap: 'wrap',
	},
});
