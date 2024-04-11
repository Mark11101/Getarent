import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import theme from 'theme';

const SectionItem = ({ subtitle, secondSubtitle, icon, styles, children }) => {

	return (
		<View style={[s.container, styles]}>
			{
				icon
				?
					<View style={s.icon}>
						{icon()}
					</View>
				:
					<View style={s.dot} />
			}
			<View style={theme.styles.flex}>
				<Text style={theme.styles.P1R}>
					{children}
				</Text>
				{
					!!subtitle 
					&& 
						<Text style={s.subtitle}>
							{subtitle}
						</Text>
				}
				{
					!!secondSubtitle 
					&&
						<Text style={s.subtitle}>
							{secondSubtitle}
						</Text>
				}
			</View>
		</View>
	);
};

export default React.memo(SectionItem);

const s = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: theme.spacing(2),
	},
	dot: {
		width: theme.normalize(4),
		height: theme.normalize(4),
		backgroundColor: theme.colors.lightCyan,
		marginRight: theme.spacing(3),
	},
	icon: {
		marginRight: theme.spacing(3),
	},
	subtitle: {
		...theme.styles.P2R,
		color: theme.colors.darkGrey,
	},
});
