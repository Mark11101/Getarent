import React, { useEffect, useRef } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { Modalize } from 'react-native-modalize'
import BigSuperHostIcon from 'img/profile/super-host-big.svg'
import theme from '../theme'

const HEIGHT = Dimensions.get('window').height

const SuperUserModal = ({ visible, onClose }) => {
	const ref = useRef(null)

	const isSuperHost = false

	useEffect(() => {
		if (visible) {
			ref?.current?.open?.()
		} else {
			ref?.current?.close?.()
		}
	}, [ visible ])

	return <Modalize
		ref={ref}
		snapPoint={HEIGHT / 2}
		modalHeight={HEIGHT / 2}
		onClose={() => onClose()}
	>
		<View style={styles.modal}>
			<BigSuperHostIcon
				width={89}
				height={88}
				style={styles.modalIcon}
			/>
			<Text style={styles.modalTitle}>
				Статус
				{
					isSuperHost
					?
						' “Суперхозяин”'
					:
						' "Суперводитель"'
				}

			</Text>
			<Text style={styles.modalText}>
				{
					isSuperHost
					?
						'У вас отличный рейтинг и великолепные отзывы от водителей. Все ваши машины получили приоритетный статус на поиске в приложении и на сайте Getarent'
					:
						'У вас отличный рейтинг, вы бережно относитесь к авто и вовремя оплачиваете штрафы. Вы можете арендовать автомобили на Getarent без залога.'
				}
			</Text>
		</View>
	</Modalize>
}

const styles = StyleSheet.create({
	modal: {
		paddingTop: 30,
		paddingBottom: 18,
		paddingHorizontal: 20,
	},
	modalIcon: {
		marginBottom: 14,
		left: '34%',
	},
	modalTitle: {
		...theme.styles.H2,
		fontSize: 18,
		lineHeight: 25,
		marginBottom: 16,
		textAlign: 'center'
	},
	modalText: {
		...theme.styles.P1_5,
		textAlign: 'center'
	}
})

export default SuperUserModal
