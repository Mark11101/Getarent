import React from 'react';
import { useField } from 'formik';
import { Text, StyleSheet } from 'react-native';
import Select from '../../Select';
import theme from '../../../theme';

const FormikSelect = ({ style, name, ...rest }) => {

	const [
		{ value }, 
		{ error, touched }, 
		{ setValue, setError },
	] = useField(name);

	return (
		<>
			<Select 
				style={style}
				error={error && touched}
				onChange={(val) => {

					if (error) {
						setError(undefined);
					};
					
					setValue(val)
				}} 
				{...rest} 
				{...{ value }} 
			/>
			{
				error && touched 
				&& 
					<Text style={styles.error}>
						{error}
					</Text>
			}
		</>
	)
};

export default React.memo(FormikSelect);

const styles = StyleSheet.create({
	error: {
		color: theme.colors.red,
		marginTop: -3,
	},
});
