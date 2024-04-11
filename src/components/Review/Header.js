import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import theme from '../../theme'
import api from '../../api'
import Avatar from '../Avatar'
import { InlineRating } from '../Rating'
import { formatDate, formatTime } from '../../libs/dateTime'
import { shortName } from '../../libs/string'

const formatDateTime = date => formatDate(date) + ' ' + formatTime(date)

const ReviewHeader = ({ reviewer = {}, car = {}, rent = {}, style }) => {
	return <View style={[
		styles.container,
		...(Array.isArray(style) ? style : [ style ])
	]}>
		<View style={styles.content}>
			<TouchableOpacity
				style={{ alignItems: 'flex-start' }}
				activeOpacity={0.7}
				onPress={() => api.navigation.push('PublicProfile', {
					uuid: reviewer.uuid
				})}
			>
				<Avatar
					avatar={reviewer.avatar}
					diameter={48}
				/>
			</TouchableOpacity>
			<View style={styles.reviewerInfo}>
				<View style={theme.styles.flexRowCentered}>
					<Text style={[ theme.styles.text, styles.f12, { marginRight: 8 } ]}>
						{ shortName(reviewer.firstName, reviewer.lastName) }
					</Text>
					{ !!reviewer.rating && <InlineRating value={reviewer.rating} backgroundColor='#F5F5F7' /> }
				</View>
				<Text style={[ theme.styles.secondaryText, styles.f12 ]}>
					{ [ car.brand, car.model, car.registrationNumber ].join(' ') }
				</Text>
				<Text style={[ theme.styles.secondaryText, styles.f12 ]}>
					{ [ formatDateTime(new Date(rent.startDate)), formatDateTime(new Date(rent.endDate)) ].join(' - ') }
				</Text>
			</View>
		</View>
	</View>
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',

		height: 86,

		backgroundColor: 'white',
		borderRadius: 16,
		padding: 12
	},
	content: {
		height: '100%',
		flexDirection: 'row'
	},
	reviewerInfo: {
		marginLeft: 8,
		justifyContent: 'space-around'
	},
	f12: {
		fontSize: 12
	}
})

export default ReviewHeader
