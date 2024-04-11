import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { StyleSheet } from 'react-native'
import theme from '../theme'
import { ModalizedScreen, TextArea, PrimaryButton } from '../components'
import actions from '../actions'

export const HostAboutTextModal = ({ navigation, route: { params: { text: initial } = {} } }) => {
	const [ text, setText ] = useState(initial || '') 

	const dispatch = useDispatch()

	const _onSubmit = useCallback(() => {
		dispatch(actions.updateHostBioRequest(text))
		navigation.goBack()
	}, [ text ])

	return <ModalizedScreen
		onBack={() => navigation.goBack()}
		title="Короткий текст о вас"
	>
		<TextArea
			value={text}
			onChange={text => setText(text)}
			autoFocus
		/>

		<PrimaryButton
			style={styles.button}
			disabled={!text.length}
			title="Сохранить"
			onPress={_onSubmit}
		/>
	</ModalizedScreen>
}

const styles = StyleSheet.create({
	button: {
		position: 'absolute',
		bottom: 0,
		...theme.styles.primaryBtn
	},
})
