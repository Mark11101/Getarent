import React, {
	useRef,
	useContext,
	useState,
	useMemo,
	useCallback,
	useEffect,
} from 'react';
import { useSelector } from 'react-redux';
import { View, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import WebPage from '../WebPage';
import { convertToBounds } from 'functions';
import { SearchControlsAnimatedValue } from 'context';

import s from './styles';

const DynamicMap = ({ longitude, latitude }) => {

	const [init, setInit] = useState(false);

	const mapRef = useRef();
	const boundsRef = useRef();
	const fitBoundsInProcessRef = useRef(false);
	
	const devMode = useSelector(st => st.devMode);

	const animated = useContext(SearchControlsAnimatedValue);

	const fitBounds = bounds =>
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
				outputRange: [0, 0],
				extrapolate: 'clamp',
			}),

		[animated]
	);

	useEffect(() => {
		boundsRef.current = convertToBounds(longitude, latitude);
	}, [longitude, latitude]);

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
			},
			[init]
		)
	);
	
	useEffect(() => {
		if (!init) return;

		mapRef.current.injectJavaScript(
			`window.setData(JSON.parse('${JSON.stringify(
				[{ homeLocation: { lon: longitude, lat: latitude } }]
			)}')); true;`
		);
	}, [init, longitude, latitude]);

	return (
		<View style={[s.map, s.flexTheme]}>
			<Animated.View style={[s.flexTheme, { transform: [{ translateY }] }]}>
				<WebPage
					ref={mapRef}
					uri={
						devMode
							? 'https://iew8iesh.k8s.getarent.ru/app/map'
							: 'https://getarent.ru/app/map'
					}
					onLoad={() => setInit(true)}
					onMessage={() => {}}
				/>
			</Animated.View>
		</View>
	);
};

export default DynamicMap;
