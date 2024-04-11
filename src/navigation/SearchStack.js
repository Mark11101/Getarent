import React from 'react'
import { AdditionalServices, Car, Catalog, DatePicker, Filters, Location } from '../screens'
import NestedNavigation from '../components/NestedNavigation'

const SearchStack = () => {
	return <NestedNavigation>
		<Catalog name="Catalog" />
		<Car name="Car" />
		<AdditionalServices name="AdditionalServices" />
		<DatePicker name="DatePicker" />
		<Location name="Location" />
		<Filters name="Filters" />
	</NestedNavigation>
}

export default SearchStack
