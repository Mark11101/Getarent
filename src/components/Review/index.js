import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import theme from '../../theme'
import { StarsRating } from '../Rating'
import ReviewHeader from './Header'
import { MONTH_MAP } from '../../constants/dictionary'
import { formatDate } from '../../libs/dateTime'

export const Review = ({ style, review, ...rest }) => {
	return <View style={[styles.container, style]} { ...rest }>
		<ReviewHeader
			style={styles.header}
			rent={review.rent}
			reviewer={review.reviewer}
			car={review.car}
		/>

		<View style={styles.content}>
			<StarsRating value={review.rating} />
			<Text style={styles.comment}>
				{ review.comment }
			</Text>
			<Text style={styles.date}>
				{ formatDate(new Date(review.updatedAt), (m, d) => `${d.padStart(2, '0')} ${MONTH_MAP[m]}`) }
			</Text>
		</View>
	</View>
}

const styles = StyleSheet.create({
	container: {
		padding: 4,
		backgroundColor: '#F5F5F7',
		borderRadius: 20,
		marginBottom: 24
	},
	header: {
		marginBottom: 24
	},
	content: {
		paddingHorizontal: 12,
		paddingBottom: 12
	},
	comment: {
		...theme.styles.text,
		marginVertical: 8,
		fontSize: 12
	},
	date: {
		...theme.styles.secondaryText,
		fontSize: 12
	},
})
