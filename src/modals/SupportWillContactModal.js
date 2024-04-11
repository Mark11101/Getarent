import React from 'react'
import { Text } from 'react-native'
import styles from './styles'
import theme from '../theme'
import { BlurPopup, MessageImageSvg, PrimaryButton } from '../components'

const SupportWillContactModal = ({ visible, onClose, title, text }) => {
	const _onClose = () => {
		onClose()
	}

	return <BlurPopup visible={visible} onClose={_onClose} closable>
		<MessageImageSvg />

		<Text style={styles.title}>
			{ title || 'Поддержка ответит вам в ближайшее время' }
		</Text>

		{
			text && <Text style={styles.text}>
				{ text }
			</Text>
		}

		<PrimaryButton
			style={{ ...theme.styles.primaryBtn, marginTop: 16 }}
			title="Понятно, спасибо"
			onPress={_onClose}
		/>
	</BlurPopup>
}

export default SupportWillContactModal
