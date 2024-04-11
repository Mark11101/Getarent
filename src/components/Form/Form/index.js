import React, { useEffect } from 'react'
import { Formik } from 'formik'
import { View } from 'react-native'
import PrimaryButton from '../../PrimaryButton'
import { FormikInput } from '../FormikInput'
import compare from '../../../libs/compare'

export const Form = ({
	fields, values = {}, validationSchema, initialValues = {},
	onSubmit = () => {}, submitText = "Сохранить", styles = {},
	rerender = true
}) => {
	return <Formik
		initialValues={initialValues}
		onSubmit={onSubmit}
		validationSchema={validationSchema}
		validateOnChange={false}
		validateOnBlur
	>
		{({
			values: state,
			isValid,
			dirty,
			handleSubmit,
			handleBlur,
			handleChange,
			setValues
		}) => {
			useEffect(() => {
				if (rerender && !compare.props()(state, values)) {
					setValues(values, true)
				}
			}, [ values ])

			return <View style={{ flex: 1 }}>
				<View style={{ flexGrow: 1, flexShrink: 0, flexBasis: 'auto' }}>
					{
						Object.entries(fields).map(([ key, { label, info, ...rest } ]) => (
							<FormikInput
								labelStyle={{ backgroundColor: "#fff" }}
								key={key} name={key}
								label={label} infoMessage={info}
								onBlur={handleBlur(key)}
								onChange={handleChange(key)}

								{ ...rest }
							/>
						))
					}
				</View>

				<PrimaryButton
					style={styles.submitButton}
					title={submitText}
					onPress={handleSubmit}
					disabled={!dirty || !isValid}
				/>
			</View>
		}}
	</Formik>
}
