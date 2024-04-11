import React, { useCallback } from 'react'
import { BlurPopup, SuccessImageSvg, PrimaryButton } from '../components'
import { Text, View } from 'react-native'
import styles from './styles'

const SuccessRegistrationModal = ({ visible, onClose, isHost }) => {
	const _onClose = useCallback(() => {
		onClose(false)
	}, [])

	const _onFindCar = useCallback(() => {
		onClose(true)
	}, [])

	return <BlurPopup closable={false} visible={visible} onClose={_onClose}>
		<SuccessImageSvg />

		<Text style={styles.title}>
			Спасибо за регистрацию!
		</Text>

		<Text style={styles.text}>
			Проверяем ваши документы, обычно это занимает не больше 15-ти минут
		</Text>

		<View style={styles.popupFooter}>
			<PrimaryButton
				style={styles.submitBtn}
				title={isHost ? 'Продолжить' : 'Найти машину'}
				onPress={_onFindCar}
			/>
		</View>
	</BlurPopup>
}

export default SuccessRegistrationModal
