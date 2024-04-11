import React from 'react';
import { Text, StyleSheet } from 'react-native';

import AccordionView from './AccordionView/AccordionView';

import theme from 'theme';

const DriverInfo = ({ title, data }) => {

	const {
		passportNumber = '',
		passportIssueDate = '',
		driversLicenseNumber = '',
		driversLicenseIssueDate = '',
		carOwner = '',
		rentId = '',
		vin = '',
	} = data;

	return (
		<AccordionView title={title} style={{ marginBottom: theme.normalize(5) }}>
			<Text style={styles.textWrap}>
				<Text style={styles.label}>
					Серия и номер паспорта:{'  '}
				</Text>
				<Text style={styles.text}>{passportNumber}</Text>
			</Text>
			<Text style={styles.textWrap}>
				<Text style={styles.label}>Дата выдачи:{'  '}</Text>
				<Text style={styles.text}>{passportIssueDate}</Text>
			</Text>
			<Text style={styles.textWrap}>
				<Text style={styles.label}>В/У:{'  '}</Text>
				<Text style={styles.text}>{driversLicenseNumber}</Text>
			</Text>
			<Text style={styles.textWrap}>
				<Text style={styles.label}>Дата выдачи В/У:{'  '}</Text>
				<Text style={styles.text}>
					{driversLicenseIssueDate}
				</Text>
			</Text>
			{/* <Text style={styles.textWrap}>
				<Text style={styles.label}>
					Собственник машины:{'  '}
				</Text>
				<Text style={styles.text}>{carOwner}</Text>
			</Text> */}
			<Text style={styles.textWrap}>
				<Text style={styles.label}>
					Номер договора аренды:{'  '}
				</Text>
				<Text style={styles.text}>{rentId}</Text>
			</Text>
			<Text style={styles.textWrap}>
				<Text style={styles.label}>VIN:{'  '}</Text>
				<Text style={styles.text}>{vin}</Text>
			</Text>
		</AccordionView>
	);
}

export default DriverInfo

const styles = StyleSheet.create({
	textWrap: {
		marginBottom: theme.spacing(1),
	},
	label: {
		...theme.styles.P1,
		paddingRight: theme.spacing(1),
	},
	text: {
		...theme.styles.P1R,
	},
});
