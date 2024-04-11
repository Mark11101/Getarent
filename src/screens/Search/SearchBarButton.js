import React from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import { ru } from 'date-fns/locale';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

import { Icon } from 'components';

import theme from 'theme';

export default React.memo(SearchBarButton);

function SearchBarButton({ style, place, dateFrom, dateTo, ...rest }) {

	const formatDate = date => formatInTimeZone(date, place?.timeZone, 'd MMM HH:mm', { locale: ru });

	return (
		<TouchableOpacity style={[styles.container, style]} {...rest}>
			<View>
				<Text style={styles.text} numberOfLines={1}>
					{place?.name}
				</Text>
				<Text style={theme.styles.XS}>
					{
						dateFrom && dateTo 
						&&
							formatDate(dateFrom) + ' - ' + formatDate(dateTo)
					}
				</Text>
			</View>
			<Icon
				name="chevron-down"
				size={theme.normalize(15)}
				color={theme.colors.black}
			/>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		...theme.styles.src.round,
		height: theme.normalize(48),
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: theme.colors.lightGrey,
		paddingLeft: theme.spacing(3),
		paddingRight: theme.spacing(5),
	},
	text: {
		...theme.styles.src.P2R,
		marginTop: -theme.normalize(2),
		marginBottom: -theme.normalize(2),
	},
});
