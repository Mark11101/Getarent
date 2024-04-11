import React from 'react'
import usePreventBack from '../../hooks/usePreventBack'

const PreventGoingBack = ({ children }) => {

	usePreventBack()

	return <>
		{ children }
	</>
}

export default PreventGoingBack
