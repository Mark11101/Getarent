import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import theme from 'theme';

const RentInProgressCountDown = ({
	role,
	timeLeft,
	isInTime,
	isRentFinished,
	successMessage = 'Аренда успешно завершена',
}) => {

	const { days, hours, minutes } = timeLeft;

	const isTimeOfLateExist = !!days && !!hours && !!minutes;

	const [isBoxVisible, setIsBoxVisible] = React.useState(true);

	const renderTitle = React.useMemo(() => {

		setIsBoxVisible(true)

		if (isInTime && !isRentFinished && isTimeOfLateExist) {
	
			return 'Аренда завершится через';
		
		} else if (isInTime && isRentFinished) {
		
			return successMessage;
		
		} else if (!isInTime && !isRentFinished) {
	
			return `${
				role === 'GUEST' ? 'Вы опаздываете' : 'Водитель опаздывает'
			} ${isTimeOfLateExist ? 'на' : ''}`;
		
		} else if (!isInTime && isRentFinished) {
	
			return `${
				role === 'GUEST' ? 'Вы опоздали' : 'Водитель опоздал'
			} ${isTimeOfLateExist ? 'на' : ''}`;
	
		} else {
			setIsBoxVisible(false)
		};
	
	}, [isInTime, isTimeOfLateExist, isRentFinished, role, successMessage]);
	
	return (
		<View style={styles.container}>
			{
				isBoxVisible
				&&
					<View style={styles.wrap}>
						<Text style={styles.text}>
							{renderTitle}
						</Text>
						{
							!(isInTime && isRentFinished) && isTimeOfLateExist
							&&
								<View style={styles.countdown}>
									<View style={styles.count}>
										<Text style={styles.number}>{`${days}`}</Text>
										<Text style={styles.label}>дн.</Text>
										<Text style={styles.separator}>:</Text>
									</View>
									<View style={styles.count}>
										<Text style={styles.number}>{`${hours}`}</Text>
										<Text style={styles.label}>ч.</Text>
										<Text style={styles.separator}>:</Text>
									</View>
									<View style={styles.count}>
										<Text style={styles.number}>{`${minutes}`}</Text>
										<Text style={styles.label}>мин.</Text>
									</View>
								</View>
						}
					</View>
			}
		</View>
	);
};

export default RentInProgressCountDown;

const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.colors.lightGrey,
		borderRadius: 4,
		marginBottom: 20,
	},
	wrap: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: theme.spacing(4),
		paddingVertical: theme.spacing(4),
	},
	text: {
		...theme.styles.src.P1,
	},
	number: {
		...theme.styles.src.H3,
		marginTop: -5,
		marginBottom: -5,
	},
	label: {
		color: theme.colors.lightCyan,
		marginLeft: theme.spacing(1),
	},
	separator: {
		...theme.styles.src.P2,
		marginBottom: -3,
		marginHorizontal: theme.spacing(2),
	},
	countdown: {
		flexDirection: 'row',
		marginTop: 10,
	},
	count: {
		flexDirection: 'row',
		alignItems: 'flex-end',
	},
});
