import {
	Text,
	View,
	Linking,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import React from 'react';

import Icon from './Icon';

import CardIcon from 'img/rent-reference-info/card.svg';
import MailIcon from 'img/rent-reference-info/mail.svg';
import PhoneIcon from 'img/rent-reference-info/phone.svg';
import TelegramIcon from 'img/rent-reference-info/telegram.svg';
import WhatsAppIcon from 'img/rent-reference-info/whatsapp.svg';
import AllDayHelpIcon from 'img/rent-reference-info/all-day-help.svg';
import BookingHelpIcon from 'img/rent-reference-info/booking-help.svg';

import theme from '../theme';

const RentReferenceInfo = ({
	showCancellation,
	showRefund,
	cancellationDateTime,
	...rest
}) => {

	return (
		<View style={styles.container} {...rest}>
			<View style={styles.info}>
				<View style={styles.icon}>
					<CardIcon width={16} height={12} />
				</View>
				<View style={styles.infoDescription}>
					<Text style={styles.infoDescriptionText}>
						Оплата аренды банковской картой после получения машины
					</Text>
				</View>
			</View>
			{
				!!showCancellation 
				&&
					<View style={styles.info}>
						<Icon
							name="free-cancellation"
							size={theme.normalize(15)}
							color={theme.colors.blue}
							style={styles.icon}
						/>
						<View style={styles.infoDescription}>
							<Text
								style={[
									styles.infoDescriptionText,
									{ marginBottom: 10 },
								]}
							>
								Бесплатная отмена
							</Text>
							<Text style={styles.infoDescriptionText}>
								Вы можете отменить аренду бесплатно
								<Text style={styles.cancellationDateTime}>
									{' до ' + cancellationDateTime}
								</Text>
							</Text>
						</View>
					</View>
			}
			<View style={[styles.info, { marginBottom: 0 }]}>
				<View style={styles.icon}>
					<BookingHelpIcon width={17} height={16} />
				</View>
				<View style={styles.infoDescription}>
					<Text
						style={[
							styles.infoDescriptionText,
							{ marginBottom: 15 },
						]}
					>
						Помощь при бронировании
					</Text>
					<View style={styles.infoList}>
						<TouchableOpacity
							style={styles.infoListItem}
							onPress={() => Linking.openURL(`tel:+78003507780`)}
						>
							<View style={styles.infoListIcon}>
								<PhoneIcon width={16} height={16} />
							</View>
							<Text style={styles.cancellationDateTime}>
								8 (800) 350-77-80
							</Text>
						</TouchableOpacity>
						<View style={styles.infoListItem}>
							<View style={styles.infoListIcon}>
								<AllDayHelpIcon width={16} height={16} />
							</View>
							<Text style={styles.infoDescriptionText}>
								Круглосуточная помощь
							</Text>
						</View>
						<TouchableOpacity
							style={styles.infoListItem}
							onPress={() =>
								Linking.openURL('https://t.me/getarentbot')
							}
						>
							<View style={styles.infoListIcon}>
								<TelegramIcon width={16} height={13} />
							</View>
							<Text
								style={[
									styles.infoDescriptionText,
									styles.infoLink,
								]}
							>
								Telegram
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.infoListItem}
							onPress={() =>
								Linking.openURL(
									'https://wa.me/message/2PPWJ65MUVXBA1'
								)
							}
						>
							<View style={styles.infoListIcon}>
								<WhatsAppIcon width={20} height={20} />
							</View>
							<Text
								style={[
									styles.infoDescriptionText,
									styles.infoLink,
								]}
							>
								WhatsApp
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.infoListItem, { marginBottom: 0 }]}
							onPress={() =>
								Linking.openURL('mailto:support@getarent.ru')
							}
						>
							<View style={styles.infoListIcon}>
								<MailIcon width={20} height={15} />
							</View>
							<Text
								style={[
									styles.infoDescriptionText,
									styles.infoLink,
								]}
							>
								support@getarent.ru
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</View>
	);
};

export default RentReferenceInfo;

const styles = StyleSheet.create({
	container: {
		width: '90%',
	},
	icon: {
		top: 5,
	},
	info: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		marginBottom: 10,
	},
	infoDescription: {
		paddingLeft: theme.spacing(5),
		paddingBottom: theme.spacing(2.5),
	},
	infoDescriptionText: {
		...theme.styles.P2R,
		fontWeight: '400',
		fontSize: 12,
		lineHeight: 20,
		color: theme.colors.black,
	},
	cancellationDateTime: {
		...theme.styles.P2,
		fontWeight: '700',
		fontSize: 12,
		lineHeight: 20,
		color: theme.colors.black,
	},
	insuranceLink: {
		...theme.styles.P2,
		color: theme.colors.blue,
	},
	infoList: {},
	infoListItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	infoListIcon: {
		top: 1,
		marginRight: 10,
	},
	infoLink: {
		color: theme.colors.blue,
	},
});
