import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import theme from '../../theme'
import SafeAreaView from '../SafeAreaView'
import { useHeaderHeight } from '@react-navigation/elements'
import { SCREEN_HAS_NOTCH } from '../../constants/app'
import { AccordionArrowSvg } from '../Svg'

export const ModalizedScreen = ({ onBack = () => {}, title, children, style }) => {
	const headerHeight = useHeaderHeight()

	return  <SafeAreaView
		style={[
			styles.container,
			...(Array.isArray(style) ? style : [ style ])
		]}
	>
		{
			title && <TouchableOpacity
				style={styles.header}
				activeOpacity={0.7}
				onPress={onBack}
			>
				<AccordionArrowSvg style={styles.backBtnIcon} />
				<Text style={styles.title}>{ title }</Text>
			</TouchableOpacity>
		}

		<KeyboardAvoidingView
			style={{ flex: 1, height: '100%' }}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={headerHeight + SCREEN_HAS_NOTCH ? 86 : 70}
		>
			<ScrollView
				style={{ flex: 1 }}
				keyboardShouldPersistTaps="handled"
				contentContainerStyle={{ flexGrow: 1 }}
			>
				{ children }
			</ScrollView>
		</KeyboardAvoidingView>
	</SafeAreaView>
}

const styles = StyleSheet.create({
	container: {
		...theme.styles.flex,
		...theme.styles.paper,
		padding: 16,
		paddingBottom: SCREEN_HAS_NOTCH ? 32 : 16
	},
	header: {
		...theme.styles.flexRowCentered,
		justifyContent: 'center',
		height: 40,
		marginBottom: 16
	},
	title: {
		fontSize: 16,
		color: theme.colors.black,
		fontFamily: theme.fonts.inter,
		fontWeight: 'bold'
	},
	backBtnIcon: {
		position: 'absolute',
		transform: [ { rotate: '180deg' } ],
		marginRight: 16,
		left: 0
	}
})
