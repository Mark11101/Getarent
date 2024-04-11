import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import styles from './styles'
import Waiter from '../Waiter'
import { AccordionArrowSvg } from '../Svg'

const MenuItemGroup = ({ children, style }) => {
	const filteredChildren = React.useMemo(
		() => React.Children.toArray(children).filter(Boolean),
		[ children ]
	)

	const count = React.useMemo(
		() => filteredChildren.length,
		[ filteredChildren ]
	)

	if (!count) return <></>

	return <View style={[ { marginBottom: 16 }, style ]}>
		{
			React.Children.toArray(children).filter(Boolean).map((child, idx) => {
				if (React.isValidElement(child)) {
					const isLast = (idx + 1) === count

					const topBorder =  idx === 0 ? 20 : 0
					const bottomBorder = isLast ? 20 : 0

					return React.cloneElement(child, {
						...child.props,
			
						containerStyle: {
							...(child.props.containerStyle || {}),
						
							borderTopLeftRadius: topBorder,
							borderTopRightRadius: topBorder,
							borderBottomLeftRadius: bottomBorder,
							borderBottomRightRadius: bottomBorder,
							marginBottom: 0
						},

						showBorder: !isLast
					})
				}
			})
		}
	</View>
}

const MenuItem = ({
	prefixContent, postfixContent, arrow = true, title,
	onPress = () => {}, containerStyle, showBorder, touchableStyle,
	loading, children
}) => {
	return <View style={[ styles.container, containerStyle ]}>
		<TouchableOpacity
			style={[ styles.touchable, touchableStyle ]}
			activeOpacity={0.7}
			onPress={loading ? () => {} : onPress}
		>
			{
				!!prefixContent && React.cloneElement(prefixContent, {
					...prefixContent.props,

					style: [ styles.prefixContent, prefixContent.props.style ]
				})
			}

			{
				typeof title === 'string'
					?  <Text style={styles.title}>{ title }</Text>
					: title
			}

			{
				loading
					? <Waiter size='small' style={{ marginTop: 0 }} isBlock />
					: !!postfixContent && React.cloneElement(postfixContent, {
						...postfixContent.props,

						style: [ styles.postfixContent, postfixContent.props.style ]
					})
			}

			{ arrow && <AccordionArrowSvg style={styles.arrowIcon} /> }

		</TouchableOpacity>

		{ showBorder && <View style={styles.line} /> }

		{ children }
	</View>
}

MenuItem.Group = MenuItemGroup

export const LabeledMenuItem = ({ label, children, isFirst = false, isLast = false, ...props }) => {
	const touchableStyle = {
		paddingVertical: 8
	}

	if (isFirst) touchableStyle.paddingTop = 16
	if (isLast) touchableStyle.paddingBottom = 16

	return <MenuItem
		arrow={false}
		touchableStyle={touchableStyle}
		{ ...props }
		title={<View style={{ flex: 1, gap: 2 }}>
			<Text style={styles.label}>{ label }</Text>
			<Text style={styles.value}>{ children }</Text>
		</View>}
	/>
}

export default MenuItem
