import React from 'react';
import Carousel from 'react-native-snap-carousel';
import { StyleSheet, View } from 'react-native';
import Review from './Review';
import { WINDOW_WIDTH } from '../../constants/app';
import { ITEM_WIDTH } from './common';

export default function Reviews({ reviews, loop = false, style, openReview }) {
	
	return (
		<>
			<View style={[styles.carousel, style]}>
				<Carousel
					data={reviews}
					renderItem={({ item }) => (
						<Review 
							review={item} 
							openReview={(review) => openReview(review)} 
						/>
					)}
					sliderWidth={WINDOW_WIDTH}
					itemWidth={ITEM_WIDTH}
					inactiveSlideShift={10}
					inactiveSlideOpacity={1}
					useScrollView={true}
					loop={loop}
				/>
			</View>

		</>
	);
}

const styles = StyleSheet.create({
	carousel: {
		height: 260,
	},
});
