import { 
    View, 
    Text, 
    Image, 
    Animated,
    FlatList,
    Platform, 
    Dimensions, 
    TouchableOpacity,
} from "react-native";
import DeviceInfo from 'react-native-device-info';
import Carousel from 'react-native-snap-carousel';
import React, { useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import api from 'api';
import actions from 'actions';
import { useListEmpty } from 'hooks';
import { cities, setCity } from 'constants/cities';
import { PrimaryButton, Place, Separator } from 'components';

import s from './styles';
import theme from "theme";

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const isIphoneX = DeviceInfo.hasNotch();
const isAndroidX = Platform.OS === 'android' && HEIGHT >= 768;

const animatedResumeBtn = new Animated.Value(0);

const Screen = ({ item }) => {

    const { image, title, text, component } = item;

    return (
        component 
        ||
            <View>
                <Image 
                    resizeMode={WIDTH > 350 ? 'cover' : "contain"} 
                    style={{ width: WIDTH, maxHeight: HEIGHT / 2.5, marginBottom: 20 }} source={image} 
                />
                <View style={{ paddingHorizontal: 30 }}>
                    <Text style={s.title}>
                        {title}
                    </Text>
                    <Text style={s.text}>
                        {text}
                    </Text>
                </View>
            </View>
    )
};

const FirstLaunchScreens = ({ onClose }) => {

    const dispatch = useDispatch();    
    
    const { place } = useSelector(st => st.search);

    const carouselRef = useRef();

    const [activeSlide, setActiveSlide] = React.useState(0);

	const { init, error, refreshing } = useSelector(
		st => st.suggest
	);

	const emptyProps = {
		icon: 'error',
		iconColor: theme.colors.lightGrey,
		iconSize: theme.normalize(92),
		text: 'Ничего не найдено',
	};
	
	const listEmptyProps = useListEmpty(emptyProps, init, error);

    const onPress = async (item) => {
        
        await api.storage.set('isAppFirstLaunchImplemented', 'true');

        dispatch(actions.searchSetPlace(item, true));
        dispatch(actions.searchRequest());

        setCity(item.id);

        onClose();
    };

    const Item = React.memo(function Item({ item, style, index, onPress }) {
	
        return (
            <>
                <TouchableOpacity style={style} onPress={() => onPress(item)}>
                    <Place style={s.place} {...item} />
                </TouchableOpacity>
                {
                    index !== cities.length - 1
                    &&
                        <Separator light />
                }
            </>
        );
    });

	const renderItem = useCallback(
		({ item, index }) => <Item 
			key={item.id} 
			style={index === 0 && { paddingTop: 40 }}
			{...{ item, index, onPress }} 
		/>,
		[onPress]
	);

    const keyExtractor = o => String(o.id);

    const data = [
        {
            image: require('img/first-time-launch/first-screen.png'),
            title: 'Добро пожаловать в Getarent!',
            text: 'Здесь можно арендовать машины у ваших соседей или в прокатных компаниях города онлайн.',
        },
        {
            image: require('img/first-time-launch/second-screen.png'),
            title: 'Выбирайте машины по настоящим фото, рейтингам и отзывам',
            text: 'Есть поиск на карте. Можно оформить доставку к дому или в аэропорт.',
        },
        {
            image: require('img/first-time-launch/third-screen.png'),
            title: 'Оплата после получения машины',
            text: 'Оплата с помощью банковской карты. Все договоры заключаются онлайн.',
        },
        {
            image: require('img/first-time-launch/fourth-screen.png'),
            title: 'Простая и быстрая регистрация',
            text: 'Нужны только российские паспорт и права. Пока у нас правила такие:  от 21 года, стаж 2 года, постоянная прописка тоже РФ.',
        },
        {
            image: require('img/first-time-launch/fifth-screen.png'),
            title: 'Если в пути что-то произойдет...',
            text: 'Можно заранее купить страховку КАСКО. Поддержка помогает при ДТП, поломке и других проблемах на дорогах. Круглосуточно, без выходных.',
        },
        {
            component: <FlatList
                data={cities}
                style={s.cities}
                ListFooterComponent={ <View style={{ marginBottom: 150 }} /> }
                keyboardShouldPersistTaps="handled"
                {...{
                    refreshing,
                    keyExtractor,
                    renderItem,
                }}
                {...listEmptyProps}
            />
        }
    ];

    React.useEffect(() => {

        if (activeSlide === 4) {

            Animated.timing(animatedResumeBtn, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        };

        if (activeSlide === 5) {

            Animated.timing(animatedResumeBtn, {
                toValue: 200,
                duration: 300,
                useNativeDriver: true,
            }).start();

        };

    }, [activeSlide]);

    return (
        <View style={[
            s.container,
        ]}>
            <Carousel 
                data={data}
                ref={carouselRef}
                itemWidth={WIDTH}
                sliderWidth={WIDTH}
                renderItem={({ item }) => (
                    <Screen item={item} />
                )}
                onSnapToItem={setActiveSlide}
            />
            <Animated.View style={[s.resumeView, {
                transform: [{translateY: animatedResumeBtn}]
            }]}>
                <PrimaryButton
                    title="Далее"
                    style={s.resumeBtn}
                    onPress={() => {
                        carouselRef.current.snapToItem(activeSlide + 1);
                    }}
                />
            </Animated.View>
        </View>
    )
};

export default FirstLaunchScreens;
