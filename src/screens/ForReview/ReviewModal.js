import { formatInTimeZone } from 'date-fns-tz';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import api from 'api';
import { Avatar, Icon } from 'components';

import theme from 'theme';

const ReviewModal = ({ review }) => {

	const { reviewer } = review;

	const rating = useMemo(() => {

		return [...new Array(5)].map((v, i) =>
			review.rating > i ? (
				<Icon
					name="star"
					key={'icon-' + i}
					style={styles.icon}
					size={theme.normalize(14)}
					color={theme.colors.yellow}
				/>
			) : (
				<Icon
					name="star"
					key={'icon-' + i}
					style={styles.icon}
					size={theme.normalize(14)}
					color={theme.colors.grey}
				/>
			)
		);
	}, [review]);

	return (
        <View style={styles.review}>
			<View style={styles.userInfo}>
				<TouchableOpacity
					style={styles.avatarContainer}
					onPress={() =>
						api.navigation.push(
							'PublicProfile',
							{
								uuid: review.reviewer
									? review.reviewer.uuid
									: review.uuid,
							},
							true
						)
					}
				>
					<Avatar 
						avatar={reviewer.avatar} 
						diameter={50} 
						name={`${reviewer.firstName} ${reviewer.lastName}`} 
					/>
				</TouchableOpacity>
				<View style={styles.column}>
					<View style={styles.rating}>
						{rating}
					</View>
					<TouchableOpacity
						onPress={() =>
							api.navigation.push(
								'PublicProfile',
								{
									uuid: review.reviewer
										? review.reviewer.uuid
										: review.uuid,
								},
								true
							)
						}
					>
						<Text style={[
							theme.styles.P1,
							styles.name
						]}>
							{`${reviewer.firstName} ${reviewer.lastName}`}
						</Text>
						{
							!!reviewer.rentsQty
							&&
								<Text style={styles.rents}>
									поездки: {reviewer.rentsQty}
								</Text>
						}
					</TouchableOpacity>
				</View>
			</View>
			<Text style={styles.comment}>
				{review.comment.replace(/^\s+|\s+$/g, '')}
			</Text>
			<Text style={styles.reviewDate}>
				{formatInTimeZone(review.createdAt, "UTC", "dd.MM.yyyy")}
			</Text>
        </View>
	);
};

export default React.memo(ReviewModal);

const styles = StyleSheet.create({
	avatarContainer: {
		marginRight: theme.spacing(4),
	},
	comment: {
		...theme.styles.P2R,
		fontSize: 13,
		lineHeight: 20,
		marginBottom: theme.spacing(4),
	},
	review: {
        padding: 24,
		alignItems: 'flex-start',
		justifyContent: 'space-between',
	},
	userInfo: {
		flexDirection: 'row',
		marginBottom: theme.spacing(6),
	},
	name: {
		color: theme.colors.black,
		fontSize: theme.normalize(16),
		fontWeight: '600',
		marginTop: theme.spacing(1),
	},
	rents: {
		...theme.styles.P4,
	},
	rating: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	column: {
		flexDirection: 'column',
	},
	icon: {
		paddingLeft: theme.spacing(0.5),
	},
	reviewDate: {
		fontSize: theme.normalize(14),
		color: theme.colors.grey72,
	},
});
