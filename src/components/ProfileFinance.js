import React from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import Paper from './Paper';
import { formatPrice } from 'functions';

import theme from 'theme';

const purposes = {
	RENT_INITIAL: 'За аренду',
};

const statuses = {
	CREATED: {
		label: 'создан',
		color: theme.colors.darkYellow,
	},
	CHECKED: {
		label: 'в процессе выполнения',
		color: theme.colors.darkYellow,
	},
	CANCELED: {
		label: 'отменен',
		color: theme.colors.red,
	},
	REJECTED: {
		label: 'отклонен',
		color: theme.colors.red,
	},
	COMPLETED: {
		label: 'выполнен',
		color: theme.colors.green,
	},
};

const ProfileFinance = ({ style, rentId, createdAt, purpose, status, amount }) => {

	return (
		<TouchableOpacity style={[styles.container, style]}>
			<Paper elevation={10}>
				<View style={styles.block}>
					<View style={styles.info}>
						<Text style={styles.number} numberOfLines={1}>
							№{rentId}
						</Text>
					</View>
					<View style={styles.info}>
						<Text style={styles.date}>
							{formatInTimeZone(createdAt, "UTC", "dd.MM.yyyy")}
						</Text>
						<View style={styles.status}>
							<View
								style={[
									styles.dot,
									{
										backgroundColor:
											statuses[status]?.color,
									},
								]}
							/>
							<Text style={styles.statusLabel}>
								{statuses[status]?.label}
							</Text>
						</View>
					</View>
					<View style={styles.info}>
						<Text style={styles.purpose}>
							{purposes[purpose]}
						</Text>
						<Text style={styles.amount}>
							{formatPrice(amount)}
						</Text>
					</View>
				</View>
			</Paper>
		</TouchableOpacity>
	);
};

export default React.memo(ProfileFinance);

const styles = StyleSheet.create({
	container: {
		marginHorizontal: theme.spacing(4),
		marginVertical: theme.spacing(2),
	},
	block: {
		paddingVertical: theme.spacing(1),
		paddingHorizontal: theme.spacing(4),
		flexDirection: 'column',
	},
	info: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginVertical: theme.spacing(1),
	},
	number: {
		...theme.styles.P1,
	},
	purpose: {
		...theme.styles.P1R,
	},
	status: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	statusLabel: {
		...theme.styles.P2R,
		paddingLeft: theme.spacing(2),
	},
	date: {
		...theme.styles.P2R,
	},
	amount: {
		...theme.styles.H3,
	},
	dot: {
		height: theme.normalize(8),
		width: theme.normalize(8),
		borderRadius: theme.normalize(4),
	},
});
