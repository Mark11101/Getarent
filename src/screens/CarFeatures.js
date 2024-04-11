import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { carIncludedFeatures } from 'data';
import { SafeAreaView, Header, FeatureItem, Section, ReadMore } from 'components';

import theme from 'theme';

const CarFeatures = ({
	route: { params: { 
		name,
		carDescription,
		features = [] 
	} = {} },
}) => {

	return (
		<SafeAreaView top style={theme.styles.container}>
			<Header title="Комплектация машины" />
			<ScrollView contentContainerStyle={styles.content}>
				{!!carDescription && (
					<Section
						style={styles.readMore}
						title={`Вот что ${name} пишет о своей машине`}
					>
						<ReadMore
							style={theme.styles.P1R}
							numberOfLines={4}
						>
							{carDescription}
						</ReadMore>
					</Section>
				)}
				{features.map(item => (
					<FeatureItem
						key={item}
						icon={item}
						label={carIncludedFeatures[item]}
					/>
				))}
			</ScrollView>
		</SafeAreaView>
	);
};

export default CarFeatures;

const styles = StyleSheet.create({
	content: {
		paddingBottom: 30,
		paddingHorizontal: theme.spacing(6),
	},
	readMore: {
		paddingHorizontal: 0,
	}
});
