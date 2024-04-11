import React from 'react'
import { View } from 'react-native'
import {
	ProfileLayout,
	UnauthorizedProfileHeader,
	AddYourVehicleBanner,
	// ReviewSvg,
	// MenuItem,
	InfoMenuGroup
} from '../../components'
import styles from './styles'

export const UnauthorizedProfile = ({ navigation }) => {
	return <ProfileLayout>
		<UnauthorizedProfileHeader />

		<View style={styles.content}>
			<AddYourVehicleBanner
				onLearnMore={() => navigation.navigate('Cars', 'RentOutHasNoCar')}
			/>

			<InfoMenuGroup />

			{/* <MenuItem
				title='Обратная связь с серсисом'
				prefixContent={<ReviewSvg />}
			/> */}
		</View>
	</ProfileLayout>
}
