import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Icon from './Icon';
import { formatRating } from 'functions';

import theme from 'theme';

const RatingReviewsBar = ({ style, rating, reviews }) => {

	return (
		<View style={[styles.border, style]}>
			<View style={styles.rating}>
				<Text style={[
					theme.styles.P1R, 
					styles.resetLineHeight
				]}>
					{formatRating(rating)}{' '}
				</Text>
				<Icon
					name="star"
					size={theme.normalize(14)}
					color={theme.colors.yellow}
				/>
			</View>
			{
				reviews !== undefined 
				&&
					<Text style={[
						theme.styles.P2R, 
						styles.resetLineHeight
					]}>
						Отзывы: {reviews}
					</Text>
			}
		</View>
	);
};

export default React.memo(RatingReviewsBar);

const styles = StyleSheet.create({
	border: {
		height: theme.normalize(32),
		borderRadius: theme.normalize(32) / 2,
		borderWidth: theme.normalize(1),
		borderColor: theme.colors.darkYellow,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: theme.normalize(12),
	},
	resetLineHeight: {
		lineHeight: undefined,
	},
	rating: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
});
