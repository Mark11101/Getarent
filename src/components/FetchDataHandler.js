import React, { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";

import api from 'api';
import actions from 'actions';

const FetchDataHandler = () => {

	const dispatch = useDispatch();

	const { authorized, role } = useSelector(st => st.profile);

	useEffect(() => {

		if (authorized) {

			setTimeout(() => {
				dispatch(actions.profileRequest());
			}, 1000);
		}
	}, [authorized]);

	useEffect(() => {

		if (role === 'HOST') {

			setTimeout(() => {
				dispatch(actions.getCarsList());
			}, 1000)
		}
	}, [role]);

	useEffect(() => {

		if (authorized && role !== 'OBSERVER') {
			dispatch(actions.tripsRequest(role, undefined));
		}

	}, [authorized, role])

	return (
		<></>
	)
};

export default FetchDataHandler;
