import React, { useCallback, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import theme from '../theme'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import {
	TimeSelector,
	CheckboxGroup,
	PrimaryButton,
	ButtonText,
	WarningText,
	ModalizedScreen
} from '../components'
import { WEEK_DAYS_SHORT } from '../constants/dayTime'
import { useDispatch } from 'react-redux'
import actions from '../actions'
import {
	dayNumbersArrayToObject,
	daysObjectToNumbersArray, 
	timeObjectToString,
	timeStringToObject
} from '../libs/dateTime'

const DEFAULT_DAYS = [ 0, 1, 2, 3, 4, 5, 6 ]
const DEFAULT_TIME = [ '10:00', '20:00' ]

const generateDays = selected => dayNumbersArrayToObject(selected ? DEFAULT_DAYS : [])

export const HostWorkingHoursModal = ({ navigation, route: { params: values = {} } }) => {
	const dispatch = useDispatch()

	const [ days, setDays ] = useState(values.days ? dayNumbersArrayToObject(values.days) : generateDays(true))
	const [ startTime, setStartTime ] = useState(timeStringToObject(values.startTime || DEFAULT_TIME[0]))
	const [ endTime, setEndTime ] = useState(timeStringToObject(values.endTime || DEFAULT_TIME[1]))

	const _onSubmit = useCallback(() => {
		const body = {
			startTime: timeObjectToString(startTime),
			endTime: timeObjectToString(endTime),
			days: daysObjectToNumbersArray(days)
		}

		dispatch(actions.updateHostWorkingHoursRequest(body))
		navigation.goBack()
	}, [ startTime, endTime, days ])

	const _onWeekDay = value => {
		setDays(value)
	}

	const showSelectAllBtn = useMemo(() => {
		return Boolean(Object.values(days).findIndex(val => !val) + 1)
	}, [ days ])

	const _onSelectAll = () => {
		setDays(generateDays(true))
	}

	const noDaySpecified = useMemo(() => {
		return !daysObjectToNumbersArray(days).length
	}, [ days ])

	return <ModalizedScreen
		title='Доступность'
		onBack={() => navigation.goBack()}
	>
		<View style={[ styles.flexBetween ]}>
			<Text style={[ styles.text, { marginBottom: 16 } ]}>
				Когда вы на связи в чате и по телефону?
			</Text>

			{
				showSelectAllBtn && <ButtonText
					title='Выбрать все'
					onPress={_onSelectAll}
					style={{ padding: 0, margin: 0 }}
					textStyle={{ fontSize: 12, lineHeight: 13 }}
				/>
			}
		</View>

		<CheckboxGroup style={{ marginTop: 16 }} value={days} onChange={_onWeekDay} valueKey='isChecked'>
			{
				Object.entries(WEEK_DAYS_SHORT).map(([ name, label ]) => (
					<BouncyCheckbox
						key={name} text={label} name={name}
						size={22}
						style={styles.checkbox}
						fillColor={theme.colors.blue}
						textStyle={styles.checkboxText}
						
						disableBuiltInState
					/>
				))
			}
		</CheckboxGroup>

		<WarningText
			message='Должен быть выбран хотя бы один день'
			containerStyle={styles.warning(noDaySpecified)}
			error
		/>

		<Text style={[ styles.text, { marginBottom: 16 } ]}>
			Временой интервал
		</Text>

		<TimeSelector
			containerStyle={styles.timeSelector}
			label='Начало' onChange={time => setStartTime(time)}
			{ ...startTime }
		/>

		<TimeSelector
			containerStyle={styles.timeSelector}
			label='Конец' onChange={time => setEndTime(time)}
			{ ...endTime }
		/>

		<PrimaryButton
			style={styles.button}
			disabled={noDaySpecified}
			title="Сохранить"
			onPress={_onSubmit}
		/>
	</ModalizedScreen>
}

const styles = StyleSheet.create({
	flexBetween: {
		...theme.styles.flexRowCentered,
		justifyContent: 'space-between',
		flexWrap: 'wrap'
	},
	checkbox: {
		marginRight: 20,
		marginBottom: 16
	},
	checkboxText: {
		...theme.styles.text,
		marginLeft: -5,
		textDecorationLine: "none"
	},
	button: {
		position: 'absolute',
		bottom: 0,
		// left: 8,
		...theme.styles.primaryBtn,
	},
	text: {
		...theme.styles.text,
		fontSize: 12
	},
	timeSelector: {
		marginBottom: 29
	},
	warning: visible => ({
		opacity: visible ? 1 : 0,
		position: 'relative',
		bottom: 'auto',
		top: 'auto',
		marginBottom: 16
	})
})
