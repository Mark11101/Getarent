import {
	View,
	Text,
	FlatList,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import React, { useRef, useState, useCallback, useEffect } from 'react';

import {
	Addon,
	Place,
	Waiter,
	Header,
	IconInput,
	Separator,
	SafeAreaView,
	PrimaryButton,
} from 'components';
import api from 'api';
import actions from 'actions';
import { useListEmpty } from 'hooks';
import { cities, setCity } from 'constants/cities';

import theme from 'theme';

const Item = React.memo(function Item({ item, style, index, onPress }) {
	
	return (
		<>
			<TouchableOpacity style={style} onPress={() => onPress(item)}>
				<Place style={styles.place} {...item} />
			</TouchableOpacity>
			{
				index !== cities.length - 1
				&&
					<Separator light />
			}
		</>
	);
});

const useDelivery = (key, didUnmount, uuid, dispatch) => {

	const [deliveryError, setDeliveryError] = useState(false);
	const [deliveryWaiter, setDeliveryWaiter] = useState(false);
	const [deliverySelected, setDeliverySelected] = useState(false);

	const deliveryOnPress = useCallback(

		(place) => {

			dispatch(actions.suggestSetQuery(place.name));
			dispatch(actions.suggest([]));

			setDeliveryWaiter(true);
			setDeliverySelected(true);

			api.web.getCarDeliveryPrice(uuid, place.location).then((res) => {

				if (didUnmount.current) {
					return;
				}

				if (!res || res.error || res.price === null) {

					setDeliveryError(
						'К сожалению, по данному адресу\nвладелец не доставляет'
					);

				} else {
					api.navigation.setParams(key, {
						place: { ...place, ...res },
					});
				}

				setDeliveryWaiter(false);
			});
		},
		[key, uuid, didUnmount, dispatch]
	);

	return {
		deliverySelected,
		deliveryWaiter,
		deliveryError,
		setDeliverySelected,
		deliveryOnPress,
		setDeliveryError,
	};
};

const keyExtractor = o => String(o.id);

const Location = ({
	route: {
		key,
		params: {
			uuid,
			delivery = false,
			edit = false,
			withoutHeader = false,
			callback = () => {},
			location,
		} = {},
	},
}) => {

	const dispatch = useDispatch();
	
	const queryRef = useRef('');
	
	const didUnmount = useRef(false);

	const {
		deliverySelected,
		deliveryWaiter,
		deliveryError,
		setDeliveryError,
		deliveryOnPress,
		setDeliverySelected,
	} = useDelivery(key, didUnmount, uuid, dispatch);

	const { place } = useSelector(st => st.search);

	const { init, list, query, error, refreshing, waiter } = useSelector(
		st => st.suggest
	);

	const { waiter: locationWaiter } = useSelector(st => st.location);

	const emptyProps = {
		icon: 'error',
		iconColor: theme.colors.lightGrey,
		iconSize: theme.normalize(92),
		text: 'Ничего не найдено',
	};
	
	const listEmptyProps = useListEmpty(emptyProps, init, error);

	const onChangeText = useCallback(

		(text) => {

			queryRef.current = text;

			setDeliveryError(false);
			setDeliverySelected(false);

			dispatch(actions.suggestRequest(text));
		},
		[setDeliveryError, setDeliverySelected, dispatch]
	);

	const onPress = useCallback(

		(item) => {

			setCity(item.id);

			dispatch(actions.searchSetPlace(item, true));
			dispatch(actions.searchRequest());

			(delivery ? deliveryOnPress : callback)({
				...item,
				query: queryRef.current,
			});

			if (!delivery) {
				api.navigation.goBack();
			}
		},

		[delivery, deliveryOnPress, callback]
	);

	const renderItem = useCallback(
		({ item, index }) => <Item 
			key={item.id} 
			style={index === 0 && withoutHeader && { paddingTop: 40 }}
			{...{ item, index, onPress }} 
		/>,
		[onPress]
	);

	useEffect(
		() => {

			const { query } = place || {};

			if (query) {

				queryRef.current = query;
				dispatch(actions.suggestRequest(query));
			};

			if (delivery || edit) {

				const cityName = location?.address?.split(',')[0].trim();

				dispatch(
					actions.suggestSetQuery(
						cityName ? `${cityName}, ` : ''
					)
				);
			};

			dispatch(actions.getCities());

			return () => {

				dispatch(actions.suggestReset());
				didUnmount.current = true;
			};
		},[]
	);
	
	return (
		<SafeAreaView top style={[styles.container]}>
			{
				!withoutHeader
				&&
					<Header 
						title={delivery ? 'Доставка' : edit ? 'Адрес' : 'Город'} 
					/>
			}
			<View style={theme.styles.flex}>
				{(!!delivery || !!edit) && (
					<IconInput
						autoFocus
						style={styles.input}
						inputStyle={styles.inputStyle}
						placeholder="Город, адрес, аэропорт, отель"
						value={query}
						{...{ onChangeText }}
					>
						{!!delivery &&
							deliverySelected &&
							!deliveryError &&
							!deliveryWaiter &&
							!!place?.price && (
								<Addon style={styles.addon}>
									{place?.price}
								</Addon>
							)}
					</IconInput>
				)}
				{deliverySelected ? (
					deliveryError && (
						<Text style={styles.deliveryError}>
							{deliveryError}
						</Text>
					)
				) : (
					<FlatList
						style={theme.styles.flex}
						data={(delivery || edit) ? list : cities}
						keyboardShouldPersistTaps="handled"
						ListFooterComponent={<View />}
						ListFooterComponentStyle={{height:100}}
						{...{
							refreshing,
							keyExtractor,
							renderItem,
						}}
						{...listEmptyProps}
					/>
				)}
				{
					delivery &&
					deliverySelected &&
					!deliveryError &&
					!deliveryWaiter 
					&&
						<>
							<PrimaryButton
								style={styles.button}
								title="Выбрать"
								onPress={() => {
									callback(place);

									api.navigation.goBack();
								}}
							/>
						</>
				}
				{
					(
						waiter ||
						locationWaiter ||
						deliveryWaiter
					) 
					&& 
						<Waiter />
				}
			</View>
		</SafeAreaView>
	);
};

export default Location;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.white,
	},
	input: {
		marginHorizontal: theme.spacing(6),
		marginBottom: theme.spacing(4),
	},
	inputStyle: {
		...theme.styles.src.P1,
		lineHeight: undefined,
	},
	addon: {
		marginLeft: 0,
		marginRight: theme.spacing(3),
	},
	place: {
		marginHorizontal: theme.spacing(6),
	},
	deliveryError: {
		...theme.styles.P2R,
		color: theme.colors.red,
		marginHorizontal: theme.spacing(6),
	},
	button: {
		fontSize: theme.normalize(16),
		marginLeft: 'auto',
		width: '30%',
		height: theme.normalize(32),
		marginTop: theme.spacing(5),
		marginHorizontal: theme.spacing(6),
	},
});
