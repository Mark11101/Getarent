import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useField } from 'formik';
import Icon from '../../Icon';
import Input from '../../Input';
import theme from '../../../theme';

const FormikInput = ({ style, label, name, touchableOpacityProps, ...rest }) => {

	const [secureTextEntry, setSecureTextEntry] = React.useState(true);
	const [{ value }, , { setValue }] = useField(name);

	return (
		<View style={[styles.container, style]}>
			<Input
				onChangeText={setValue}
				autoCapitalize="none"
				{...rest}
				{...{ style, label, name, value, secureTextEntry }}
				style={{ marginBottom: theme.spacing(4) }}
			/>
			<View style={styles.iconContainer}>
				<TouchableOpacity
					style={styles.container}
					hitSlop={theme.hitSlop}
					onPress={() => setSecureTextEntry(v => !v)}
					{...touchableOpacityProps}
				>
					<Icon
						name={secureTextEntry ? 'eye' : 'eye-closed'}
						size={theme.normalize(18)}
						color={theme.colors.grey}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default React.memo(FormikInput);

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
	},
	iconContainer: {
		alignItems: 'center',
		bottom: theme.normalize(26),
		justifyContent: 'center',
		position: 'absolute',
		right: theme.normalize(14),
		top: theme.normalize(32),
	},
});
