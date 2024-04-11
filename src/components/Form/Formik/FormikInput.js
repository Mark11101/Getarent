import React from 'react';
import { useField } from 'formik';
import { Text, StyleSheet, View } from 'react-native';

import Input from '../../Input';

import theme from '../../../theme';

const FormikInput = ({
	style,
	label,
	name,
	id,
	error,
	notice,
	onChangeText,
	onBlur,
	errorStyles,
	...rest
}) => {

	const [
		{ value, name: inputName },
		{ error: formikError, touched },
		{ setValue, setTouched, setError },
	] = useField(name);

	return (
		<View style={{ marginBottom: theme.spacing(4) }}>
			<Input
				name={inputName}
				onChangeText={val => {
					const callback = onChangeText || setValue;
					if (error || formikError) {
						setError(undefined);
					}
					callback(name === 'email' ? val.toLowerCase() : val);
				}}
				{...{ label, notice, value }}
				style={[{ marginBottom: theme.spacing(2) }, style]}
				error={(error || formikError) && touched}
				onBlur={(e) => {
					setTouched(true);
					if (onBlur) {
						onBlur(e);
					}
				}}
				{...rest}
			/>
			{
				(error || formikError) && touched 
				&& 
					<Text style={[styles.error, errorStyles]}>
						{(error || formikError)}
					</Text>
			}
		</View>
	);
};

export default React.memo(FormikInput);

const styles = StyleSheet.create({
	error: {
		color: theme.colors.red,
		marginTop: 10,
		marginBottom: -15,
	},
});
