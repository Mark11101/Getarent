import React, { useEffect, useMemo } from 'react'
import { Dimensions, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Modalize } from 'react-native-modalize'
import { AccordionArrowSvg } from '../Svg'
import theme from '../../theme'
import { isIos } from '../../constants/app'

const HEIGHT = Dimensions.get('window').height

export const ModalizedPage = ({
	visible, onClose, children, title,
	heightVh = 93, height,
	showHandle = false, showBackBtn = true, modalizeRef, 
	headerStyle, modalStyle = {}, ...props
}) => {
	const _onClose = () => {
		modalizeRef?.current?.close?.()
	}

	useEffect(() => {
		if (visible) {
			modalizeRef?.current?.open?.()
		} else {
			_onClose()
		}
	}, [ visible ])

	const modalHeight = useMemo(() => {
		return height ?? (HEIGHT / 100 * heightVh)
	}, [ height, heightVh ])

	return <Modalize
		ref={modalizeRef}
		modalHeight={
			props.adjustToContentHeight
				? undefined
				: modalHeight
		}
		handlePosition='inside'
		onClosed={() => onClose()}
		keyboardAvoidingBehavior={isIos ? 'padding' : 'height'}
		keyboardAvoidingOffset={0}
		handleStyle={showHandle ? {} : { display: 'none' }}
		modalStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, ...modalStyle }}
		closeAnimationConfig={{ timing: { duration: 300 } }}
		scrollViewProps={{
			contentContainerStyle: props.adjustToContentHeight
				? []
				: [
					styles.container,
					props.containerStyle
				],

			...(props.scrollViewProps || {})
			// keyboardShouldPersistTaps: 'always'
		}}

		{ ...props }
	>
		<View style={[ styles.header, headerStyle ]}>
			{
				showBackBtn && <TouchableOpacity
					style={styles.headerBackBtn}
					onPress={_onClose}
				>
					<AccordionArrowSvg style={styles.headerBackIcon} />
				</TouchableOpacity>
			}
			<Text style={styles.title}>{ title }</Text>
		</View>

		<View
			style={
				props.adjustToContentHeight
					? {}
					: [ styles.content/* , { height: modalHeight - 84 } */ ]
			}
		>
			{ children }
		</View>
	</Modalize>
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingBottom: 32
	},
	header: {
		height: 20,
		alignItems: 'center',
		marginVertical: 16
	},
	content: {
		flexGrow: 1,
		flexShrink: 0,
		flexBasis: 'auto',
	},
	title: {
		fontSize: 16,
		color: theme.colors.black,
		fontFamily: theme.fonts.inter,
		fontWeight: 'bold'
	},
	headerBackBtn: {
		position: 'absolute',

		alignItems: 'center',
		justifyContent: 'center',

		top: -20,
		left: -8,
		padding: 20

	},
	headerBackIcon: {
		height: 8,
		transform: [ { rotate: '180deg' } ]
	}
})
