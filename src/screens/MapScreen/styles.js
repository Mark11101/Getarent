import { StyleSheet } from "react-native";

import theme from "theme";

export const margin = theme.spacing(6);

const styles = StyleSheet.create({
	carItem: {
		margin,
		marginTop: margin,
	},
	modalStyle: {
		...theme.shadow(24),
	},
    flexTheme: {
        ...theme.styles.flex,
    },
	map: {
		position: 'absolute', 
		height: '100%', 
		width: '100%',
		zIndex: 750, 
    }
});

export default styles
