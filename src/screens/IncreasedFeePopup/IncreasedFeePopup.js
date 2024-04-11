import React from 'react';
import { View, Text, FlatList, ScrollView, SafeAreaView } from 'react-native';

import api from 'api';
import { Header, PrimaryButton } from 'components';

import s from './styles';
import theme from 'theme';

const IncreasedFeePopup = () => {

	return (
		<SafeAreaView style={[theme.styles.paper, theme.styles.flex]}>
			<ScrollView style={s.content}>
				<Header title={'Почему мы берем\n повышенный сбор КАСКО?'} />
				<View style={s.list}>
					<Text style={s.description}>
                        Этот сбор взымается, если водитель подходит хотя бы под один из трех критериев:
						{'\n'}
					</Text>
					<FlatList 
						data={[
							{
								id: '0',
								title: 'возраст до 25 лет',
							},
							{
								id: '1',
								title: 'стаж водителя менее 5 лет',
							},
							{
								id: '2',
								title: 'страховой коэффициент КБМ больше значения 1',
							},
						]}
						keyExtractor={item => item.id}
						renderItem={({item}) => (
							<Text style={{
								fontSize: 16,
							}}>
								• {item.title}
								{"\n"}
							</Text>
						)}
					/>
					<Text style={s.description}>
                        Чтобы отказаться от уплаты данного сбора, водителю необходимо выбрать автомобиль без страхования КАСКО
					</Text>
				</View>					
			</ScrollView>
			<PrimaryButton 
				title='Спасибо, понятно'
				style={s.submitBtn}
				onPress={() => api.navigation.goBack()}
			/>
		</SafeAreaView>
	);
};

export default IncreasedFeePopup;
