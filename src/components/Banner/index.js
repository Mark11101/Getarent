import React from 'react'
import Banner from './Base'
import { Image } from 'react-native'
import theme from '../../theme'
import ButtonText from '../ButtonText'

const BlockBanner = ({ onPress }) => {

	return <Banner
		title='Вы заблокированны'
		desc='Обратиться в тех. поддержку'
		descStyles={{ color: '#DBE3EF' }}
		icon={<Image
			style={{ width: 150, height: 74, right: 0 }}
			source={require('img/banners/pretty-stop-sign.png')}
		/>}
		onPress={onPress}
		backgroundColor='#FF471D'
	/>
}
			
const CheckingDocumentsBanner = ({ onPress }) => {

	return <Banner
		title='Документы на проверке'
		desc='Обычно это занимает не более 15 минут'
		descStyles={{ color: '#F5F5F7' }}
		icon={<Image
			style={{ width: 113, height: 113, top: -40, right: 10 }}
			source={require('img/banners/pretty-note.png')}
		/>}
		onPress={onPress}
		backgroundColor={theme.colors.black}
	/>
}

const SuperDriverBanner = ({ onPress = () => {} }) => {

	return <Banner
		title='Статус «Суперводитель»'
		desc='Что дает и как получить?'
		descStyles={{ color: theme.colors.svgLightGrey }}
		icon={<Image
			style={{ width: 150, height: 162, top: -70, right: 0 }}
			source={require('img/banners/pretty-steering-wheel.png')}
		/>}
		onPress={onPress}
		backgroundColor={theme.colors.greyBlue}
	/>
}

const AddYourVehicleBanner = ({ onLearnMore }) => {
	return <Banner
		title='Добавьте свое авто'
		titleStyles={{ color: theme.colors.black, marginBottom: 8 }}
		desc='Получайте заявки на аренду от проверенных водителей и зарабатывайте'
		contentWidth='60%'
		style={{ borderWidth: 1, borderStyle: 'solid', borderColor: '#DBE3EF' }}
		icon={<Image
			style={{ width: 132, height: 175, top: -50, right: 16 }}
			source={require('img/banners/pretty-keys.png')}
		/>}
		button={<ButtonText
			style={{
				alignItems: 'flex-start',
				paddingLeft: 0,
				paddingBottom: 0
			}}
			title='Узнать больше'
			onPress={onLearnMore}
		/>}
	/>
}

export {
	Banner,
	BlockBanner,
	CheckingDocumentsBanner,
	SuperDriverBanner,
	AddYourVehicleBanner
}
