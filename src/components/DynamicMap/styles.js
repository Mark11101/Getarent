import { StyleSheet, Dimensions } from "react-native";

import theme from "theme";

const { width }  = Dimensions.get('window');

const styles = StyleSheet.create({
	carItem: {
		...theme.spacing(6),
		marginTop: theme.spacing(6),
	},
	modalStyle: {
		...theme.shadow(24),
	},
    flexTheme: {
        ...theme.styles.flex,
    },
	map: {
        width,
		height: width,
    }
});

export default styles
