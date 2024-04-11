import { useDispatch } from 'react-redux';
import React, { useCallback } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import api from 'api';
import actions from 'actions';
import { WebPage, Paper, Icon } from 'components';

import theme from 'theme';

const size = theme.normalize(16);

const PointMap = ({
	route: { params: { lon, lat } = {} } = {},
}) => {

	const dispatch = useDispatch();
	
	const { top } = useSafeAreaInsets();
	
	const goBack = useCallback(() => api.navigation.goBack(), []);
	
	const onError = useCallback(() => {
		
		goBack();
		dispatch(actions.error('Произошла ошибка при загрузке карты'));

	}, [goBack, dispatch]);

	return (
		<React.Fragment>
			<WebPage
				uri={
					__DEV__
						? `https://iew8iesh.k8s.getarent.ru/app/map-point?lon=${lon}&lat=${lat}`
						: `https://getarent.ru/app/map-point?lon=${lon}&lat=${lat}`
				}
				{...{ onError }}
			/>
			<TouchableOpacity
				style={[styles.container, { top: top + theme.spacing(4) }]}
				onPress={goBack}
			>
				<Paper style={styles.paper} elevation={10}>
					<Icon
						name="back"
						color={theme.colors.black}
						{...{ size }}
					/>
				</Paper>
			</TouchableOpacity>
		</React.Fragment>
	);
};

export default PointMap;

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: theme.spacing(4),
		top: theme.spacing(20),
	},
	paper: {
		width: theme.normalize(40),
		height: theme.normalize(40),
		justifyContent: 'center',
		alignItems: 'center',
	},
});
