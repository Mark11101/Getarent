import React from 'react'
import { Keyboard } from 'react-native'

const useKeyboardShown = () => {
	const [ isKeyboardVisible, setKeyboardVisible ] = React.useState(false)

	React.useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			'keyboardDidShow',
			() => {
				setKeyboardVisible(true)
			}
		)
		const keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => {
				setKeyboardVisible(false)
			}
		)

		return () => {
			keyboardDidHideListener.remove()
			keyboardDidShowListener.remove()
		}
	}, [])

	return isKeyboardVisible
}

export default useKeyboardShown