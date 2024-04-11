import { useDispatch } from 'react-redux'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native'
import api from '../api'
import theme from '../theme'
import { Text } from 'react-native'
import { AccordionArrowSvg, Review } from '../components'

export const Reviews = ({
	navigation,
	route: {
		params: {
			reviewsQty: reviewsQtyParam,
			reviews: reviewsParam,
			uuid, isOwn, title
		} = {}
	}
}) => {
	const dispatch = useDispatch()

	const [ reviews, setReviews ] = useState([])

	const refreshing = useCallback(() => {
		const getData = async () => {
			try {
				const res = await api.web.profile(uuid)

				if (res?.error) throw res.error

				setReviews(
					isOwn
						? res.ownReviews
						: res.reviews
				)
			} catch (err) {
				dispatch(actions.error(
					'Не удалось загрузить данные профиля, попробуйте еще раз'
				))
			}
		}
		getData()
	}, [ dispatch, uuid ])

	useEffect(() => {
		if (reviewsQtyParam && reviewsParam) {
			setReviews(reviewsParam)
		} else if (uuid) {
			refreshing()
		}
	}, [])

	const _onBack = () => {
		navigation.goBack()
	}

	return <SafeAreaView style={[ theme.styles.paper, theme.styles.flex, { padding: 8 } ]}>
		<TouchableOpacity
			style={[ theme.styles.flexRowCentered, { paddingVertical: 16, paddingHorizontal: 24, marginBottom: 15 } ]}
			activeOpacity={0.7}
			onPress={_onBack}
		>
			<AccordionArrowSvg style={{ transform: [ { rotate: '180deg' } ], marginRight: 16 }} />
			<Text style={theme.styles.title}>
				{ title ?? (isOwn ? 'Мои отзывы' : 'Отзывы') }
			</Text>
		</TouchableOpacity>

		<ScrollView
			style={styles.container}
			showsVerticalScrollIndicator={false}
		>
			<View style={{ paddingBottom: theme.spacing(10) }}>
				{
					!!reviews?.length && reviews
						.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
						.map(item => <Review key={item.uuid} review={item} />)
				}
			</View>
		</ScrollView>
	</SafeAreaView>
}

const styles = StyleSheet.create({
	container: {
		padding: 8
	},
	ratingReviewsBarBottom: {
		marginBottom: theme.spacing(6)
	}
})
