import React, {
	useRef,
	useContext,
	useState,
	useMemo,
	useCallback,
	useEffect,
} from 'react';
import { Modalize } from 'react-native-modalize';
import { differenceInHours, addDays } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import { View, BackHandler, Animated } from 'react-native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import api from 'api';
import actions from 'actions';
import { WebPage, ProfileCarItem } from 'components';
import { SearchControlsAnimatedValue } from 'context';
import { getStartDate, calculateDiscountPrice } from 'functions';

import s, { margin } from './styles';

const MapScreen = ({ onCloseMap, isMapShowed, onMapError }) => {

	const dispatch = useDispatch();

	const mapRef = useRef();
	const timer = useRef(null);
	const modalizeRef = useRef(null);
	const preventClose = useRef(null);

	const deactivateMarkersRef = useRef(null);

	const { dateStart, dateEnd } = useSelector(st => st.car, shallowEqual);

	const { data, meta, place, period } = useSelector(
		st => st.search,
		shallowEqual
	);

	const resDateStart = dateStart || period.start || getStartDate();
	const resDateEnd = dateEnd || period.end || addDays(getStartDate(), 4);

	const rentDuration = useMemo(
		() =>
			(resDateStart &&
				resDateEnd &&
				Math.ceil(differenceInHours(resDateEnd, resDateStart) / 24)) ||
			0,

		[resDateStart, resDateEnd]
	);

	const carsWithDiscountedPrice = useMemo(
		() =>
			data?.map(car => {
				const discountedPricePerDay = calculateDiscountPrice({
					...car,
					rentDuration,
				});
				
				return { 
					...car, 
					discountedPricePerDay: discountedPricePerDay.rentPricePerDay + (car.cascoFee || 0)
				};
			}),

		[data, rentDuration]
	);

	const devMode = useSelector(st => st.devMode);

	const boundsRef = useRef(place?.bounds);
	const fitBoundsInProcessRef = useRef(false);

	const animated = useContext(SearchControlsAnimatedValue);

	const [car, setCar] = useState(false);
	const [init, setInit] = useState(false);

	const [modalHeight, setModalHeight] = useState(0);

	const fitBounds = (bounds) =>
		mapRef.current.injectJavaScript(
			`window.fitBounds(
				${JSON.stringify(bounds)}, 
				${JSON.stringify({
					top: 100,
					left: 50,
					bottom: 100,
					right: 50,
				})}
			); 
			true;`
		);

	const translateY = useMemo(
		() =>
			animated.interpolate({
				inputRange: [0, 1],
				outputRange: [0, -modalHeight / 2],
				extrapolate: 'clamp',
			}),

		[animated, modalHeight]
	);

	const setCenter = (center, options = { animate: true }) =>
		mapRef.current?.injectJavaScript(
			`window.setCenter(
				JSON.parse('${JSON.stringify(center)}'),
				JSON.parse('${JSON.stringify(options)}')
			);
			true;`
		);

	const setActiveMarker = (marker = null) =>
		mapRef.current.injectJavaScript(
			`window.setActiveMarker(
				${JSON.stringify(marker)}
			); 
			true;`
		);

	const deactivateMarkers = useCallback(
		() => setActiveMarker(),
		[setActiveMarker]
	);

	const onPressMarker = (car) => {

		modalizeRef.current?.open();

		clearTimeout(timer.current);
		preventClose.current = true;

		setTimeout(() => {
			preventClose.current = false;
		}, 400);

		setCar(car);
	};

	const onMessage = useCallback(

		(e) => {

			const event = JSON.parse(e.nativeEvent.data);

			if (event.type === 'movestart' && onMoveStart) {

				onMoveStart();

			} else if (event.type === 'bounds') {

				if (fitBoundsInProcessRef.current) {
					fitBoundsInProcessRef.current = false;
				} else {
					dispatch(actions.searchSetMapBounds(event.data));
				}

			} else if (event.type === 'click') {

				const { car } = event.data;
				const { lon, lat } = car.homeLocation;

				onPressMarker(car);

				setCenter([lon, lat]);
				setActiveMarker(car.uuid);

			} else if (event.type === 'error') {
				onMapError();
			}
		},

		[setCenter, onPressMarker, onMoveStart, setActiveMarker, dispatch]
	);

	const onMoveStart = () =>
		setTimeout(
			() => !preventClose.current && modalizeRef.current.close(),
			0
		);

	const onClose = () => {
		const { current } = deactivateMarkersRef;
		current && current();
	};

	useEffect(() => {
		boundsRef.current = place?.bounds;
	}, [place?.bounds]);

	useFocusEffect(
		useCallback(
			() => {
				if (init && boundsRef.current) {
					fitBoundsInProcessRef.current = true;
					fitBounds(boundsRef.current);

					// for case when map has same bounds (will not trigger bounds event);
					setTimeout(
						() => (fitBoundsInProcessRef.current = false),
						1000
					);
				}

				return () =>
					api.navigation.getCurrentRouteName() === 'Search' &&
					modalizeRef.current?.close();
			},
			[init]
		)
	);

	// Prevent sticking bug (after swipe back on iOS while modalize is open).
	useEffect(() => () => animated.setValue(0), [animated]);

	useEffect(() => {

		if (!init) return;

		mapRef.current.injectJavaScript(
			`window.setData(JSON.parse('${JSON.stringify(
				carsWithDiscountedPrice
			)}')); true;`
		);
	}, [carsWithDiscountedPrice, meta, init]);

	useEffect(() => {

		if (!deactivateMarkersRef) return;

		deactivateMarkersRef.current = deactivateMarkers;
	}, [deactivateMarkersRef, deactivateMarkers]);

	useEffect(() => {

		const backAction = () => {

			if (isMapShowed) {
				onCloseMap();
			} else {
				backHandler.remove();
				api.navigation.goBack();
			}

			return true;
		};

		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction
		);

		return () => backHandler.remove();

	}, [onCloseMap, isMapShowed]);

	return (
		<View style={[s.map, s.flexTheme, !isMapShowed && { opacity: 0 }]}>
			<Animated.View
				style={[s.flexTheme, { transform: [{ translateY }] }]}
			>
				<WebPage
					ref={mapRef}
					// onSetBounds={onMoveStart}
					uri={
						devMode
							? 'https://iew8iesh.k8s.getarent.ru/app/map'
							: 'https://getarent.ru/app/map'
					}
					onLoad={() => setInit(true)}
					{...{ onMessage }}
					{...{ deactivateMarkersRef, onPressMarker, onMoveStart }}
				/>
			</Animated.View>
			<Modalize
				ref={modalizeRef}
				modalStyle={s.modalStyle}
				withOverlay={false}
				scrollViewProps={{ alwaysBounceVertical: false }}
				{...{ modalHeight, onClose }}
			>
				{car && (
					<ProfileCarItem
						onLayout={e =>
							setModalHeight(
								e.nativeEvent.layout.height + margin * 2
							)
						}
						style={s.carItem}
						{...car}
						onPress={() => {
							// AppMetrica.reportEvent('Карточка автомобиля', {
							// 	uuid: car.uuid,
							// });
							api.navigation.navigate('Car', { uuid: car.uuid });
						}}
					/>
				)}
			</Modalize>
		</View>
	);
};

export default MapScreen;
