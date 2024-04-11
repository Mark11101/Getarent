import React from 'react';
import { Text } from 'react-native';

import { formatPrice } from 'functions';
import Section from './Section';
import SectionItem from './SectionItem';

import theme from 'theme';

const RentDiscounts = ({ sectionTitle, separator, discounts }) => {

	return (
		<Section title={sectionTitle} {...{ separator }}>
			{discounts.map(({ name, price }) => (
				<SectionItem key={name}>
					{`${name} — `}
					<Text style={theme.styles.P1}>
						{formatPrice(price)}
					</Text>
				</SectionItem>
			))}
		</Section>
	);
}

export default React.memo(RentDiscounts);
