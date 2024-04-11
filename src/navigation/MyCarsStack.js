import React from 'react'
import { useSelector } from 'react-redux'
import NestedNavigation from '../components/NestedNavigation'
import {
	AvailabilityCalendar,
	CarEdit,
	MyCars,
	PublicProfile,
	RentOutNoCar,
	RentOutHasACar,
	RentOutSection,
	RentOutArticle,
	RentOutSearch,
	HostRegistration
} from '../screens'
import { isHostCarAddedSelector, isHostSelector } from '../store/profile/selectors'
import compare from '../libs/compare'

const MyCarStack = () => {
	const isHostCarAdded = useSelector(isHostCarAddedSelector, compare.values)
	const isHost = useSelector(isHostSelector, compare.values)

	return <NestedNavigation>
		{
			isHostCarAdded
				? <RentOutHasACar name="RentOutHasACar" />
				: <RentOutNoCar name="RentOutNoCar" />
		}
		<RentOutSection name="RentOutSection" />
		<RentOutArticle name="RentOutArticle" />
		<RentOutSearch name="RentOutSearch" />
		<PublicProfile name="PublicProfile" />
		{
			isHost && <>
				<MyCars name="MyCars" />
				<CarEdit name="CarEdit" />
				<HostRegistration name="HostRegistration" />
				<AvailabilityCalendar name="AvailabilityCalendar" />
			</>
		}
	</NestedNavigation>
}

export default MyCarStack
