import { 
	View, 
	Text, 
	FlatList, 
	StyleSheet, 
	ScrollView, 
	SafeAreaView, 
} from 'react-native';
import React from 'react';

import api from 'api';
import { Header, PrimaryButton } from 'components';

import theme from 'theme';

const Popup = ({ route: { params: { price } = {} }}) => {
	
    return (
		<SafeAreaView style={[theme.styles.paper, theme.styles.flex]}>
			<ScrollView>
				<Header title={
                    <>
						<View>
							<Text style={styles.title}>
								Страховка КАСКО
							</Text>
						</View>
						<View style={styles.included}>
							<Text style={styles.includedText}>
								{!!price ? price + ' ₽' : 'Включено'}
							</Text>
						</View>
                    </>
                 } />
				<View style={styles.list}>
					<Text style={styles.description}>
						{
							!!price
							?
								'Страхование КАСКО за дополнительную стоимость'
							:
								'Владелец данного автомобиля сдает машину в аренду только с включенным страхованием КАСКО.'
						}
						{'\n'}
					</Text>
					{
						[
							{
								id: '0',
								title: 'Для водителей старше 25 лет со стажем от 5-ти лет и значением страхового кбм меньше 1 без дополнительных платежей'
							},
							{
								id: '1',
								title: `Для водителей младше 25 лет со стажем менее 5 лет и значением страхового кбм больше 1 предусмотрена дополнительная денежная комиссия. Она отобразится при бронировании`
							},
							{
								id: '2',
								title: <Text>Страхование КАСКО от повреждений ограничена суммой <Text style={{ fontWeight: '600' }}>до 3 500 000 руб.</Text></Text>
							},
							{
								id: '3',
								title: 'Страхуются все кузовные и стеклянные детали'
							},
							{
								id: '4',
								title: 'Ущерб возмещается на сумму свыше 20 000₽, убыток до 20 000₽ водителю необходимо возместить самостоятельно'
							},
							{
								id: '5',
								title: 'Не страхуются салон, колеса и диски'
							},
							{
								id: '6',
								title: 'Страхование предоставляется СПАО “Ингосстрах”'
							},
						].map((item) => (
							<Text key={item.id} style={{
								fontSize: 16,
								lineHeight: 24,
							}}>
								• {item.title}
								{"\n"}
							</Text>
						))
					}
					<Text style={styles.description}>
						При повреждении арендованного автомобиля необходимо оформить ДТП в полиции.
						{'\n'}
					</Text>
					<Text style={styles.description}>
						При причинении вреда здоровью и имуществу третьих лиц 
						ущерб покрывается полисом ОСАГО, который предоставляет владелец
					</Text>
					<PrimaryButton 
						title='Спасибо, понятно'
						style={styles.submitBtn}
						onPress={() => api.navigation.goBack()}
					/>
				</View>					
			</ScrollView>
		</SafeAreaView>
	);
};

export const InsurancePopup = React.memo(Popup);

const styles = StyleSheet.create({
	title: {
		marginRight: 10, 
		bottom: -1,
		...theme.styles.P1,
	},
	included: {
		backgroundColor: '#DBE3EF', 
		borderRadius: 10,
		alignItems: 'center',
		paddingHorizontal: 10,
		paddingVertical: 5,
		marginBottom: -2,
	},
	description: {
		...theme.styles.P1R,
	},
	list: {
		paddingLeft: theme.spacing(6),
		paddingRight: theme.spacing(12),
	},
	submitBtn: {
		marginVertical: theme.spacing(10),
	},
});
