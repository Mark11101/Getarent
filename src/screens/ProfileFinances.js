import { useDispatch } from 'react-redux';
import { View, FlatList, SafeAreaView } from 'react-native';
import React, { useCallback, useState, useEffect } from 'react';

import api from 'api';
import actions from '../actions';
import { useListEmpty } from 'hooks';
import { Header, ProfileFinance, Waiter } from 'components';

import theme from 'theme';

const keyExtractor = o => o.rentId;

const emptyProps = {
	icon: 'error',
	iconSize: theme.normalize(112),
	text: 'У вас еще нет истории финансов.',
};

const ProfileFinances = () => {
	
	const dispatch = useDispatch();

	const [waiter, setWaiter] = useState(true);
	const [data, setData] = useState([]);
	
	const listEmptyProps = useListEmpty(emptyProps);
	
	const renderItem = useCallback(
		({ item }) => <ProfileFinance {...item} />,
		[]
	);

	useEffect(() => {

		setWaiter(true);
		
		const getData = async () => {
		
			try {
		
				const res = await api.web.getHistory();
		
				if (res?.error) {
					throw res.error;
				}
		
				setData(res);
		
			} catch (err) {

				console.log(err);

				dispatch(
					actions.error(
						'Не удалось загрузить данные, попробуйте еще раз'
					)
				);
				
			} finally {
				setWaiter(false);
			}
		};

		getData();
	}, [dispatch]);

	return (
		<SafeAreaView style={[theme.styles.paper, theme.styles.flex]}>
			{!waiter && (
				<React.Fragment>
					<Header title="Мои финансы" />
					<View style={theme.styles.flex}>
						<FlatList
							style={theme.styles.flex}
							{...{
								data,
								keyExtractor,
								renderItem,
							}}
							{...listEmptyProps}
						/>
					</View>
				</React.Fragment>
			)}
			{waiter && <Waiter />}
		</SafeAreaView>
	);
};

export default ProfileFinances; 
