import React from 'react'
import { TouchableOpacity } from 'react-native'
import { useField } from 'formik'
import InputBase from '../../Input'
import { CrossSvg } from '../../Svg'
import { GhostLabel } from '../GhostLabel'
import styles from './styles'

export const FormikInput = ({ name, label, error, onChange, type, ...props }) => {
	const [
		{ value },
		{ error: formikError, touched },
		{ setValue, setTouched, setError },
	] = useField(name)

	const _onChangeText = value => {
		const callback = props.onChange || setValue
		if (error || formikError) setError(undefined)
		callback(value)
	}

	const _onClear = () => {
		_onChangeText('')
	}

	const _onBlur = e => {
		setTouched(true)
		if (props.onBlur?.call) props.onBlur(e)
	}

	return <GhostLabel label={label} labelStyle={props.labelStyle}>
		<InputBase
			value={value}
			placeholder={label}
			onChangeText={_onChangeText}
			onBlur={_onBlur}
			
			error={touched ? (error || formikError) : ''}
			infoMessage={props.infoMessage}
			errorMessage={error || formikError || 'Заполните поле'}
	
			style={styles.internalInput}
			inputStyle={styles.input}
			borderColor='#DBE3EF'
			borderRadius={30}

			{ ...props }
		/>
		{
			!!value && <TouchableOpacity
				style={styles.clearBtn}
				activeOpacity={0.6}
				onPress={_onClear}
			>
				<CrossSvg />
			</TouchableOpacity>
		}
	</GhostLabel> 
}
