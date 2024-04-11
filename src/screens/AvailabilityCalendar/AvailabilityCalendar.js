import { 
    View, 
    Text, 
    Image,
    Animated,
    TextInput,
    ScrollView,
    BackHandler,
    SafeAreaView, 
    TouchableOpacity, 
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import api from 'api';
import actions from 'actions';
import { carStatuses } from 'constants';
import { AvailabilityCalendar as Calendar, Waiter } from 'components';

import SearchIcon from 'img/availability-calendar/search-icon.svg';
import GoBackIcon from 'img/availability-calendar/go-back-icon.svg';

import s from './styles';

const TAB_WIDTH = 139;

const {
	statuses: { 
        PUBLISHED, 
        RENT,
        STASHED
    },
} = carStatuses;

const AvailabilityCalendar = () => {

    const dispatch = useDispatch();

    const { carsList: cars, carEditData } = useSelector(st => st.profile);

    const [carsList, setCarsList] = useState([]);

    const [tabIndex, setTabIndex] = useState(0);
    const [tabCarId, setTabCarId] = useState();

    useEffect(() => {

        const filteredCars = cars.filter((car) => (
            car.status === PUBLISHED || 
            car.status === RENT ||
            car.status === STASHED
        ));
        
        setCarsList(filteredCars);
        setTabCarId(filteredCars[0]?.uuid);

    }, [cars]);
    
    const [initiallyBlockedDates, setInitiallyBlockedDates] = useState([]);
    const [blockedDatesToUpdate, setBlockedDatesToUpdate] = useState([]);
    const [unavailabilityDates, setUnavailabilityDates] = useState({});

    const [isLoading, setIsLoading] = useState(true);

    const scrollViewRef = React.useRef();

    useEffect(() => {
        setIsLoading(true);
		tabCarId && dispatch(actions.getCarEditData(tabCarId));
	}, [tabCarId]);

    useEffect(() => {

		carEditData?.unavailabilityDates?.blocked 
		&&
            setInitiallyBlockedDates(carEditData.unavailabilityDates.blocked)

	}, [carEditData.unavailabilityDates]);

    useEffect(() => {
        if (!!carEditData) {
            setUnavailabilityDates(carEditData.unavailabilityDates);
            setIsLoading(false);
        } 
    }, [carEditData]);

    useEffect(() => {

        const backAction = () => {

            const areEqual = JSON.stringify(initiallyBlockedDates) === JSON.stringify(blockedDatesToUpdate);

            if (!areEqual) {

                dispatch(
                    actions.postEditData(tabCarId, {
                        ...carEditData,
                        blockedDates: blockedDatesToUpdate,
                    })
                );
            };
        };
    
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
        );
    
        return () => backHandler.remove();

      }, []);

    const [ translateValue ] = useState(new Animated.Value(0));

    Animated.spring(translateValue, {
        toValue: tabIndex * (TAB_WIDTH + 16),
        velocity: 10,
        useNativeDriver: true,
    }).start();

    const [input, setInput] = useState('');
    const [isSearchVisble, setIsSearchVisble] = useState(false);

    const inputRef = React.useRef();

    const heightAnimation = React.useRef(new Animated.Value(0)).current;
    const marginAnimation = React.useRef(new Animated.Value(0)).current;
    const opacitySearchAnimation = React.useRef(new Animated.Value(0)).current;

    const showUp = () => {

        Animated.timing(heightAnimation, {
            toValue: 35,
            duration: 300,
            useNativeDriver: false,
        }).start();

        Animated.timing(marginAnimation, {
            toValue: 16,
            duration: 300,
            useNativeDriver: false,
        }).start();

        Animated.timing(opacitySearchAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };
  
    const showDown = () => {

        Animated.timing(heightAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start();

        Animated.timing(marginAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start();

        Animated.timing(opacitySearchAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    useEffect(() => {

        if (isSearchVisble) {

            showUp();

            setTimeout(() => {
                inputRef.current?.focus();
            }, 300);

        } else {
            showDown();
            setInput('');
        };
        
    }, [isSearchVisble]);
    
    return (
        <SafeAreaView style={s.container}>
            <View style={[s.row, s.header]}>
                <TouchableOpacity
                    style={s.header.goBackBtn}
                    onPress={() => {
                        
                        api.navigation.goBack();

                        const areEqual = JSON.stringify(initiallyBlockedDates) === JSON.stringify(blockedDatesToUpdate);

                        if (!areEqual) {

                            dispatch(
                                actions.postEditData(tabCarId, {
                                    ...carEditData,
                                    blockedDates: blockedDatesToUpdate,
                                })
                            );
                        };
                    }}
                >
                    <GoBackIcon />
                </TouchableOpacity>
                <Text style={s.header.title}>
                    Календарь доступности
                </Text>
            </View>
            {
                carsList.length === 0
                ?
                    <View style={s.noData}>
                        <Text style={s.noData.text}>
                            Здесь вы сможете выбрать недоступные даты аренды для каждой машины, успешно прошедшей модерацию
                        </Text>
                    </View>
                :
                    <>
                        <View style={[s.row, s.cars]}>
                            <TouchableOpacity
                                style={s.cars.searchBtn}
                                onPress={() => setIsSearchVisble(!isSearchVisble)}
                            >
                                <SearchIcon />
                            </TouchableOpacity>
                            <ScrollView 
                                horizontal
                                ref={scrollViewRef}
                                showsHorizontalScrollIndicator={false}
                            >
                                {
                                    carsList
                                    .filter((car) => (
                                        car.brand.toLowerCase().includes(input) || 
                                        car.model.toLowerCase().includes(input) ||
                                        car.registrationNumber.toLowerCase().includes(input)
                                    ))
                                    .map((car, i) => (
                                        <TouchableOpacity 
                                            onPress={() => {

                                                const areEqual = JSON.stringify(initiallyBlockedDates) === JSON.stringify(blockedDatesToUpdate);

                                                if (!areEqual) {

                                                    dispatch(
                                                        actions.postEditData(tabCarId, {
                                                            ...carEditData,
                                                            blockedDates: blockedDatesToUpdate,
                                                        })
                                                    );
                                                };

                                                const pressedIndex = carsList.findIndex((initialCar) => initialCar.uuid === car.uuid);

                                                if (car.uuid !== tabCarId) {

                                                    const scrollToCar = () => {
                                                        
                                                        const translation = pressedIndex * (TAB_WIDTH + 0);
                
                                                        scrollViewRef.current?.scrollTo({ 
                                                            x: pressedIndex < tabIndex ? (translation - (TAB_WIDTH - 120)) : translation, 
                                                            animated: true 
                                                        });
                                                    };

                                                    if (input !== '') {
                                                        
                                                        setInput('');

                                                        setTimeout(() => {
                                                            scrollToCar()
                                                        }, 500);

                                                    } else {
                                                        scrollToCar();
                                                    };
                
                                                    setIsLoading(true);
                                                    
                                                    setTabIndex(pressedIndex);
                                                    setTabCarId(car.uuid);
                                                }; 
                                            }} 
                                            style={[s.row, s.cars.tab]}
                                        >
                                            <Image 
                                                width={32} 
                                                height={32} 
                                                style={s.cars.tab.image}
                                                source={{ uri: car.photoUrl }} 
                                            />
                                            <View>
                                                <Text numberOfLines={1} style={s.cars.tab.title}>
                                                    {car.brand} {car.model}
                                                </Text>
                                                <Text style={s.cars.tab.helpText}>
                                                    {car.registrationNumber}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                }
                                {
                                    input === ''
                                    &&
                                        <Animated.View
                                            style={[
                                                s.cars.tab.indicator,
                                                {
                                                    transform: [{ translateX: translateValue }],
                                                },
                                            ]}
                                        />
                                }
                            </ScrollView>
                        </View>
                        <Animated.View style={{
                            height: heightAnimation ,
                            marginVertical: marginAnimation,
                            opacity: opacitySearchAnimation,
                            paddingHorizontal: 16,
                        }}>
                            <TextInput 
                                ref={inputRef}
                                value={input}
                                placeholder='Марка, модель или госномер'
                                placeholderTextColor="#878F9B" 
                                style={[
                                    s.searchInput,
                                    {
                                        height: 35,
                                    }
                                ]}
                                onChangeText={(text) => setInput(text.toLowerCase())}
                            />
                        </Animated.View>
                        <View style={s.weekDays}>
                            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                                <Text key={day} style={s.weekDay}>
                                    {day}
                                </Text>
                            ))}
                        </View>
                        {
                            unavailabilityDates
                            &&
                                <Calendar 
                                    vertical
                                    carId={tabCarId}
                                    carEditData={carEditData}
                                    unavailabilityDates={unavailabilityDates} 
                                    initiallyBlockedDates={initiallyBlockedDates}
                                    onUpdateBlockedDates={setBlockedDatesToUpdate}
                                />
                        }
                        {
                            isLoading
                            &&
                                <View style={s.loading}>
                                    <Waiter />
                                </View>
                        }
                    </>
            }
        </SafeAreaView>
    )
};

export default AvailabilityCalendar;
