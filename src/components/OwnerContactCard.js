import {
	View,
	Text,
	Linking,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import React from 'react';

import api from '../api';
import { STATUSES } from 'constants';
import Avatar from './Avatar'
import Icon from './Icon'
import TextButton from './TextButton'
import { formatRating, formatPhoneNumber } from '../functions';

import theme from 'theme';

const OwnerContactCard = ({
	uuid,
	role,
	name,
	style,
	phone,
	avatar,
	rating,
	message,
	reviews,
	rentsQty,
	lastName,
	firstName,
	birthDate,
	rentStatus,
	reviewsQty,
	bestReview,
	...rest
}) => {
	
	return (
		<View 
			style={[styles.container, style]} 
			{...rest}
		>
			<View style={{ marginRight: theme.spacing(2), width: 70 }}>
				<TouchableOpacity
					onPress={() =>
						api.navigation.navigate(
							'PublicProfile',
							{
								uuid,
							},
							true
						)
					}
				>
					<Avatar
						avatar={avatar}
						diameter={60}
						name={`${firstName} ${lastName}`} 
					/>
				</TouchableOpacity>
				<View style={styles.rating}>
					<Text style={styles.ratingText}>
						{formatRating(rating)}
					</Text>
					<Icon
						name="star"
						color={theme.colors.yellow}
						style={styles.icon}
						size={theme.normalize(14)}
					/>
				</View>
			</View>
			<View style={styles.messageContainer}>
				<View>
					{
						!birthDate 
						&& 
							<Text style={styles.nameLabel}>
								{role}
							</Text>
					}
					<TouchableOpacity
						style={styles.row}
						onPress={() =>
							api.navigation.navigate(
								'PublicProfile',
								{
									uuid,
								},
								true
							)
						}
					>
						<Text style={styles.name}>
							{name}
						</Text>
					</TouchableOpacity>
				</View>
				<View>
					{
						!!birthDate 
						&&
							<View>
								{
									!!rentsQty
									&&
										<Text style={styles.nameLabel}>
											Поездки:{' '}
											<Text style={styles.birthDateText}>
												{rentsQty}
											</Text>
										</Text>
								}
								<Text style={styles.nameLabel}>
									Дата рождения:{' '}
									<Text style={styles.birthDateText}>
										{birthDate}
									</Text>
								</Text>
								<Text style={styles.nameLabel}>
									Телефон:{' '}
									<TextButton
										style={styles.phone}
										title={formatPhoneNumber(phone)}
										onPress={() =>
											Linking.openURL('tel:' + phone)
										}
									/>
								</Text>
							</View>
					}
					{
						!birthDate && phone 
						&&
							<View>
								<Text style={styles.phoneLabel}>
									Телефон
								</Text>
								<TextButton
									style={styles.phone}
									title={formatPhoneNumber(phone)}
									onPress={() => Linking.openURL('tel:' + phone)}
								/>
							</View>
					}
					{
						!birthDate && !phone 
						&&
							<View>
								{
									rentStatus === STATUSES.AWAITS_GUEST_SCORING_COMPLETION
									?
										<Text style={styles.phoneLabel}>
											Телефон владельца будет доступен после проверки документов
										</Text>
									:
										<>
										<Text style={styles.phoneLabel}>
											Телефон
										</Text>
										<Text style={styles.messageText}>
											{message}
										</Text>
										</>
								}
							</View>
					}
				</View>
			</View>
		</View>
	);
};

export default React.memo(OwnerContactCard);

const styles = StyleSheet.create({
	birthDateText: {
		...theme.styles.P2,
	},
	container: {
		flexDirection: 'row',
	},
	icon: {
		marginHorizontal: theme.spacing(0.5),
		marginVertical: theme.spacing(1),
	},
	messageContainer: {
		marginRight: theme.spacing(20),
		justifyContent: 'flex-end',
	},
	messageText: {
		...theme.styles.P2,
		lineHeight: theme.spacing(4.5),
	},
	name: {
		...theme.styles.P1,
		lineHeight: theme.spacing(4.5),
		marginBottom: theme.spacing(2.5),
	},
	nameLabel: {
		...theme.styles.P2R,
		color: theme.colors.darkGrey,
	},
	phone: {
		...theme.styles.P1,
		color: theme.colors.blue,
		lineHeight: theme.spacing(4.5),
		marginTop: theme.spacing(1),
	},
	phoneLabel: {
		...theme.styles.P2R,
		lineHeight: 18,
	},
	rating: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: theme.spacing(2),
	},
	ratingText: {
		...theme.styles.P2,
		color: theme.colors.yellow,
	},
});
