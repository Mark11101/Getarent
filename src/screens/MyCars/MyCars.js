import { 
    View,
    Text,  
    Image,
    Animated,
    TextInput,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import api from 'api';
import actions from 'actions';
import { carStatuses } from 'constants';
import { formatPrice } from 'functions';
import { TouchableScale, PrimaryButton } from 'components';

import StarIcon from 'img/rent-out/no-car/star.svg';
import SearchIcon from 'img/rent-out/no-car/search.svg';
import LockIcon from 'img/rent-out/has-a-car/lock-icon.svg';
import WaitIcon from 'img/rent-out/has-a-car/wait-icon.svg';
import EyeOpenedIcon from 'img/rent-out/has-a-car/eye-opened.svg';
import SuccessIcon from 'img/rent-out/has-a-car/success-icon.svg';
import SettingsIcon from 'img/rent-out/has-a-car/settings-icon.svg';
import NoCarImage from 'img/rent-out/has-a-car/no-car-big-image.png';
import AddCarIcon from 'img/rent-out/has-a-car/add-car-black-icon.svg';

import s from './styles';
import theme from 'theme';
import { isHostFinishedRegistrationSelector } from '../../store/profile/selectors';
import compare from '../../libs/compare';

const {
	statuses: { 
        NOT_VERIFIED,
        INVALID,
        BANNED,
        VERIFICATION,
        PUBLISHED, 
        RENT,
        STASHED,
        CREATED,
    },
} = carStatuses;

const MyCars = ({ route: { params: { withGoHomeButton = false, onPressBack } = {} } }) => {

	const dispatch = useDispatch();

    const { carsList } = useSelector(st => st.profile);
    const isHostFinishedRegistration = useSelector(isHostFinishedRegistrationSelector, compare.values)

    const [input, setInput] = React.useState('');
    const [isSearchVisble, setIsSearchVisble] = React.useState(false);

    React.useEffect(() => {

        dispatch(actions.profileRequest());
        dispatch(actions.getCarsList());

    }, []);

    const inputRef = React.useRef();

    const yOffset = React.useRef(new Animated.Value(0)).current;
    const heightAnimation = React.useRef(new Animated.Value(0)).current;
    const marginAnimation = React.useRef(new Animated.Value(0)).current;
    const opacitySearchAnimation = React.useRef(new Animated.Value(0)).current;

    const AnimetedExpandBtn = Animated.createAnimatedComponent(TouchableOpacity);

    const blackToWhiteAnimation = yOffset.interpolate({
        inputRange: [0, 280],
        outputRange: ['#000000', '#ffffff'],
    });

	const whiteToBlackAnimation = yOffset.interpolate({
        inputRange: [0, 280],
        outputRange: ['#ffffff', '#000000'],
    });

    const opacityAnimation = yOffset.interpolate({
        inputRange: [0, 280],
        outputRange: [0.5, 1],
    });

    const showUp = () => {

        Animated.timing(heightAnimation, {
            toValue: 35,
            duration: 300,
            useNativeDriver: false,
        }).start();

        Animated.timing(marginAnimation, {
            toValue: 8,
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

    React.useEffect(() => {

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

    const handleOnPressCar = (carId, status) => {

        if (status === CREATED) {

            if (isHostFinishedRegistration) {

                api.navigation.navigate('HostRegistration', { 
                    isSecondCar: true, 
                    isCreatedCarExist: true,
                    onPressBack: () => api.navigation.navigate('MyCars')
                });

            } else {
                api.navigation.deepNavigate('ProfileRoot', 'HostRegistration');
            }

        } else {
            api.navigation.navigate('CarEdit', { carId });
        }
    };
    
    return (
        <View style={s.safeAreaView}>
            {
                !withGoHomeButton
                &&
                    <AnimetedExpandBtn
                        style={{
                            position: 'absolute',
                            backgroundColor: whiteToBlackAnimation,
                            top: 58,
                            left: 12,
                            zIndex: 1400,
                            width: 40,
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 100,
                        }}
                        onPress={() => !!onPressBack ? onPressBack() : api.navigation.deepNavigate('Cars', 'RentOutHasACar')}
                    >
                        <Animated.Text style={{
                            color: blackToWhiteAnimation,
                            fontSize: 37,
                            top: Platform.OS === 'ios' ? -4 : -9,
                            opacity: opacityAnimation,
                        }}>
                            ‹
                        </Animated.Text>
                    </AnimetedExpandBtn>
            }
            <ScrollView 
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={(event) => yOffset.setValue(event.nativeEvent.contentOffset.y)}
            >
                <View style={s.content}>
                    <View style={[s.row, s.header]}>
                        <TouchableOpacity
                            onPress={() => setIsSearchVisble(!isSearchVisble)}
                        >
                            <SearchIcon style={s.search.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={s.row}
                            onPress={() => {

                                if (isHostFinishedRegistration) {

                                    const isCreatedCarExist = !!carsList.find((car) => car.status === 'CREATED');
                                    
                                    api.navigation.navigate('HostRegistration', { 
                                        isSecondCar: true, 
                                        isCreatedCarExist: isCreatedCarExist,
                                        onPressBack: () => api.navigation.navigate('MyCars') 
                                    });

                                } else {
                                    api.navigation.deepNavigate('ProfileRoot', 'HostRegistration');
                                }
                            }}
                        >
                            <AddCarIcon style={s.chatBtnIcon} />
                            <Text style={s.chatBtnText}>
                                Добавить
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Animated.View style={{
                        height: heightAnimation ,
                        marginVertical: marginAnimation,
                        opacity: opacitySearchAnimation,
                    }}>
                        <TextInput 
                            ref={inputRef}
                            value={input}
                            placeholder='Марка, модель или госномер'
                            placeholderTextColor="#878F9B" 
                            style={[
                                s.search.input,
                                {
                                    height: 35,
                                }
                            ]}
                            onChangeText={(text) => setInput(text.toLowerCase())}
                        />
                    </Animated.View>
                    <Text style={s.title}>
                        Мои объявления
                    </Text>
                    {
                        !!carsList && !carsList.error && carsList.length !== 0 && carsList
                        .filter((car) => (
                            car.brand.toLowerCase().includes(input) || 
                            car.model.toLowerCase().includes(input) ||
                            car.registrationNumber.toLowerCase().includes(input)
                        ))
                        .map((car) => (
                            <TouchableScale
                                key={car.uuid}
                                style={[
                                    s.infoPanel.main,
                                    (car.rating || car.rentPricePerDay) && { height: 293 }
                                ]}
                                onPress={() => handleOnPressCar(car.uuid, car.status)}
                            >
                                <View style={[
                                    s.carStatusBarBackground,
                                    (car.status === NOT_VERIFIED || car.status === STASHED || car.status === CREATED ) && { backgroundColor: '#FF2E00' },
                                    (car.status === PUBLISHED || car.status === RENT) && { backgroundColor: theme.colors.mint },
                                    car.status === VERIFICATION && { backgroundColor: theme.colors.white, paddingHorizontal: 13 },
                                    (car.status === BANNED || car.status === INVALID) && { backgroundColor: '#FF2E00' },
                                ]}>
                                    <View style={[s.row, { opacity: 0 }]}>
                                        <View style={s.carStatusBar.icon}>
                                        {
                                            (car.status === NOT_VERIFIED || car.status === STASHED || car.status === CREATED )
                                            && 
                                                <SettingsIcon
                                                    width={10}
                                                    height={10}
                                                />
                                        }
                                        {
                                            (car.status === PUBLISHED || car.status === RENT)
                                            && 
                                                <SuccessIcon
                                                    width={10}
                                                    height={10}
                                                />
                                        }
                                        {
                                            (car.status === BANNED || car.status === INVALID)
                                            && 
                                                <WaitIcon
                                                    width={10}
                                                    height={10}
                                                />
                                        }
                                        </View>
                                        <Text style={[
                                            s.carStatusBar.text,
                                            car.status === VERIFICATION && { color: theme.colors.black }
                                        ]}>
                                            {(car.status === NOT_VERIFIED || car.status === STASHED || car.status === CREATED ) && 'Настроить'}
                                            {(car.status === PUBLISHED || car.status === RENT) && 'На поиске'}
                                            {car.status === VERIFICATION && 'На проверке'}
                                            {(car.status === BANNED || car.status === INVALID) && 'Заблокирована'}
                                        </Text>
                                    </View>
                                </View>
                                <View style={[s.carStatusBar, s.row]}>
                                    <View style={s.carStatusBar.icon}>
                                        {
                                            (car.status === NOT_VERIFIED || car.status === STASHED || car.status === CREATED ) 
                                            && 
                                                <SettingsIcon
                                                    width={10}
                                                    height={10}
                                                />
                                        }
                                        {
                                            (car.status === PUBLISHED || car.status === RENT) 
                                            && 
                                                <SuccessIcon
                                                    width={10}
                                                    height={10}
                                                />
                                        }
                                        {
                                            car.status === VERIFICATION 
                                            && 
                                                <WaitIcon
                                                    width={10}
                                                    height={10}
                                                />
                                        }
                                        {
                                            (car.status === BANNED || car.status === INVALID)
                                            &&
                                                <LockIcon
                                                    width={10}
                                                    height={10}
                                                />
                                        }
                                    </View>
                                    <Text style={[
                                        s.carStatusBar.text,
                                        car.status === VERIFICATION && { color: theme.colors.black }
                                    ]}>
                                        {(car.status === NOT_VERIFIED || car.status === STASHED || car.status === CREATED ) && 'Настроить'}
                                        {(car.status === PUBLISHED || car.status === RENT) && 'На поиске'}
                                        {car.status === VERIFICATION && 'На проверке'}
                                        {(car.status === BANNED || car.status === INVALID) && 'Заблокирована'}
                                    </Text>
                                </View>
                                <Image 
                                    height={217}
                                    style={s.infoPanel.image}
                                    source={car.photoUrl ? { uri: car.photoUrl } : NoCarImage}
                                />
                                <View style={[s.row, s.spaceBetween, s.infoPanel_content]}>
                                    <View style={[
                                        (!car.rating && !car.rentPricePerDay) && s.row,
                                        { maxWidth: '70%' }
                                    ]}>
                                        <View style={s.row}>
                                            <Text 
                                                numberOfLines={1}
                                                style={s.infoPanel.infoText}
                                            >
                                                {car.brand} {car.model}
                                            </Text>
                                            {
                                                !!car.rating
                                                &&
                                                    <View style={[
                                                        s.rating,
                                                        { 
                                                            position: 'relative',
                                                            top: 'auto',
                                                            right: 'auto', 
                                                        }
                                                    ]}>
                                                        <Text style={s.ratingNumber}>
                                                            {car.rating || '5.0'}
                                                        </Text>
                                                        <StarIcon width={10} height={9} />
                                                    </View>
                                            }
                                        </View>
                                        <Text style={s.infoPanel.helpText}>
                                            {car.registrationNumber}
                                        </Text>
                                    </View>
                                    {
                                        !!car.rentPricePerDay
                                        &&
                                            <View style={s.row}>
                                                <Text style={s.infoPanel.price}>
                                                    {formatPrice(car.rentPricePerDay)}/сут
                                                </Text>
                                            </View>
                                    }
                                </View>
                            </TouchableScale>
                        ))
                    }
                    {/* <TouchableOpacity style={[s.row, s.deletedCarsBtn]}>
                        <EyeOpenedIcon 
                            style={s.deletedCarsBtn.icon}
                        />
                        <Text style={s.deletedCarsBtn.text}>
                            Удаленные машины
                        </Text>
                    </TouchableOpacity> */}
                </View>
            </ScrollView>
            {
                withGoHomeButton
                &&
                    <PrimaryButton 
                        title='На главную'
                        style={s.goHomeBtn}
                        onPress={() => api.navigation.deepNavigate('Cars', 'RentOutHasACar')}
                    />
            }
        </View>
    )
};

export default MyCars;
