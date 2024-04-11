import React, { useEffect } from 'react'
import { View, SafeAreaView, KeyboardAvoidingView, StyleSheet, Platform } from 'react-native'
import { ProgressVisualizationTabs } from '../../components'
import { DriverLicenseTab, FinalStep, PassportTab } from './Tabs'
import { useDispatch, useSelector } from 'react-redux'
import actions from 'actions'
import { passedStepsSelector } from '../../store/guest/selectors'
import { REGISTRATION_STEPS } from '../../constants/guestRegistration'
import compare from '../../libs/compare'

export const GuestRegistration = () => {
	const passedSteps = useSelector(passedStepsSelector, compare.arrays())

	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(actions.restoreGuestRegistrationRequest())
	}, [])

	return <SafeAreaView style={localStyles.container}>
		<KeyboardAvoidingView
			style={localStyles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			
			<ProgressVisualizationTabs
				passedSteps={passedSteps}
				initialRouteName={REGISTRATION_STEPS.REGISTRATION}
				forbiddenRoutes={Object.values(REGISTRATION_STEPS)}
			>
				{/* Frozen unreachable step */}
				<View
					name={REGISTRATION_STEPS.REGISTRATION}
					title='Регистрация'
				/>

				<DriverLicenseTab
					name={REGISTRATION_STEPS.DRIVER_LICENSE}
					title='Права'
					onBack={e => console.log('On Back', e)}
				/>
				<PassportTab
					name={REGISTRATION_STEPS.PASSPORT}
					title='Паспорт'
				/>
				<FinalStep
					name={REGISTRATION_STEPS.FINAL_STEP}
					title='Финал'
				/>

			</ProgressVisualizationTabs>

		</KeyboardAvoidingView>
	</SafeAreaView>
}

const localStyles = StyleSheet.create({
	container: {
		flex: 1,
		height: '100%'
	}
})
