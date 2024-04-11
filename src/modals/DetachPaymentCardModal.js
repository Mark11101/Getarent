import React, { useCallback } from 'react'
import { Text, View } from 'react-native'
import styles from './styles'
import { BlurPopup, PrimaryButton, ButtonText } from '../components'

const DetachPaymentCardModal = ({ visible, onClose }) => {
	const _onCancel = useCallback(() => {
		onClose(false)
	}, [])

	const _onContinue = useCallback(() => {
		onClose(true)
	}, [])

	return <BlurPopup visible={visible} onClose={_onCancel} >
		<Text style={styles.title}>
			Удалить карту?
		</Text>

		<Text style={styles.text}>
			После удаления данные карты не востановить, ее можно только добавить заново
		</Text>

		<View style={styles.popupFooter}>
			<PrimaryButton
				style={styles.submitBtn}
				title="Удалить"
				onPress={_onContinue}
			/>

			<ButtonText
				styls={styles.secondaryBtn}
				title='Закрыть'
				onPress={_onCancel}
			/>
		</View>
	</BlurPopup>
}

export default DetachPaymentCardModal
