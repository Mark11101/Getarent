import { Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
	Header,
	Waiter,
	Thumbnail,
	PhotoLoader,
	PrimaryButton,
	NotAvailableScreen,
	ScrollViewChangeContent,
} from 'components';
import api from 'api';
import actions from 'actions';
import { showLoadPhotoError } from 'functions';

import s from './styles';
import theme from 'theme';

const initialValues = {
	comment: '',
	photos: [],
};

const Filler = React.memo(function Filler({ count }) {
	return [...new Array(count)].map((v, i) => (
		<View key={i} style={s.thumbnail} collapsable={false} />
	));
});

const Documents = () => {

	const dispatch = useDispatch();

	const [waiter, setWaiter] = useState(false);

	const onSubmit = useCallback(

		async ({ photos }) => {
		
			setWaiter(true);

			try {
				const res = await api.web.userDocuments(photos.map(p => p.key));

				if (res?.error) {
					throw res.error;
				}

				api.navigation.navigate('DocumentsSuccess');

			} catch (err) {

				dispatch(
					actions.error(
						'Попробуйте сфотографировать документы еще раз'
					)
				);

			} finally {
				setWaiter(false);
			}
		},
		[dispatch]
	);

	const addPhoto = useCallback(

		(values, setFieldValue) => async event => {
		
			setWaiter(true);

			try {

				const res = await event;
				setFieldValue('photos', [...values, res]);

			} catch (err) {
				showLoadPhotoError(err.message);
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

	const { authorized, role } = useSelector(st => st.profile, shallowEqual);

	if (
		!(
			authorized && 
			(role == 'GUEST' || role == 'HOST' || role == 'OBSERVER')
		)
	) {
		return <NotAvailableScreen />;
	}

	return (
		<Formik {...{ initialValues, onSubmit }}>
			{({ values, handleSubmit, setFieldValue }) => (
				<SafeAreaView style={[theme.styles.paper, theme.styles.flex]}>
					<Header title="Документы" />
					<ScrollViewChangeContent
						style={theme.styles.container}
						contentContainerStyle={theme.styles.grow}
					>
						<View style={s.content}>
							<Text style={s.text}>
								Если вам поступил запрос от службы поддержки
								Getarent на загрузку фотографий ваших
								документов, воспользуйтесь формой ниже.
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
											uri: file.path,
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
							<View style={theme.styles.flex} />
							<PrimaryButton
								style={s.button}
								title="Отправить"
								onPress={handleSubmit}
								disabled={!values.photos.length}
							/>
							{waiter && <Waiter />}
						</View>
					</ScrollViewChangeContent>
				</SafeAreaView>
			)}
		</Formik>
	);
};

export default Documents;
