import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import {
	Icon,
	Waiter,
	Header,
	FormikInput,
	PrimaryButton,
	SafeAreaSpacingView,
} from 'components';
import api from '../api';
import actions from 'actions';

import theme from 'theme';

const initialValues = {
	comment: '',
	rating: '',
};

const Review = ({
	route: {
		params: { role, rentId, callback },
	},
}) => {

	const dispatch = useDispatch();

	const [waiter, setWaiter] = useState(false);
	const [rating, setRating] = useState(0);

	const onSubmit = useCallback(

		async ({ comment }) => {

			setWaiter(true);
			
			try {
				const res = await api.web.rate(
					comment,
					rating,
					rentId,
					role
				);

				if (res?.error) {
					throw res.error;
				};

				callback();

				api.navigation.navigate('RentRoom', { uuid: rentId });

			} catch (err) {

				err.message.some(e => e.context.key === 'rating')
				?
					dispatch(actions.error('Оцените поездку'))
				:
					dispatch(actions.error('Не удалось отправить отзыв, попробуйте еще раз'))

			} finally {
				setWaiter(false);
			}
		},
		[rating, rentId, role, dispatch]
	);

	return (
		<Formik {...{ initialValues, onSubmit }}>
			{({ handleSubmit }) => (
				<SafeAreaSpacingView style={styles.container}>
					<ScrollView
						keyboardShouldPersistTaps="handled"
						showsVerticalScrollIndicator={false}
					>
						<Header style={styles.header} />
						<View style={styles.content}>
							<Text style={styles.title}>
								{role === 'GUEST'
									? 'Оцените поездку\nна машине и качество\nпредоставленных услуг'
									: 'Оцените водителя'}
							</Text>
							<View style={styles.rating}>
								{[...new Array(5)].map((v, i) =>
									rating > i ? (
										<Icon
											name="star"
											key={'icon-' + i}
											style={styles.icon}
											size={theme.normalize(45)}
											color={theme.colors.yellow}
											onPress={() => setRating(++i)}
										/>
									) : (
										<Icon
											name="star"
											key={'icon-' + i}
											style={styles.icon}
											size={theme.normalize(45)}
											color={theme.colors.grey}
											onPress={() => setRating(++i)}
										/>
									)
								)}
							</View>
							<View style={styles.inputForm}>
								<FormikInput
									multiline
									style={styles.input}
									labelStyle={styles.textAreaLabel}
									inputStyle={styles.textAreaInput}
									name="comment"
									placeholder={
										role === 'GUEST'
											? 'Напишите отзыв о владельце и его машине'
											: 'Напишите отзыв о водителе'
									}
								/>
							</View>
						</View>
						{waiter && <Waiter />}
					</ScrollView>
					<PrimaryButton
						title="Отправить отзыв"
						onPress={handleSubmit}
						disabled={!rating}
					/>
				</SafeAreaSpacingView>
			)}
		</Formik>
	);
};

export default Review;

const styles = StyleSheet.create({
	container: {
		...theme.styles.container,
		justifyContent: 'space-between',
		paddingHorizontal: theme.spacing(6),
		paddingVertical: theme.spacing(6),
	},
	content: {
		...theme.styles.container,
		alignItems: 'center',
	},
	title: {
		...theme.styles.H3,
		textAlign: 'center',
	},
	header: {
		paddingHorizontal: 0,
	},
	rating: {
		flexDirection: 'row',
		marginVertical: theme.spacing(8),
	},
	icon: {
		paddingHorizontal: theme.spacing(2),
	},
	inputForm: {
		alignSelf: 'stretch',
	},
	input: {
		marginBottom: 0,
	},
	textAreaLabel: {
		...theme.styles.P2R,
		marginBottom: theme.spacing(1),
	},
	textAreaInput: {
		...theme.styles.P2R,
		height: theme.normalize(120),
		textAlignVertical: 'top',
	},
	notice: {
		...theme.styles.XS,
		color: theme.colors.lightCyan,
	},
});
