import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { TimerPicker } from "react-native-timer-picker"
import LinearGradient from 'react-native-linear-gradient'
import { BlurPopup } from '../components'
import theme from "../theme";
import { WINDOW_HEIGHT, isAndroid, isIos } from '../constants/app'

const toString = num => String(num).padStart(2, '0')

const hoursArray = new Array(24).fill(0).map((_, idx) => toString(idx))
const minutesArray = new Array(60).fill(0).map((_, idx) => toString(idx))

const TimePickerModal = ({ visible, onClose, label, hours = 8, minutes = 0 }) => {
	const [ state, setState ] = useState({ hours, minutes })

	return <BlurPopup
		transparent
		blurAmount={20}
		maskClosable={false}
		visible={visible}
		onClose={onClose}
	>
		{
			label && <View style={[
				styles.row,
				styles.selectorHeader,
				isAndroid && { top: -20 },
			]}>
				<Text style={styles.selectorHeader.text}>
					{ label }
				</Text>
			</View>
		}

		{
			isAndroid ? <View style={[styles.row, { left: 15, zIndex: 3000 }]}>
				<TimerPicker
					padWithNItems={3}
					disableInfiniteScroll
					hideSeconds
					hourLabel=":"
					minuteLabel=""
					initialHours={toString(state.hours)}
					initialMinutes={toString(state.minutes)}
					LinearGradient={LinearGradient}
					styles={{
						theme: "light",
						backgroundColor: 'transparent',
						pickerItem: {
							fontSize: 20,
						},
						pickerLabel: {
							fontSize: 18,
							left: 10,
							top: -2,
						},
						pickerItemContainer: {
							width: 90,
						},
					}}
					onDurationChange={({ hours, minutes }) => {
						setState({ hours: + hours, minutes: +minutes })
					}}
				/>
			</View> : <View style={styles.row}>
				<Picker
					style={styles.picker}
					itemStyle={styles.itemStyle}
					testID="hour-picker"
					selectedValue={toString(state.hours)}
					onValueChange={hours => setState(prev => ({ ...prev, hours: +hours }))}
				>
					{
						hoursArray.map(hour => (
							<Picker.Item
								color='black'
								key={hour}
								label={hour} 
								value={hour} 
							/>
						))
					}
				</Picker>
				<Text style={styles.seperator}>:</Text>
				<Picker
					style={styles.picker}
					itemStyle={styles.itemStyle}
					testID="minute-picker"
					selectedValue={toString(state.minutes)}
					onValueChange={minutes => setState(prev => ({ ...prev, minutes: + minutes }))}
				>
					{
						minutesArray.map(minute => (
							<Picker.Item
								color='black'
								key={minute}
								label={minute} 
								value={minute} 
							/>
						))
					}
				</Picker>
			</View>
		}
		<TouchableOpacity 
			style={[
				styles.selectorCloseBtn,
				{ top: isAndroid ? 25 : -40 },
			]}
			onPress={() => onClose(state)}
		>
			<Text style={styles.selectorCloseBtn.text}>
				Подтвердить
			</Text>
		</TouchableOpacity>
	</BlurPopup>
}

const styles = StyleSheet.create({
	...theme.row,
	...theme.margins,

    picker: {
        width: '50%',
    },
    itemStyle: {
        fontSize: 18,
		lineHeight: 30,
		height: WINDOW_HEIGHT - 300,
    },
	selectorHeader: {

		width: '90%',
		top: 20,
		justifyContent: 'center',

		text: {
			fontFamily: theme.fonts.inter,
			fontSize: 16,
			lineHeight: 20,
			color: theme.colors.secondaryTextGrey,
		}
	},
    selectorCloseBtn: {
		borderWidth: isIos ? 0.4 : 1,
		borderColor: theme.colors.secondaryTextGrey, 
		borderRadius: 30,
		paddingHorizontal: 32,
		paddingVertical: 10,

		text: {
			fontFamily: theme.fonts.inter,
			fontSize: 18,
			lineHeight: 20,
			color: '#6c7480',
		}
	},
	seperator: {
		fontFamily: theme.fonts.inter,
		fontSize: 25,
		lineHeight: 25,
		color: theme.colors.secondaryTextGrey,
	}
})

export default TimePickerModal
