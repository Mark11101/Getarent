import { View, Modal, Platform, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { BlurView } from "@react-native-community/blur"
import CloseIcon from "img/close/close.svg"
import styles from './styles'

export const BlurPopup = ({ 
	children, 
	visible, 
	transparent, 
	withBlur = true,
	blurAmount = 3, 
	onClose, 
	closable = true,
}) => {

	return (
		<Modal
			animationType="fade"
			visible={visible}
			transparent
		>
			{
				withBlur
				&&
					<BlurView
						style={{ 
							position: "absolute",
							top: 0,
							left: 0,
							bottom: 0,
							right: 0
						}}
						blurType="light"
						blurAmount={blurAmount}
						reducedTransparencyFallbackColor="white"
					/>
			}
			<TouchableWithoutFeedback 
				onPressOut={() => !!closable && !!onClose && onClose()} 
			>
				<View style={[
					styles.modal,
					transparent && { backgroundColor: 'transparent' }
				]} >
					<TouchableWithoutFeedback>
						<View style={[ 
							styles.modalPanel,
							transparent && { backgroundColor: 'transparent' } 
						]}>
							{
								!!closable && <TouchableOpacity 
									style={styles.modalCloseBtn}
									onPress={onClose}
								>
									<CloseIcon width={22} height={22}/>
								</TouchableOpacity>
							}
							
							{ children }
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	)
}
