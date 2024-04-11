import React, { useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StyleSheet, TouchableOpacity } from 'react-native'
import actions from '../actions'
import theme from '../theme'
import { paymentCardSelector } from '../store/payment/selectors'
import compare from '../libs/compare'
import { partialCardNumberMask } from '../libs/masks'
import { SCREEN_HAS_NOTCH } from '../constants/app'
import popupFactory from './popupFactory'
import DetachPaymentCardModal from './DetachPaymentCardModal'
import { CreditCardSvg, CrossSvg, MenuItem, ModalizedPage } from '../components'

const DeleteButton = ({ onClick = () => {} }) => {
	return <TouchableOpacity
		style={localStyles.deleteBtn}
		activeOpacity={0.7}
		onPress={onClick}
	>
		<CrossSvg color={theme.colors.secondaryTextGrey} />
	</TouchableOpacity>
}

const detachCardModal = popupFactory.create(DetachPaymentCardModal)

const PaymentCardModal = ({
	onClose, visible, stage = 'ACCOUNT', rentId
}) => {
	const dispatch = useDispatch()

	const ref = useRef(null)

	const paymentCard = useSelector(paymentCardSelector, compare.props())

	useEffect(() => {
		dispatch(actions.bankCardRequest())
	}, [])

	const _onAddCard = () => {
		ref.current?.close?.()
		dispatch(actions.attachBankCard(stage, rentId))
	}

	const _onDeleteCard = async () => {
		const res = await detachCardModal.open()
		if (res) {
			ref.current?.close?.()
			dispatch(actions.detachBankCard())
		}
	}

	const cardNumber = useMemo(() => paymentCard?.pan, [ paymentCard ])

	return <ModalizedPage
		onClose={onClose}
		visible={visible}
		modalizeRef={ref}
		showHandle
		showBackBtn={false}
		headerStyle={{ alignItems: 'flex-start', paddingHorizontal: 16 }}
		modalStyle={{ padding: 8, paddingBottom: 32 }}
		threshold={40}
		title="Моя карта"
		closeAnimationConfig={{ timing: { duration: 500 } }}
		openAnimationConfig={{ timing: { duration: 500 } }}
		adjustToContentHeight
	>
		<MenuItem
			containerStyle={localStyles.card}
			prefixContent={<CreditCardSvg add />}
			postfixContent={
				cardNumber ? <DeleteButton onClick={_onDeleteCard} /> : <></>
			}
			title={partialCardNumberMask(cardNumber, 'Добавить карту')}
			onPress={cardNumber ? () => {} : _onAddCard}
			arrow={false}
		/>
	</ModalizedPage>
}

const localStyles = StyleSheet.create({
	deleteBtn: {
		position: 'absolute',
		padding: 20,
		right: -4
	},
	card: {
		marginBottom: SCREEN_HAS_NOTCH
			? theme.spacing(8)
			: theme.spacing(4)
	}
})

export default PaymentCardModal
