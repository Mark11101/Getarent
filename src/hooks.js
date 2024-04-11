import React, {
	useCallback,
	useMemo,
	useRef,
	useEffect,
	useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import api from 'api';
import actions from 'actions';
import Empty from './components/Empty';
import { fromUTCToLocalDate } from 'functions';

import theme from 'theme';

export const useSafeSpacing = (edge, styleProp, spacing, style) => {

	const { [edge]: inset } = useSafeAreaInsets();

	return useMemo(
		() => [
			style,
			{
				[styleProp]: Math.max(theme.spacing(spacing), inset),
			},
		],
		[spacing, styleProp, inset, style]
	);
}

export function useSearchControlsOffset() {

	const dispatch = useDispatch();

	const onLayout = useCallback(
		({
			nativeEvent: {
				layout: { y, height },
			},
		}) =>
			dispatch(
				actions.setSearchControlsOffset(
					height + y - theme.normalize(32) - theme.spacing(4)
				)
			),
		[dispatch]
	);

	return onLayout;
};

export function useListEmpty(
	props,
	error = false,
	condition = true,
	contentContainerStyle = false
) {

	return useMemo(
		() => ({
			contentContainerStyle: [theme.styles.grow, contentContainerStyle],
			ListEmptyComponent: condition ? (
				<Empty {...props} {...{ error }} />
			) : undefined,
		}),
		[condition, props, error, contentContainerStyle]
	);
};

export function useTimer(seconds = 60, timerName) {

	const [offsetTime, setTime] = useState(seconds);
	const timer = useRef(null);

	async function saveDate() {
		const date = new Date();
		await api.storage.set(timerName, date.toString());
	};

	const startTimer = (time = seconds) => {

		if (timer.current) {
			clearInterval(timer.current);
		};

		if (time == seconds) {
			saveDate();
		};

		setTime(time - 1);

		timer.current = setInterval(() => {

			setTime(offsetTime => {
			
				if (offsetTime <= 0) {
			
					clearInterval(timer.current);
					timer.current = null;
					api.storage.remove(timerName);
			
					return seconds;
				}

				return offsetTime - 1;
			});
		}, 1000);
	};

	useEffect(
		() => {
			(async function effect() {

				const res = await api.storage.get(timerName);
				
				if (!res) {
					return;
				}

				const date = res[timerName];

				if (date) {

					const currentDate = new Date();
					const previewDate = new Date(date);

					const offset = Math.floor(
						(currentDate - previewDate) / 1000
					);

					if (offset >= seconds) {
						setTime(seconds);
						await api.storage.remove(timerName);
					} else {
						startTimer(seconds - offset);
					}
				}
			})();

			return () => {
				clearInterval(timer.current);
			};

		}, []
	);

	return {
		offsetTime,
		startTimer,
	};
};

export function useScrollPreventor(scrollViewRef) {

	const onStart = useCallback(
		() => scrollViewRef.current.setNativeProps({ scrollEnabled: false }),
		[]
	);

	const onEnd = useCallback(
		() => scrollViewRef.current.setNativeProps({ scrollEnabled: true }),
		[]
	);

	return { onStart, onEnd };
};

export function useDidUnmount() {

	const didUnmount = useRef(false);

	useEffect(() => () => (didUnmount.current = true), []);

	return didUnmount;
};

export function useTimeLeft(rentEndDate, rentStatus, rentUpdateDate) {

	const [timeLeft, setTimeLeft] = useState({});
	const [isInTime, setInTime] = useState(true);
	const [isRentFinished, setRentFinished] = useState(false);

	const refreshTimeLeft = useCallback(() => {

		const currentDate = new Date();

		const endRentTimeLeft = fromUTCToLocalDate(rentEndDate) - currentDate;
		const rentOverdue = currentDate - fromUTCToLocalDate(rentEndDate);

		const rentFinishedOverdue =
			rentUpdateDate
			&&
				fromUTCToLocalDate(rentUpdateDate) - fromUTCToLocalDate(rentEndDate);

		let difference = endRentTimeLeft;

		if (endRentTimeLeft < 0) {
			difference = rentOverdue;
			setInTime(false);
		} else {
			setInTime(true);
		};

		if (rentStatus === 'FINISHED') {

			if (rentFinishedOverdue === null) {
				setTimeLeft({});
				return;
			};

			difference = rentFinishedOverdue;
			
			setRentFinished(true);
			
			// for rents which were finished earlier
			if (rentFinishedOverdue < 0) {
				setInTime(true);
			};

		} else {
			setRentFinished(false);
		}

		const normalizedMinutes =
			Math.floor((difference / 1000 / 60) % 60) === 0
				? 1
				: Math.floor((difference / 1000 / 60) % 60);

		const left = {
			days: Math.floor(difference / (1000 * 60 * 60 * 24)).toString(),
			hours: Math.floor((difference / (1000 * 60 * 60)) % 24).toString(),
			minutes: normalizedMinutes.toString(),
		};

		setTimeLeft(left);

	}, [rentEndDate, rentStatus, rentUpdateDate]);

	useEffect(() => {

		if (rentEndDate && rentStatus) {
			refreshTimeLeft();
		};

	}, [rentEndDate, rentStatus, rentUpdateDate, refreshTimeLeft]);

	return [timeLeft, isInTime, isRentFinished, refreshTimeLeft];
};
