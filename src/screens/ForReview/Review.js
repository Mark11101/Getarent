import { formatInTimeZone } from 'date-fns-tz';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Icon, Paper } from 'components';
import theme from 'theme';
import { ITEM_WIDTH } from './common';

const Review = ({ style, review, openReview, ...rest }) => {

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
		<TouchableOpacity
			style={{
				shadowColor: 'rgb(36, 93, 150)',
				shadowOffset: {
					width: 0,
					height: 4,
				},
				shadowOpacity: 0.02,
				shadowRadius: 0,
				elevation: 6,
			}}
			onPress={() => openReview(review)}
		>
			<Paper
				collapsable={false}
				style={[styles.container, style]}
				{...rest}
			>
				<View style={styles.review}>
					<View style={styles.avatarContainer}>
						<Avatar 
							avatar={reviewer.avatar} 
							diameter={50} 
							name={`${reviewer.firstName} ${reviewer.lastName}`} 
						/>
					</View>
					<View style={styles.column}>
						<View style={styles.rating}>{rating}</View>
						<Text style={[theme.styles.P1, styles.name]}>
							{`${reviewer.firstName} ${reviewer.lastName}`}
						</Text>
						<Text style={styles.rents}>
							поездки: {reviewer.rentsQty}
						</Text>
						<Text numberOfLines={4} style={styles.comment}>
							{review.comment}
						</Text>
						<Text style={styles.reviewDate}>
							{formatInTimeZone(
								review.createdAt, "UTC",
								"dd.MM.yyyy"
							)}
						</Text>
					</View>
				</View>
			</Paper>
		</TouchableOpacity>
	);
};

export default React.memo(Review);

const styles = StyleSheet.create({
	avatarContainer: {
		marginRight: theme.spacing(4),
	},
	container: {
		top: 10,
		height: 220,
		width: ITEM_WIDTH,
		padding: theme.spacing(5),
		paddingHorizontal: 20,
		borderRadius: 8,
		shadowColor: 'rgb(36, 93, 150)',
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 6,
	},
	comment: {
		...theme.styles.P2R,
		fontSize: 13,
		lineHeight: 19.5,
		marginBottom: 8,
	},
	review: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
	},
	name: {
		color: theme.colors.black,
		marginTop: theme.spacing(1),
	},
	rents: {
		...theme.styles.P4,
		marginBottom: theme.spacing(2),
	},
	rating: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: -3,
	},
	column: {
		flex: 1,
		flexDirection: 'column',
	},
	icon: {
		paddingLeft: theme.spacing(0.5),
	},
	reviewDate: {
		...theme.styles.P4,
		color: theme.colors.grey72,
	},
});
