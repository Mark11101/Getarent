import React from 'react'
import { useSelector } from 'react-redux'
import NestedNavigation from '../components/NestedNavigation'
import * as PS from '../store/profile/selectors'
import compare from '../libs/compare'
import {
	Profile,
	ManageProfile,
	GuestRegistration,
	Auth,
	Reviews,
	Observer,
	UnauthorizedProfile,
	RecoverPassword,
	RecoverPasswordNew,
	RecoverPasswordFinal,
	RentOutSection,
	RentOutArticle,
	RentOutSearch,
	PublicProfile,
	RentOutNoCar,
	HostRegistration
} from '../screens'
import { ROLE } from '../constants/roles'
import { SCORING_STATUS } from '../constants/scoring'
import { Waiter } from '../components'

const profilePages = (
	<>
		<Profile name="Profile"/>
		<Reviews name="Reviews" />
		<ManageProfile name="ManageProfile" />
		<RentOutNoCar name="RentOutNoCar" />
		<RentOutSection name="RentOutSection" />
		<RentOutArticle name="RentOutArticle" />
		<RentOutSearch name="RentOutSearch" />
		<PublicProfile name="PublicProfile" />
	</>
)

const registrationPages = (role) => (
	<>
		<Observer name="Observer" />
		{ [ ROLE.GUEST, ROLE.OBSERVER ].includes(role) && <GuestRegistration name="GuestRegistration" /> }
		{ [ ROLE.HOST, ROLE.OBSERVER ].includes(role) && <HostRegistration name="HostRegistration" /> }
	</>
)

const getStackFor = {
	[ROLE.OBSERVER]: ({ scoringStatus, isBanned }) => {
		if (scoringStatus === SCORING_STATUS.NOT_PASSED) {
			return registrationPages(ROLE.OBSERVER)
		}
		if (!scoringStatus) return
		if (isBanned) return profilePages
	},
	[ROLE.GUEST]: ({ scoringStatus }) => {
		if (scoringStatus === SCORING_STATUS.NOT_PASSED) {
			return registrationPages(ROLE.GUEST)
		}
		return profilePages
	},
	[ROLE.HOST]: ({ isHostFinishedRegistration }) => {
		if (isHostFinishedRegistration === false) {
			return registrationPages(ROLE.HOST)
		}
		return profilePages
	}
}

const ProfileStack = () => {
	const isAuthorized = useSelector(PS.isAuthorizedSelector, compare.values)
	const role = useSelector(PS.roleSelector, compare.values)
	const isBanned = useSelector(PS.isBannedSelector, compare.values)
	const scoringStatus = useSelector(PS.scoringStatusSelector, compare.values)
	const isHostFinishedRegistration = useSelector(PS.isHostFinishedRegistrationSelector, compare.values)
	
	const authorizedPages = getStackFor[role]({
		isBanned,
		scoringStatus,
		isHostFinishedRegistration
	})

	if (isAuthorized && !authorizedPages) return <Waiter />

	return <NestedNavigation>
		{
			isAuthorized
				? authorizedPages
				: <>
					<UnauthorizedProfile name="Unauthorized" />
					<Auth name="Auth" />
					<RecoverPassword name="RecoverPassword" />
					<RecoverPasswordNew name="RecoverPasswordNew" />
					<RecoverPasswordFinal name="RecoverPasswordFinal" />
				</>
		}
	</NestedNavigation>
}

export default ProfileStack
