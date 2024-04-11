import React from 'react';
import { View, StyleSheet } from 'react-native';

import SectionTitle from './SectionTitle';
import Separator from './Separator';

import theme from 'theme';

const Section = ({
	style,
	title,
	children,
	titleStyle,
	buttonTitle,
	separator = false,
	onPress,
}) => {

	return (
		<React.Fragment>
			<View style={[styles.container, style]}>
				<SectionTitle
					titleStyle={titleStyle}
					{...{ title, buttonTitle, onPress }}
				/>
				<View style={styles.childView}>
					{children}
				</View>
				{
					separator 
					&& 
						<Separator light />
				}
			</View>
		</React.Fragment>
	);
};

export default React.memo(Section);

const styles = StyleSheet.create({
	container: {
		paddingTop: theme.spacing(2),
		paddingHorizontal: theme.spacing(6),
		marginBottom: 5,
	},
	childView: {
		marginBottom: 30,
	},
});
