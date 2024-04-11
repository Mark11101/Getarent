import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import api from 'api';
import actions from 'actions';
import { WebPage, SafeAreaView, Header } from 'components';
import { trackPaymentCardAttached } from '../myTrackerService';
import theme from 'theme';

const Payment = ({ route: { params: { rentId, paymentUrl } = {} } }) => {

	const rent = useSelector(st => st.rentRoom.rent);
	const isRentRoomScreen = Object.keys(rent).length !== 0;

	const dispatch = useDispatch();

	const handleRequest = useCallback(
		(url) => {

			if (url.includes('OrderId')) {

				const orderId = url.match(/OrderId=([\w-]+)/)?.[1];

				if (orderId) {
					dispatch(actions.paymentSetOrderId(orderId));
				};
			};
			
			if (url.includes('success')) {
                trackPaymentCardAttached()
				if (url.includes('stage=ACCOUNT')) {
					api.navigation.replace(
						'AttachSuccess',
						{
							rentId: isRentRoomScreen ? rentId : undefined,
							goBackOnContinue: !isRentRoomScreen
						}
					)
				} else if (url.includes('stage=CHECKOUT')) {
					api.navigation.navigate(
						'AttachSuccess',
						{
							callback: () => {
								api.navigation.navigate('PaymentMethod')
							},
						}
					);
				} else if (url.includes('stage=undefined')) {
					api.navigation.replace(
						'AttachSuccess',
						{ goBackOnContinue: true }
					)
				} else {
					dispatch(actions.payment(true));
				}

				return false;

			} else if (url.includes('failed')) {

				if (url.includes('stage=ACCOUNT')) {
					api.navigation.navigate(
						'AttachFailed',
						{
							goBackTitle: isRentRoomScreen ? 'К аренде' : 'К профилю',
							stage: 'ACCOUNT',
							callback: () => {
								isRentRoomScreen
								?
									api.navigation.navigate('RentRoom', { uuid: rentId })
								:
									api.navigation.navigate('Profile')
							},
						}
					);
				} else if (url.includes('stage=CHECKOUT')) {
					api.navigation.navigate(
						'AttachFailed',
						{
							stage: 'CHECKOUT',
							callback: () => {
								api.navigation.goBack();
								api.navigation.goBack();
							},
						}
					);
				} else {
					dispatch(actions.payment(false));
				}

				return false;
			}

			return true;
		},
		[dispatch]
	);

	return (
		<SafeAreaView top bottom style={theme.styles.container}>
			<Header title="Оплата" />
			<WebPage uri={paymentUrl} {...{ handleRequest }} />
		</SafeAreaView>
	);
};

export default Payment;
