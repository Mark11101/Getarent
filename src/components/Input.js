import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import theme from 'theme';
import { WarningText } from './Form';

const Input = ({
	style,
	label,
	error,
	notice,
	children,
	labelStyle,
	inputStyle,
	borderColor,
	borderRadius,
	RenderInput = TextInput,
	white = false,
	errorMessage,
	infoMessage,
	...rest
}) => {

	return (
		<View style={style}>
			{!!label && (
				<Text style={[
					theme.styles.P2R, 
					labelStyle,
					white && { color: theme.colors.white },
				]}>
					{label}
				</Text>
			)}
			{
				!!notice 
				&& 
					<Text style={styles.notice}>
						{notice}
					</Text>
			}
			<View
				style={[
					styles.inputContainer,
					borderColor && { borderColor },
					error && { borderColor: theme.colors.red },
					white && {
						borderColor: theme.colors.white,
						borderWidth: 1.5,
						borderRadius: 20,
					},
					borderRadius && { borderRadius: borderRadius },
				]}
			>
				<RenderInput
					style={[
						styles.input, 
						inputStyle,
						white && { color: theme.colors.white },
						error && { color: theme.colors.red }
					]}
					placeholderTextColor={
						// error ? theme.colors.red : white ? '#ffffff68' : '#979797'
						white ? '#ffffff68' : '#979797'
					}
					{...rest}
				/>
				{ (error && errorMessage) && <WarningText message={errorMessage} error /> }
				{ (infoMessage && !error) && <WarningText message={infoMessage} /> }
				{children}
			</View>
		</View>
	);
};

export default React.memo(Input);

const styles = StyleSheet.create({
	notice: {
		...theme.styles.src.P3R,
		color: theme.colors.darkGrey,
		marginBottom: theme.normalize(10),
	},
	inputContainer: {
		...theme.styles.border,
		flexDirection: 'row',
		alignItems: 'center',
		borderColor: '#8F9BB3',
	},
	input: {
		...theme.styles.P1R,
		flex: 1,
		lineHeight: undefined,
		height: theme.normalize(48),
		textAlignVertical: 'center',
		paddingVertical: theme.spacing(3),
		paddingHorizontal: theme.spacing(4),
	}
});
