import React, { useCallback } from 'react'
import { SearchBar, SlideDownPanel } from '../components'
import { StyleSheet } from 'react-native'
import theme from '../theme'
import { useSafeSpacing } from '../hooks'
import api from '../api'

const SearchModal = ({ visible, onClose }) => {
	const panelStyle = useSafeSpacing('top', 'paddingTop', 6, styles.panel)

	const onBackPress = useCallback(() => {
		const { name } = api.navigation.getCurrentRoute()

		if (name !== 'DatePicker') {
			onClose()
			return true
		}
	}, [ onClose ])

	return <SlideDownPanel
		style={panelStyle}
		open={visible}
		onClose={() => onClose()}
		onBackPress={onBackPress}
	>
		<SearchBar />
	</SlideDownPanel>
}

const styles = StyleSheet.create({
	panel: {
		padding: theme.spacing(6),
		backgroundColor: theme.colors.white,
		borderBottomLeftRadius: theme.borderRadius,
		borderBottomRightRadius: theme.borderRadius,
	}
})

export default SearchModal
