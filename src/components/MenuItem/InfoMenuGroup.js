import React from 'react'
import { Linking } from 'react-native'
import MenuItem from './Base'
import { JURISTIC_SECTION_URI, PRIVACY_POLICY_URI } from '../../constants/outerLinks'
import api from '../../api'
import { DocumentSvg, DocumentsSvg } from '../Svg'

const InfoMenuGroup = ({ children }) => {

	return <MenuItem.Group>
		<MenuItem
			title='Юридический раздел'
			prefixContent={<DocumentsSvg />}
			onPress={() => Linking.openURL(JURISTIC_SECTION_URI)}
		/>
		<MenuItem
			title='Наша политика конфиденциальности'
			prefixContent={<DocumentSvg />}
			onPress={() => api.navigation.navigate('DocumentPopup', {
				uri: PRIVACY_POLICY_URI
			})}
		/>

		{ children }
	</MenuItem.Group>
}

export default InfoMenuGroup
