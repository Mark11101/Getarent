import React, { useCallback } from 'react'
import { Text, View } from 'react-native'
import styles from './styles'
import { isIos } from '../constants/app'
import { BlurPopup, ButtonText, NeedDocumentsSvg, PrimaryButton } from '../components'

const Bullet = () => {
	return <Text style={{ fontSize: 14 }}>{ `\u2022 ` }</Text>
}

const NeedDocumentsModal = ({ visible, onClose, isHost }) => {
	const _onCancel = useCallback(() => {
		onClose(false)
	}, [])

	const _onContinue = useCallback(() => {
		onClose(true)
	}, [])

	return <BlurPopup
		visible={visible}
		onClose={_onContinue}
		withBlur={isIos}
	>
		<NeedDocumentsSvg />

		{
			isHost ? <>
				<Text style={styles.title}>
					Подготовьте, пожалуйста, документы
				</Text>

				<Text style={[styles.text, { marginBottom: 8 } ]}>
					<Bullet />
					Документы владельца авто (паспорт или данные компании)
				</Text>
				
				<Text style={styles.text}>
					<Bullet />
					ПТС и СТС
				</Text>
			</> : <>
				<Text style={styles.title}>
					Вам понадобятся документы
				</Text>

				<Text style={styles.text}>
					<Bullet />
					Водительское удостоверение
				</Text>
				<Text style={styles.text}>
					<Bullet />
					Паспорт с пропиской РФ
				</Text>
			</>
		}

		<View style={styles.popupFooter}>
			<PrimaryButton
				style={styles.submitBtn}
				title="Продолжить"
				onPress={_onContinue}
			/>

			<ButtonText
				styls={styles.secondaryBtn}
				title='Отмена'
				onPress={_onCancel}
			/>
		</View>
	</BlurPopup>
}

export default NeedDocumentsModal
