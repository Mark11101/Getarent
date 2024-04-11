import React, { useCallback, useMemo, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useDispatch } from 'react-redux'
import {
	ModalizedPage,
	PhotoLoaderMultiple,
	PrimaryButton,
	Waiter
} from '../components'
import theme from '../theme'
import api from '../api'
import { SCREEN_HAS_NOTCH, WINDOW_WIDTH } from '../constants/app'
import popupFactory from './popupFactory'
import SupportWillContactModal from './SupportWillContactModal'

const PHOTO_WIDTH = 0.294 * WINDOW_WIDTH
const PHOTO_HEIGHT = 0.746 * PHOTO_WIDTH

const supportModal = popupFactory.create(SupportWillContactModal)

const SendDocumentsModal = ({ onClose, visible }) => {
	const [ photos, setPhotos ] = useState([])
	const [ waiter, setWaiter ] = useState(false)

	const ref = useRef(null)

	const dispatch = useDispatch()

	const _onChange = value => {
		setPhotos(value)
	}

	const _onSubmit = useCallback(
		async () => {
			setWaiter(true)

			try {
				const res = await api.web.userDocuments(
					photos.map(photo => photo.key)
				)

				if (res?.error) throw res.error

				await supportModal.open({
					title: 'Документы успешно отправлены!',
					text: 'В случае необходимости мы свяжемся с вами дополнительно'
				})
				ref.current?.close?.()
			} catch (err) {
				dispatch(actions.error(
					'Попробуйте сфотографировать документы еще раз'
				))
			} finally {
				setWaiter(false)
			}
		},
		[ dispatch, photos ]
	)

	const isDisabled = useMemo(() => {
		return waiter || !photos.length
	}, [ photos, waiter ])

	return <ModalizedPage
		onClose={onClose}
		visible={visible}
		modalizeRef={ref}
		showHandle
		showBackBtn={false}
		headerStyle={{ alignItems: 'flex-start', paddingHorizontal: 16 }}
		modalStyle={{ padding: 8, paddingBottom: 32 }}
		threshold={60}
		title="Отправить документы"
		closeAnimationConfig={{ timing: { duration: 500 } }}
		openAnimationConfig={{ timing: { duration: 500 } }}
		adjustToContentHeight
	>
		<PhotoLoaderMultiple
			containerStyle={{
				marginTop: 11,
				marginBottom: 27
			}}
			value={photos}
			label='Загрузить фотографию'
			text='Загрузить фотографию'
			previewConfig={{
				height: PHOTO_HEIGHT,
				width: '32%'
			}}
			onChange={_onChange}
		/>

		<View style={localStyles.footer}>
			<PrimaryButton
				style={localStyles.submitBtn}
				title={waiter ? <Waiter size='small' /> : 'Отправить'}
				disabled={isDisabled}
				onPress={_onSubmit}
			/>
		</View>
	</ModalizedPage>
}

const localStyles = StyleSheet.create({
	footer: {
		paddingHorizontal: 16
	},
	submitBtn: {
		...theme.styles.primaryBtn,
		marginBottom: SCREEN_HAS_NOTCH
			? theme.spacing(8)
			: theme.spacing(4)
	}
})

export default SendDocumentsModal
