import React, { useMemo } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import styles from './styles'
import { GhostLabel } from '../GhostLabel'
import TimerPickerModal from '../../../modals/TimePickerModal'
import { ModalFactory } from 'react-await-modal'
import { AccordionArrowSvg } from '../../Svg'

const popupFactory = new ModalFactory({ keyPostfixLength: 1, strict: false })
const timePickerModal = popupFactory.create(TimerPickerModal)

export const TimeSelector = ({ hours, minutes, label = 'Время', containerStyle, onChange = () => {} }) => {
	const _onPress = async () => {
		const res = await timePickerModal.open({ label, hours, minutes })
		console.log({res})
		if (typeof res?.hours === 'number') onChange(res)
	}

	const hasValue = useMemo(() => {
		return typeof minutes === 'number'
	}, [ minutes ])

	return <GhostLabel
		label={label}
		containerStyle={containerStyle}
		labelStyle={{ backgroundColor: 'white' }}
		getValue={() => hasValue}
	>
		<TouchableOpacity
			activeOpacity={0.6}
			style={styles.timeSelector}
			onPress={_onPress}
		>
			<Text
				style={[
					styles.timeSelector.text,
					!hasValue && { color: '#878F9B' },
				]}
			>
				{ !hasValue ? label : `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}` }
			</Text>

			<AccordionArrowSvg
				style={{ transform: [ { rotate: '90deg' } ] }}
			/>
		</TouchableOpacity>
		<ModalFactory.Manager ref={popupFactory.setRef.bind(popupFactory)} />
	</GhostLabel> 
}
