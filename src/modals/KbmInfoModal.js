import React from 'react'
import { Text } from 'react-native'
import styles from './styles'
import { BlurPopup, PrimaryButton, ReferenceImageSvg } from '../components'
import theme from '../theme'

const KbmInfoModal = ({ visible, onClose }) => {
	const _onClose = () => {
		onClose()
	}

	return <BlurPopup visible={visible} onClose={_onClose} closable>
		<ReferenceImageSvg />

		<Text style={styles.title}>
			Что такое КБМ?
		</Text>

		<Text style={[ styles.text, { textAlign: 'left' } ]}>
			<Text style={{ fontWeight: 'bold' }}>Коэффициент бонус-малус</Text> — это показатель безаварийного вождения, который рассчитывается для каждого водителя на основе данных о страховых выплатах по ДТП, которые случились по его вине. Он отражает риск наступления страхового события и влияет на стоимость страхования. КБМ обновляется 1 раз в год. КБМ меньше 1 считается показателем аккуратного стиля вождения.
		</Text>

		<PrimaryButton
			style={{ ...theme.styles.primaryBtn, marginTop: 16 }}
			title="Понятно"
			onPress={_onClose}
		/>
	</BlurPopup>
}

export default KbmInfoModal
