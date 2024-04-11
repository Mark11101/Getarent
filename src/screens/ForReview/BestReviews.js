import React, { useEffect } from 'react';
import Carousel from 'react-native-snap-carousel';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import actions from 'actions';
import ReviewWithCar from './ReviewWithCar';

import theme from 'theme';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = SLIDER_WIDTH * 0.87;

const BestReviewsBlock = ({ openReview }) => {

	const dispatch = useDispatch();
	const { reviews } = useSelector(st => st.reviews, shallowEqual);

	useEffect(() => {
		dispatch(actions.getBestReviews());
	}, [dispatch]);

	const { length } = reviews || {};
	const isCarousel = React.useRef(null);

	if (!length) {
		return null;
	}
	
	return (
		<View style={styles.container}>
			<Text style={[theme.styles.H2, styles.title]}>
				Недавние отзывы
			</Text>
			<View style={styles.box}>
				<Carousel
					style={styles.carousel}
					ref={isCarousel}
					data={reviews}
					loop={true}
					renderItem={({ item }) => (
						<ReviewWithCar 
							review={item}
							openReview={(review) => openReview(review)}  
						/>
					)}
					sliderWidth={SLIDER_WIDTH}
					itemWidth={ITEM_WIDTH}
					inactiveSlideShift={10}
					inactiveSlideOpacity={1}
					useScrollView={true}
				/>
			</View>
		</View>
	);
};

export default React.memo(BestReviewsBlock);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	carousel: {
		marginRight: theme.normalize(20),
	},
	box: {
		top: -10,
		height: 350,
	},
	title: {
		color: theme.colors.black,
		fontWeight: '700',
		textAlign: 'center',
		marginTop: theme.spacing(15),
		marginBottom: theme.spacing(10),
	},
});
