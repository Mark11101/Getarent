// import { Formik, useFormikContext } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import React, { useRef, useCallback, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native';

import {
	Header,
	RadioButton,
	PrimaryButton,
	// Separator,
	// FormikRange,
	// FormikSelect,
	// FormikSwitch,
	// FormikSlider,
	// FormikRadioGroup,
} from 'components';
import api from 'api';
import actions from 'actions';
import { sortTypes } from '../actions/search';
// import { filters } from 'constants';
// import { useSafeSpacing, useScrollPreventor } from 'hooks';

import theme from 'theme';

// const ResetButton = () => {

// 	const dispatch = useDispatch();

// 	const onPress = useCallback(() => {

// 		dispatch(actions.searchResetFilters());
// 		setTimeout(() => api.navigation.goBack());
		
// 	}, [dispatch]);

// 	return (
// 		<PrimaryButton
// 			style={[styles.button, styles.cancelButton]}
// 			titleStyle={styles.cancelButtonTitle}
// 			icon="cross-bold"
// 			iconColor={theme.colors.black}
// 			iconSize={theme.normalize(8)}
// 			title="Сбросить"
// 			{...{ onPress }}
// 		/>
// 	);
// };

// const SubmitButton = () => {

// 	const { submitForm } = useFormikContext();

// 	return (
// 		<PrimaryButton
// 			style={styles.button}
// 			title="Показать"
// 			onPress={submitForm}
// 		/>
// 	);
// };

// const Item = React.memo(function Item({ item, name, onStart, onEnd }) {

// 	switch (item.type) {
// 		case 'switch':
// 			return <FormikSwitch {...item} {...{ name }} />;
// 		case 'select':
// 			return <FormikSelect {...item} {...{ name }} />;
// 		case 'range':
// 			return <FormikRange {...item} {...{ name }} />;
// 		case 'radioGroup':
// 			return <FormikRadioGroup {...item} {...{ name }} />;
// 		case 'slider':
// 			return <Slider {...item} {...{ name, onStart, onEnd }} />;
// 		default:
// 			return null;
// 	}
// });

// const Slider = (props) => {

// 	const {
// 		values: { noMilLim },
// 		setFieldValue,
// 	} = useFormikContext();

// 	useEffect(
// 		() => {
// 			if (noMilLim) {
// 				setFieldValue('distance', 0);
// 			}
// 		},
// 		[noMilLim]
// 	);

// 	return (
// 		<FormikSlider
// 			valueLabel
// 			style={styles.slider}
// 			titleStyle={styles.titleStyle}
// 			delta={-theme.normalize(18)}
// 			disabled={!!noMilLim}
// 			{...props}
// 		/>
// 	);
// };

const Filters = ({ route: { params: { callback } = {} } }) => {

	const dispatch = useDispatch();

	const filters = useSelector(st => st.search.filters);

	const sortType = filters.sortType;

	const handleChangeSortType = (sortType) => {

		dispatch(actions.setFilters({
			sortType
		}));
	};

	// const dispatch = useDispatch();

	// const buttonsStyle = useSafeSpacing(
	// 	'bottom',
	// 	'paddingBottom',
	// 	4,
	// 	styles.buttons
	// );

	// const scrollViewRef = useRef(null);

	// const initialValues = useSelector(st => st.search.filtersState);
	
	// const { onStart, onEnd } = useScrollPreventor(scrollViewRef);

	// const onSubmit = useCallback(

	// 	(values) => {
	// 		dispatch(actions.searchSetFilters(values));
	// 		// prevent Switch glitch.
	// 		setTimeout(() => api.navigation.goBack());
	// 	},
	// 	[dispatch]
	// );

	return (
		<SafeAreaView style={styles.container}>
			<Header title="Фильтры" />
			<ScrollView style={styles.scrollView}>
				<Text style={styles.subHeader}>
					Сортировка
				</Text>
				<RadioButton
                    material
                    label="Популярные"
					style={styles.radioBtn}
                    labelStyle={styles.defaultText}
                    onPress={() => handleChangeSortType(sortTypes.POPULAR)}
                    checked={sortType === sortTypes.POPULAR}
                />
				<RadioButton
                    material
                    label="Сначала дешевые"
					style={styles.radioBtn}
                    labelStyle={styles.defaultText}
                    onPress={() => handleChangeSortType(sortTypes.CHEAP)}
                    checked={sortType === sortTypes.CHEAP}
                />
				<RadioButton
                    material
                    label="Сначала дорогие"
					style={styles.radioBtn}
                    labelStyle={styles.defaultText}
                    onPress={() => handleChangeSortType(sortTypes.EXPENSIVE)}
                    checked={sortType === sortTypes.EXPENSIVE}
                />
				<RadioButton
                    material
					style={styles.radioBtn}
                    label="Сначала суперхозяины"
                    labelStyle={styles.defaultText}
                    onPress={() => handleChangeSortType(sortTypes.SUPERDRIVER)}
                    checked={sortType === sortTypes.SUPERDRIVER}
                />
				<RadioButton
                    material
					style={styles.radioBtn}
                    label="Сначала с отзывами"
                    labelStyle={styles.defaultText}
                    onPress={() => handleChangeSortType(sortTypes.REVIEWS)}
                    checked={sortType === sortTypes.REVIEWS}
                />
			</ScrollView>
			<View style={styles.resumeBtnView}>
				<PrimaryButton
					style={styles.resumeBtn}
					title="Показать"
					onPress={() => api.navigation.goBack()}
				/>
			</View>
		</SafeAreaView>
		// <Formik enableReinitialize {...{ initialValues, onSubmit }}>
		// 	<View style={styles.container}>
		// 		<SafeAreaView style={styles.container}>
		// 			<Header title="Фильтры" />
		// 			<ScrollView ref={scrollViewRef} style={styles.container}>
		// 				{filters.sections.map((section, i) => (
		// 					<React.Fragment key={i}>
		// 						<View style={styles.section}>
		// 							{!!section.label && (
		// 								<Text style={styles.label}>
		// 									{section.label}
		// 								</Text>
		// 							)}
		// 							{section.items.map(item => {
		// 								const name = section.name
		// 									? `${section.name}.${item.name}`
		// 									: item.name;

		// 								return (
		// 									<React.Fragment key={name}>
		// 										{!!item.label &&
		// 											(item.type ===
		// 												'radioGroup' ||
		// 												item.type ===
		// 													'select') && (
		// 												<Text
		// 													style={styles.label}
		// 												>
		// 													{item.label}
		// 												</Text>
		// 											)}
		// 										<Item
		// 											{...{
		// 												item,
		// 												name,
		// 												onStart,
		// 												onEnd,
		// 											}}
		// 										/>
		// 									</React.Fragment>
		// 								);
		// 							})}
		// 						</View>
		// 						{!section.noSeparator && (
		// 							<Separator light style={styles.separator} />
		// 						)}
		// 					</React.Fragment>
		// 				))}
		// 			</ScrollView>
		// 		</SafeAreaView>
		// 		<View style={buttonsStyle}>
		// 			<ResetButton />
		// 			<SubmitButton />
		// 		</View>
		// 	</View>
		// </Formik>
	);
};

export default Filters;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.white,
	},
	scrollView: {
		paddingHorizontal: 16,
	},
	defaultText: {
		fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: theme.colors.black,
        marginLeft: 10,
	},
	subHeader: {
		fontFamily: 'Inter-Bold',
        fontSize: 16,
        color: theme.colors.black,
		marginBottom: 16,
	},
	radioBtn: {
		marginBottom: 5,
	},
	resumeBtnView: {
		paddingHorizontal: 16,
		marginBottom: 16
	},
	resumeBtn: {
		
	}
	// section: {
	// 	paddingHorizontal: theme.spacing(6),
	// },
	// label: {
	// 	...theme.styles.P2R,
	// 	color: theme.colors.lightCyan,
	// 	marginTop: theme.spacing(2),
	// },
	// separator: {
	// 	marginTop: theme.spacing(4),
	// 	marginBottom: theme.spacing(2),
	// },
	// slider: {
	// 	paddingTop: theme.spacing(2),
	// 	marginBottom: -theme.spacing(2),
	// },
	// titleStyle: {
	// 	marginBottom: -theme.spacing(2),
	// },
	// buttons: {
	// 	...theme.shadow(24),
	// 	flexDirection: 'row',
	// 	justifyContent: 'space-around',
	// 	alignItems: 'center',
	// 	backgroundColor: theme.colors.white,
	// 	padding: theme.spacing(4),
	// },
	// button: {
	// 	height: theme.normalize(30),
	// 	width: theme.normalize(136),
	// },
	// cancelButton: {
	// 	backgroundColor: theme.colors.white,
	// },
	// cancelButtonTitle: {
	// 	...theme.styles.src.P2R,
	// 	color: theme.colors.darkGrey,
	// },
});
