import React, { useEffect } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { Header, NotAvailableScreen, PaymentCard, ScrollViewChangeContent } from "components";
import actions from "actions";

import s from "./styles";
import theme from "theme";

const ProfilePayments = ({ route: { params: { stage, rentId } = {} } }) => {
	const dispatch = useDispatch();
	const { paymentCard } = useSelector(({ payment }) => payment);

	useEffect(() => {
		dispatch(actions.bankCardRequest());
	}, []);

	const { authorized, role } = useSelector(st => st.profile, shallowEqual);

	if (!(authorized && role === 'GUEST')) {
		return <NotAvailableScreen />;
	}

	return (
		<SafeAreaView style={[theme.styles.paper, theme.styles.flex]}>
			<Header title="Платежная карта" />

			<ScrollViewChangeContent
				style={theme.styles.container}
				contentContainerStyle={theme.styles.grow}
			>
				<View style={s.content}>
					{Object.keys(paymentCard).length === 0 && (
						<View style={s.existingCardText}>
							<Text>
								{`Добавьте карту к вашему аккаунту.\n`}
							</Text>
							<Text>
								Подойдет карта любого банка из России. Мы
								заморозим 1 рубль и сразу же его вернем.
							</Text>
						</View>
					)}

					<PaymentCard stage={stage} rentId={rentId} />
				</View>
			</ScrollViewChangeContent>
		</SafeAreaView>
	);
};

export default ProfilePayments;
