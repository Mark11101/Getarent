import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import styles from './styles'
import Avatar from '../Avatar'
import { InlineRating } from '../Rating'
import { ROLE, ROLE_SUPER_TITLE } from '../../constants/roles'
import ButtonText from '../ButtonText'
import api from '../../api'
import ConditionallyTouchable from '../ConditionallyTouchable'
import { AccordionArrowSvg, PencilSvg, StarMedalSvg, SteeringWheelSvg } from '../Svg'

const ROLE_SUPER_ICON = {
	[ROLE.GUEST]: <SteeringWheelSvg />,
	[ROLE.HOST]: <StarMedalSvg />
}

const LineBugHack = ({ children }) => {
	return <>
		{/* Prevents white line (gap between SafeAreaView and ProfileHeader) on refresh (dirty hack) */}
		<View style={styles.prolongation} />

		{ children }
	</>
}

export const ProfileHeader = ({ avatar, isLoading, firstName, rating, role, isSuper }) => {

	const _onManage = () => {
		api.navigation.navigate('ManageProfile')
	}

	return <TouchableOpacity
		style={[ styles.flexCentered, styles.container ]}
		activeOpacity={0.7}
		onPress={_onManage}
	>
		<LineBugHack>
			<Avatar
				avatar={avatar}
				diameter={48}
				isLoading={isLoading}
			/>

			<View style={styles.content}>
				<View style={styles.title}>
					<Text style={styles.name}>{ firstName }</Text>
					<InlineRating value={rating} style={{ marginLeft: 16 }} />
				</View>

				{
					isSuper &&<View style={styles.status}>
						{ ROLE_SUPER_ICON[role] }
						<Text style={styles.statusTitle}>
							{ ROLE_SUPER_TITLE[role] }
						</Text>
					</View>
				}

				<ButtonText
					activeOpacity={0.5}
					style={{ ...styles.manageLink, marginTop: 8 }}
					textStyle={styles.manageLinkText}
					title='Управление аккаунтом'
					onPress={_onManage}
				/>
			</View>

			<AccordionArrowSvg />
		</LineBugHack>
	</TouchableOpacity>
}

export const ManageProfileHeader = ({ isGuest, avatar, firstName, lastName, midName, birthDate, trademark, isLoading, onPress }) => {
	const _onBack = () => {
		api.navigation.goBack()
	}

	const _onAvatarPress = React.useCallback(() => {
		api.navigation.navigate('ProfileAvatarModal', { avatar })
	}, [ avatar ])

	return <View style={styles.container}>
		<LineBugHack>
			<TouchableOpacity
				style={[ styles.flexCentered, styles.backBtn ]}
				activeOpacity={0.7}
				onPress={_onBack}
			>
				<AccordionArrowSvg style={styles.backBtnIcon} />
				<Text style={styles.name}>Управление аккаунтом</Text>
			</TouchableOpacity>

			<View style={styles.flexCentered}>
				<TouchableOpacity
					style={styles.avatarContainer}
					activeOpacity={0.8}
					onPress={_onAvatarPress}
				>
					<PencilSvg style={styles.avatarEditIcon} />
					<Avatar
						avatar={avatar}
						diameter={48}
						isLoading={isLoading}
					/>
				</TouchableOpacity>

				<ConditionallyTouchable onPress={onPress} style={[ styles.flexCentered, { flex: 1 } ]}>
					<View style={[ styles.content, { gap: 2 } ]}>
						<Text style={styles.secondaryText}>
							{ trademark ? 'Торговое название' : 'Фамилия, имя, отчество' }
						</Text>

						<Text style={styles.text}>
							{
								trademark
								|| [ lastName, firstName, midName ]
									.filter(Boolean).join(' ')
							}
						</Text>

						{
							isGuest && <Text style={styles.secondaryText}>
								{ birthDate }
							</Text>
						}
					</View>

					{ !!onPress?.call && <AccordionArrowSvg /> }
				</ConditionallyTouchable>
			</View>
		</LineBugHack>
	</View>
}

export const UnauthorizedProfileHeader = () => {
	const _onAuth = () => {
		api.navigation.navigate('Auth')
	}

	return <TouchableOpacity
		style={[ styles.flexCentered, styles.container ]}
		activeOpacity={0.7}
		onPress={_onAuth}
	>
		<LineBugHack>
			<Avatar diameter={48} />

			<View style={[ styles.content, { gap: 2 } ]}>
				<Text style={styles.name}>Добро пожаловать</Text>

				<ButtonText
					activeOpacity={0.5}
					style={styles.manageLink}
					textStyle={styles.manageLinkText}
					title='Войти / Регистрация'
					onPress={_onAuth}
				/>
			</View>

			<AccordionArrowSvg />
		</LineBugHack>
	</TouchableOpacity>
}
