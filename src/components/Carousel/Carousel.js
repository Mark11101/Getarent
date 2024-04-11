import {
	View,
	Image,
	Animated,
	TouchableOpacity,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import React, { useState, useCallback, useEffect, useRef } from 'react';

import CarouselArrowIcon from 'img/carousel-arrow.svg';

import s from './styles';

const Pagination = ({ position, length }) => {

	if (length === 1) {
		return null;
	};

	const dots = [...Array(length).keys()];

	return (
		<View style={s.pagination} pointerEvents="none">
			{dots.map(n => (
				<Dot key={n} size={getSize(n, position, length)} />
			))}
		</View>
	);
};

const Dot = ({ size }) => {

	const [scale] = useState(() => new Animated.Value(size / 4));

	useEffect(() => {

		Animated.spring(scale, {
			toValue: size / 4,
			useNativeDriver: true,
		}).start();

	}, [size, scale]);

	return <Animated.View style={[s.dot, { transform: [{ scale }] }]} />;
};

const getSize = (n, position, length) => {

	if (
		(n === 0 && position > 2) ||
		(n === length - 1 && position < length - 3)
	) {
		return 1;
	}

	if (n === position - 1 || n === position + 1) {
		return 3;
	}

	if (n === position) {
		return 4;
	}

	return 2;
};

const Carousel = ({ photos, withArrows, styles, onPress }) => {
    // console.log('photos===Carousel====>',photos)
    const refPagerView = useRef();

	const { length } = photos || {};

    const [position, setPosition] = useState(0);

    const onPageSelected = useCallback(
        e => setPosition(e.nativeEvent.position),
        []
    );

    React.useEffect(() => {
        refPagerView.current?.setPage(position)
    }, [position])

	if (!length) {
		return null;
	};

	return (
		<View style={s.container}>
			<PagerView
                ref={refPagerView}
				style={s.container}
				initialPage={position > length ? length : position}
				{...{ onPageSelected }}
			>
				{photos.map(uri => (
					<TouchableOpacity
						key={uri}
						disabled={!onPress}
						onPress={() => onPress(uri)}
					>
						<Image
							style={[s.image, styles]}
							source={{ uri }}
							resizeMode="cover"
						/>
					</TouchableOpacity>
				))}
			</PagerView>
            {
                !withArrows
                ?
			        <Pagination {...{ position, length }} />
                :
                    <>
                        {
                            position !== 0
                            &&
                                <TouchableOpacity 
                                    style={s.leftArrow}
                                    onPress={() => setPosition(position - 1)}
                                >
                                    <CarouselArrowIcon
                                        width={22} 
                                        height={22} 
                                        style={s.leftArrowIcon} 
                                    />
                                </TouchableOpacity>
                        }
                        {
                            position !== Number(length) - 1
                            &&
                                <TouchableOpacity 
                                    style={s.rightArrow}
                                    onPress={() => setPosition(position + 1)}
                                >
                                    <CarouselArrowIcon 
                                        width={22} 
                                        height={22} 
                                        style={s.rightArrowIcon} 
                                    />
                                </TouchableOpacity>
                        }
                    </>
            }
		</View>
	);
};

export default Carousel;
