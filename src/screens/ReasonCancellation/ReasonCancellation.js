import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import React, { useCallback, useState } from 'react';
import { View, Text, Linking, Alert } from 'react-native';

import {
	Input,
	Header,
	Waiter,
	Thumbnail,
	TextButton,
	RadioButton,
	FormikInput,
	PhotoLoader,
	PrimaryButton,
	SafeAreaSpacingView,
	ScrollViewChangeContent,
} from 'components';
import api from 'api';
import actions from 'actions';
import { showLoadPhotoError } from 'functions';
import { trackCarRentCancel } from '../../myTrackerService';
import s from './styles.js'
import theme from 'theme';

const initialValues = {
	comment: '',
	photos: [],
};

export default function ReasonCancellation({
	route: {
		params: { uuid, role, carId },
	},
}) {

	const dispatch = useDispatch();

	const [waiter, setWaiter] = useState(false);

	const [reason, setReason] = useState('');
	const [inputComment, setInputComment] = useState('');

    React.useEffect(() => {
        role === 'HOST' && dispatch(actions.getCarEditData(carId));
    }, []);

	const onSubmit = useCallback(

		async ({ comment, photos }) => {

			setWaiter(true);
			
			try {
				const res = await api.web.rentRoomCancellation(
					uuid,
					role,
					comment,
					photos.map(p => p.key)
				);

				if (res?.error) {
					throw res.error;
				};

				api.navigation.navigate('DeclineSuccess', { uuid, role });
                trackCarRentCancel();
			} catch (err) {

				err.message.includes('comment must be longer than or equal to 10 characters')
				?
					Alert.alert('', 'Минимальная длина комментария: 10 символов')
				:
					dispatch(
						actions.error(
							'Попробуйте еще раз'
						)
					)

			} finally {
				setWaiter(false);
			};
		},
		[role, uuid, dispatch]
	);

	const addPhoto = useCallback(

			(values, setFieldValue) => async (event) => {

				setWaiter(true);
				
				try {
					const res = await event;
					setFieldValue('photos', [...values, res]);
				} catch (err) {
					showLoadPhotoError(err.message)
				} finally {
					setWaiter(false);
				}
			},
			[dispatch]
		);

	const removePhoto = useCallback((file, files, setFieldValue) => {

		setFieldValue(
			'photos',
			files.filter(f => f !== file)
		);

	}, []);

	return (
		<Formik {...{ initialValues, onSubmit }}>
			{({ values, handleSubmit, setFieldValue }) => (
				<SafeAreaSpacingView
					style={[s.container, theme.styles.container]}
				>
					<Header 
						big 
						title={
							role === 'GUEST'
							?
								'Расскажите нам о \nпричинах отмены'
							:
								'Выберите причину отмены' 
						}
					/>
					<ScrollViewChangeContent
						style={theme.styles.container}
						contentContainerStyle={theme.styles.grow}
					>
						<View style={s.content}>
							
								{
									role === 'GUEST'
									?
										<>
											<FormikInput
												multiline
												labelStyle={s.textAreaLabel}
												inputStyle={s.textAreaInput}
												name="comment"
												placeholder={
													role === 'GUEST' ? (
														'Напишите ваш комментарий в поле'
													) : (
														<Text>
															Напишите ваш комментарий в поле.
															Помните, если вы нарушаете
															<TextButton
																title=" Политику отмены"
																onPress={() =>
																	Linking.openURL(
																		'https://help.getarent.ru/ru/knowledge-bases/2/articles/78-politika-otmenyi-arendyi?utm_source=host&utm_medium=politika-otmenyi'
																	)
																}
															/>
															, с вас будет удержан
															<TextButton
																title=" штраф"
																onPress={() =>
																	Linking.openURL(
																		'https://help.getarent.ru/ru/knowledge-bases/2/articles/79-shtrafyi?utm_source=host&utm_medium=shtrafyi'
																	)
																}
															/>
														</Text>
													)
												}
											/>
											<Text style={s.text}>
												При необходимости, добавьте фотографии
											</Text>
											<View style={s.photos}>
												<View>
													<PhotoLoader
														style={s.thumbnail}
														name="photo"
														onSelect={addPhoto(
															values.photos,
															setFieldValue
														)}
													/>
												</View>

												{values.photos.map(file => (
													<Thumbnail
														key={file.key}
														style={s.thumbnail}
														resizeMode="cover"
														source={{
															uri: file.path
														}}
														onPressDelete={() =>
															removePhoto(
																file,
																values.photos,
																setFieldValue
															)
														}
													/>
												))}

												<Filler
													count={
														Math.abs(
															4 - ((values.photos.length + 1) % 4)
														) % 4
													}
												/>
											</View>
										</>
									:
										<>
											<View style={s.radioBtns}>
												{
													[
														{
															value: 'BUSY',
															label: 'Машина занята на эти даты',
														},
														{
															value: 'REPAIR',
															label: 'Машина на ремонте/ТО',
														},
														{
															value: 'DECLINE',
															label: 'Отказ клиенту от службы безопасности владельца',
														},
														{
															value: 'SERVICES',
															label: 'Клиент не выбрал требуемые услуги',
														},
														{
															value: 'OTHER',
															label: 'Другое',
														},
													].map(option => (
														<RadioButton
															key={option.value}
															checked={option.value === reason}
															labelStyle={{ flexWrap: 'wrap', flex: 1 }}
															onChange={(value, label) => {

																setReason(value);
																
																value !== 'OTHER'
																&&
																	setFieldValue(
																		'comment',
																		label
																	);
															}}
															{...option}
														/>
												))}
											</View>
											{
												reason === 'OTHER'
												&&
													<>
														<Input 
															multiline
															numberOfLines={5}
															value={inputComment}
															style={{ marginBottom: 20 }}
															labelStyle={s.textAreaLabel}
															inputStyle={s.textAreaInput}
															placeholder={
																role === 'GUEST' ? (
																	'Напишите ваш комментарий в поле'
																) : (
																	<Text>
																		Напишите ваш комментарий в поле.
																		Помните, если вы нарушаете
																		<TextButton
																			title=" Политику отмены"
																			onPress={() =>
																				Linking.openURL(
																					'https://help.getarent.ru/ru/knowledge-bases/2/articles/78-politika-otmenyi-arendyi?utm_source=host&utm_medium=politika-otmenyi'
																				)
																			}
																		/>
																		, с вас будет удержан
																		<TextButton
																			title=" штраф"
																			onPress={() =>
																				Linking.openURL(
																					'https://help.getarent.ru/ru/knowledge-bases/2/articles/79-shtrafyi?utm_source=host&utm_medium=shtrafyi'
																				)
																			}
																		/>
																	</Text>
																)
															}
															onChangeText={(value) => {
																setInputComment(value);
																setFieldValue('comment', value);
															}}
														/>
														<Text style={s.text}>
															При необходимости, добавьте фотографии
														</Text>
														<View style={s.photos}>
															<View>
																<PhotoLoader
																	style={s.thumbnail}
																	name="photo"
																	onSelect={addPhoto(
																		values.photos,
																		setFieldValue
																	)}
																/>
															</View>

															{values.photos.map(file => (
																<Thumbnail
																	key={file.key}
																	style={s.thumbnail}
																	resizeMode="cover"
																	source={{
																		uri: file.path
																	}}
																	onPressDelete={() =>
																		removePhoto(
																			file,
																			values.photos,
																			setFieldValue
																		)
																	}
																/>
															))}

															<Filler
																count={
																	Math.abs(
																		4 - ((values.photos.length + 1) % 4)
																	) % 4
																}
															/>
														</View>
													</>
											}
										</>
								}
							<View style={theme.styles.flex} />
							<PrimaryButton
								style={s.button}
								title="Отменить аренду"
								onPress={handleSubmit}
								disabled={
									waiter ||
									!values.comment || 
									(reason === 'OTHER' && !inputComment)
								}
							/>
							<PrimaryButton
								outlined
								style={s.button}
								title="Не хочу отменять аренду"
								onPress={() => api.navigation.goBack()}
							/>
							{waiter && <Waiter />}
						</View>
					</ScrollViewChangeContent>
				</SafeAreaSpacingView>
			)}
		</Formik>
	);
}

const Filler = React.memo(function Filler({ count }) {
	return [...new Array(count)].map((v, i) => (
		<View key={i} style={s.thumbnail} collapsable={false} />
	));
});
