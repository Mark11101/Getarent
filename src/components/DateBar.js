import React from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

import BarBody from './BarBody';
import Separator from './Separator';

import theme from 'theme';

const iconSize = theme.normalize(20);

const DateTimeRow = ({ date, placeholder, timeZone }) => {

	if (date) {

		return (
			<View style={styles.row}>
				<Text style={theme.styles.P2}>
					{formatInTimeZone(date, timeZone, "d.MM.yyyy")}
				</Text>
				<Text style={[theme.styles.XS, { color: theme.colors.blue }]}>
					{formatInTimeZone(date, timeZone, "H:mm")}
				</Text>
			</View>
		);
	}

	return <Text style={theme.styles.P2R}>{placeholder}</Text>;
};

const DateBar = ({ style, invalid, dateFrom, dateTo, timeZone, ...rest }) => {

	return (
		<TouchableOpacity
			style={[theme.styles.border, invalid && styles.invalid, style]}
			{...rest}
		>
			<BarBody
				style={styles.body}
				icon="calendar"
				{...{ iconSize, invalid }}
			>
				<DateTimeRow
					placeholder="Дата и время начала"
					date={dateFrom}
					timeZone={timeZone}
				/>
			</BarBody>
			<Separator {...{ invalid }} />
			<BarBody
				style={styles.body}
				icon="calendar"
				{...{ iconSize, invalid }}
			>
				<DateTimeRow
					placeholder="Дата и время завершения"
					date={dateTo}
					timeZone={timeZone}
				/>
			</BarBody>
		</TouchableOpacity>
	);
};

export default React.memo(DateBar);

const styles = StyleSheet.create({
	body: {
		paddingRight: theme.spacing(5),
	},
	row: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	invalid: {
		borderColor: theme.colors.red,
	},
});
