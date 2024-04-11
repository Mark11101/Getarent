import { formatInTimeZone } from 'date-fns-tz';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import api from '../api';
import Avatar from './Avatar'
import Icon from './Icon';

import theme from '../theme';

const Review = ({ style, review, ...rest }) => {

	const { reviewer } = review;

	const rating = useMemo(() => {

		return [...new Array(5)].map((v, i) =>
			review.rating > i ? (
				<Icon
					name="star"
					key={'icon-' + i}
					style={styles.icon}
					size={theme.normalize(12)}
					color={theme.colors.yellow}
				/>
			) : (
				<Icon
					name="star"
					key={'icon-' + i}
					style={styles.icon}
					size={theme.normalize(12)}
					color={theme.colors.grey}
				/>
			)
		);
	}, [review]);

	return (
		<View style={[styles.container, style]} {...rest}>
			<View style={styles.review}>
				<TouchableOpacity
					style={styles.row}
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
						style={styles.avatar}
						avatar={reviewer.avatar}
						diameter={40}
						name={`${reviewer.firstName} ${reviewer.lastName}`} 
					/>
					<Text>
						{reviewer.firstName}
					</Text>
				</TouchableOpacity>
				<Text style={styles.reviewDate}>
					{formatInTimeZone(
						review.createdAt, "UTC",
						"dd.MM.yyyy"
					)}
				</Text>
				<View style={styles.row}>
					{rating}
				</View>
			</View>
			<Text style={styles.comment}>
				{review.comment}
			</Text>
		</View>
	);
};

export default React.memo(Review);

const styles = StyleSheet.create({
	avatar: {
		marginRight: theme.spacing(3),
	},
	container: {
		marginBottom: theme.spacing(2),
	},
	comment: {
		...theme.styles.P1R,
	},
	review: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: theme.spacing(4),
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	icon: {
		paddingLeft: theme.spacing(0.5),
	},
	reviewDate: {
		fontSize: theme.normalize(10),
		color: theme.colors.darkGrey,
	},
});
