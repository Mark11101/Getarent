import { 
	View, 
	Text,
	Image, 
	PixelRatio, 
	Dimensions, 
	StyleSheet, 
	TouchableHighlight, 
} from 'react-native';
import React, { useState } from 'react';

import Separator from './Separator';

import theme from 'theme';

const { width }  = Dimensions.get('window');
const pixelSize  = PixelRatio.getPixelSizeForLayoutSize(width);
const size 		 = pixelSize < 100 ? 100 : pixelSize > 1280 ? 1280 : pixelSize;
const pointWidth = theme.normalize(20);

function StaticMap({ longitude, latitude }) {

	const [zoomValue, setZoomValue] = useState(16);
	
	return (
		<View style={styles.container}>
			{[14, 15, 16, 17, 18].map((zoom) => (
				<Image
					style={[styles.map, { zIndex: zoom === zoomValue ? 1000 : 500}]}
					source={{
						uri: `http://static.maps.2gis.com/1.0?zoom=${zoom}&size=${size},${size}&center=${longitude},${latitude}`,
					}}
				/>
			))}
			<View style={styles.point} />
			<View style={styles.controlBtns}>
				<TouchableHighlight 
					underlayColor="white"
					style={[
						styles.controlBtn, 							
						zoomValue === 18 && styles.greyControlBtn,
						{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
					]}
					onPress={() => setZoomValue(zoomValue + 1)}
					disabled={zoomValue === 18}
				>
					<Text style={styles.controlBtnText}>
						+
					</Text>
				</TouchableHighlight>
				<Separator light />
				<TouchableHighlight 
					underlayColor="white"
					style={[
						styles.controlBtn,
						zoomValue === 14 && styles.greyControlBtn,
						{ borderTopLeftRadius: 0, borderTopRightRadius: 0 },
					]}
					onPress={() => setZoomValue(zoomValue - 1)}
					disabled={zoomValue === 14}
				>
					<Text style={styles.controlBtnText}>
						—
					</Text>
				</TouchableHighlight>
			</View>
		</View>
	);
}

export default React.memo(StaticMap);

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		width,
		height: width,
		justifyContent: 'center',
		alignItems: 'center',
	},
	map: {
		position: 'absolute',
		width,
		height: width,
	},
	point: {
		position: 'absolute',
		zIndex: 1500,
		width: pointWidth,
		height: pointWidth,
		borderRadius: pointWidth / 2,
		backgroundColor: theme.colors.white,
		borderWidth: theme.normalize(3),
		borderColor: theme.colors.blue,
	},
	controlBtns: {
		position: 'absolute',
		right: 10,
		zIndex: 1500,
	},
	controlBtn: {
		width: theme.normalize(40),
		height: theme.normalize(40),
		backgroundColor: theme.colors.white,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
	},
	greyControlBtn: {
		backgroundColor: theme.colors.lightGrey
	},
	controlBtnText: {
		fontSize: 20,
	}
});
