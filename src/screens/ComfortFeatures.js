import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { carFeatures } from 'data';
import { formatPrice } from 'functions';
import { SafeAreaView, Header, SectionItem } from 'components';

import theme from 'theme';

const ComfortFeatures = ({
	route: { params: { features = [], rentDuration } = {} },
}) => {

	return (
		<SafeAreaView top style={theme.styles.container}>
			<Header title="Аксессуары для комфорта" />
			<ScrollView contentContainerStyle={styles.content}>
				{features.map((item, i) => (
					<SectionItem key={i}>
						<Text>
							{carFeatures[item.name]?.label + '\n'}
						</Text>
						{rentDuration < 7 ? (
							<Text style={theme.styles.P1}>
								{formatPrice(item.dailyPrice) + ' / день'}
							</Text>
						) : (
							<Text style={theme.styles.P1}>
								{formatPrice(item.wholeRentPrice)}
							</Text>
						)}
					</SectionItem>
				))}
			</ScrollView>
		</SafeAreaView>
	);
};

export default ComfortFeatures;

const styles = StyleSheet.create({
	content: {
		paddingHorizontal: theme.spacing(6),
	},
});
