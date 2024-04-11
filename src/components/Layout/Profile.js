import React, { useEffect } from 'react'
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text} from 'react-native'
import theme from '../../theme'
import { VERSION } from '../../constants/app'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../../actions'
import { ROLE } from '../../constants/roles'
import { profileLoadingSelector, roleSelector } from '../../store/profile/selectors'
import compare from '../../libs/compare'

export const ProfileLayout = ({ children, onRefresh, refreshing = false, version = true }) => {
	const dispatch = useDispatch()

	const loading = useSelector(profileLoadingSelector, compare.values)
	const role = useSelector(roleSelector, compare.values)

	const getProfileData = () => {
		dispatch(actions.profileRequest())
		dispatch(actions.bankCardRequest())
		role === ROLE.HOST && dispatch(actions.getCarsList())
	}

	useEffect(() => {
		getProfileData()
	}, [])

	return <React.Fragment>
		<SafeAreaView style={{ flex: 0, backgroundColor: '#F5F5F7' }} />
		<SafeAreaView
			style={[
				theme.styles.flex,
				theme.styles.paper
			]}
		>
			<ScrollView
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={refreshing ?? loading}
						onRefresh={onRefresh?.call ? onRefresh : getProfileData}
						style={{ backgroundColor: '#F5F5F7' }}
					/>
				}
			>
				{ children }

				{
					version && <Text style={styles.version}>
						{ 'Версия приложения ' + VERSION }
					</Text>
				}
			</ScrollView>
		</SafeAreaView>
	</React.Fragment>
}

const styles = StyleSheet.create({
	version: {
		marginLeft: 16,
		marginBottom: 65,

		color: theme.colors.black,
		fontFamily: theme.fonts.inter
	}
})
