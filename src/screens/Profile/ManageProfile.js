import React, { useCallback, useEffect, useMemo } from 'react'
import { Text, View, Alert, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import styles from './styles'
import {
	MenuItem,
	LabeledMenuItem,
	ManageProfileHeader,
	ProfileLayout,
	ButtonText
} from '../../components'
import actions from '../../actions'
import { phoneMask, serialNumberMask } from '../../libs/masks'
import compare from '../../libs/compare'
import { numbersToDaysString } from '../../libs/dateTime'
import { pluralize } from '../../functions'
import api from '../../api'
import * as GS from '../../store/guest/selectors'
import * as HS from '../../store/host/selectors'
import * as PS from '../../store/profile/selectors'

export const ManageProfile = ({ navigation }) => {
	const role = useSelector(PS.roleSelector, compare.values)
	const userData = useSelector(PS.profileUserDataSelector, compare.props())
	const loading = useSelector(PS.profileLoadingSelector, compare.values)
	const { email, phone } = useSelector(PS.profileSelecotor, compare.props('email', 'phone'))
	const avatar = useSelector(PS.avatarSelector, compare.values)
	const isGuest = useSelector(PS.isGuestSelector, compare.values)
	const isHost = useSelector(PS.isHostSelector, compare.values)

	/* GUEST */
	const passport = useSelector(GS.guestPassportSelector, compare.props())
	const license = useSelector(GS.guestLicenseSelector, compare.props())

	/* HOST */
	const workingHours = useSelector(HS.hostWorkingHoursSelector, compare.props())
	const bio = useSelector(HS.hostBioSelector, compare.values)
	const ifTrademark = useSelector(HS.hostIfTrademarkSelector, compare.values)
	const useTrademark = useSelector(HS.useHostTrademarkSelector, compare.values)
	const trademark = useSelector(HS.hostTrademarkSelector, compare.values)

	const dispatch = useDispatch()

	const _dataRequest = useCallback(() => {
		dispatch(actions.profileRequest())
	}, [ role ])

	useEffect(() => {
		_dataRequest()
	}, [])

	const _onLogout = React.useCallback(() => Alert.alert(
		'Выйти',
		'Вы уверены, что хотите выйти?', [
			{
				text: 'Выйти',
				onPress: () => dispatch(actions.logout())
			},
			{ text: 'Отмена' }
		]
	), [ dispatch ])

	const _onDelete = React.useCallback(() => Alert.alert(
		'Вы уверены, что хотите удалить аккаунт?',
		'', [
			{
				text: 'Да',
				onPress: () => dispatch(actions.deleteAccount())
			},
			{ text: 'Нет' }
		]
	), [ dispatch ])

	const _onChangeRequest = React.useCallback(
		() => api.navigation.deepNavigate('Chats', 'Support'),
	[])

	const expYears = useMemo(() => {
		if (license.firstLicenseIssueYear) return new Date().getFullYear() - license.firstLicenseIssueYear
		return new Date().getFullYear() - new Date(license.dateOfIssue).getFullYear()
	}, [ license.firstLicenseIssueYear, license.dateOfIssue ])

	return <ProfileLayout version={false} onRefresh={_dataRequest}>
		<ManageProfileHeader
			isGuest={isGuest}
			avatar={avatar}
			{ ...userData }
			trademark={ifTrademark}
			isLoading={loading}
			onPress={
				isHost
					? () => navigation.navigate('HostProfileSettingsModal', {
						...userData,
						useTrademark,
						trademark
					})
					: null
			}
		/>

		<View style={styles.content}>
			{
				isHost && <>
					<Text style={[ styles.text, styles.sectionTitle ]}>Доступность</Text>
					<LabeledMenuItem
						label={numbersToDaysString(workingHours?.days)} arrow
						onPress={() => navigation.navigate('HostWorkingHoursModal', workingHours)}
					>
						{
							[
								workingHours?.startTime || '10:00',
								workingHours?.endTime || '20:00'
							].join(' - ')
						}
					</LabeledMenuItem>
					<Text style={[ styles.text, styles.sectionTitle ]}>Короткий текст о вас</Text>
					<MenuItem
						title={bio || 'Пусто'}
						onPress={() => navigation.navigate('HostAboutTextModal', { text: bio })}
						arrow
					/>
				</>
			}
			
			<Text style={[ styles.text, styles.sectionTitle ]}>Контактные данные</Text>
			<MenuItem.Group>
				<LabeledMenuItem label='Телефон' isFirst>
					{ phoneMask(phone) }
				</LabeledMenuItem>
				<LabeledMenuItem label='Почта' isLast>
					{ email || ' - ' }
				</LabeledMenuItem>
			</MenuItem.Group>

			{
				isGuest && <>	
					<Text style={[ styles.text, styles.sectionTitle ]}>Паспорт</Text>
					<MenuItem.Group>
						<LabeledMenuItem label='Серия и номер' isFirst>
							{ serialNumberMask(passport.serialNumber) }
						</LabeledMenuItem>
						<LabeledMenuItem label='Адрес регистрации'>
							{ passport.registrationAddress || ' - ' }
						</LabeledMenuItem>
						<LabeledMenuItem label='Дата выдачи паспорта' isLast>
							{ passport.dateOfIssue || ' - ' }
						</LabeledMenuItem>
					</MenuItem.Group>

					<Text style={[ styles.text, styles.sectionTitle ]}>Водительские права</Text>
					<MenuItem.Group>
						<LabeledMenuItem label='Серия номер прав' isFirst>
							{ serialNumberMask(license.serialNumber) }
						</LabeledMenuItem>
						<LabeledMenuItem label='Дата выдачи прав'>
							{ license.dateOfIssue || ' - ' }
						</LabeledMenuItem>
						<LabeledMenuItem label='Год выдачи первых прав'>
							{ license.firstLicenseIssueYear || ' - ' }
						</LabeledMenuItem>
						<MenuItem
							title={`Водительский стаж ${expYears} ${pluralize(expYears, 'год', 'года', 'лет')}`}
							arrow={false}
						/>
					</MenuItem.Group>
				</>
			}

			<MenuItem.Group>
				<MenuItem
					title={<Text style={[ styles.secondaryText, styles.redText ]}>
						Выйти из аккаунта
					</Text>}
					arrow={false}
					onPress={_onLogout}
				/>
				<MenuItem
					title='Удалить аккаунт'
					arrow={false}
					onPress={_onDelete}
				/>
			</MenuItem.Group>

			<ButtonText
				activeOpacity={0.5}
				style={[ styles.textBtn, localStyles.changeBtn ]}
				title='Заявка на измение данных'
				onPress={_onChangeRequest}
			/>
		</View>
	</ProfileLayout>
}

const localStyles = StyleSheet.create({
	changeBtn: {
		marginBottom: 65,
		marginLeft: 16,
		flex: 1
	}
})
