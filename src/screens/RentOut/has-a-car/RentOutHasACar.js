import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    View, 
    Text, 
    Image, 
    Platform,
    ScrollView, 
    SafeAreaView,
    RefreshControl,
    TouchableOpacity, 
    TouchableWithoutFeedback, 
} from 'react-native';

import api from 'api';
import actions from 'actions';
import { carStatuses } from 'constants';
import { Avatar, TouchableScale, WriteToSupportBtn, Waiter } from 'components';
import { BlockPanels, ArticleHorizontalItem, chunkArray } from '../no-car/RentOutNoCar';

import StarIcon from 'img/rent-out/no-car/star.svg';
import ArrowIcon from 'img/rent-out/no-car/arrow.svg';
import LockIcon from 'img/rent-out/has-a-car/lock-icon.svg';
import WaitIcon from 'img/rent-out/has-a-car/wait-icon.svg';
import IncomeIcon from 'img/rent-out/has-a-car/income-icon.svg';
import AddCarIcon from 'img/rent-out/has-a-car/add-car-icon.svg';
import NoCarImage from 'img/rent-out/has-a-car/no-car-image.png';
import SuccessIcon from 'img/rent-out/has-a-car/success-icon.svg';
import SuperHostIcon from 'img/rent-out/no-car/superhost-icon.svg';
import SettingsIcon from 'img/rent-out/has-a-car/settings-icon.svg';
import RentsDaysIcon from 'img/rent-out/has-a-car/rents-days-icon.svg';
import CalendarBanner from 'img/rent-out/has-a-car/calendar-banner.png';
import SuperHostBanner from 'img/rent-out/has-a-car/superhost-banner.png';
import AcceptedRentsIcon from 'img/rent-out/has-a-car/accepted-rents-icon.svg';
import CompletedRentsIcon from 'img/rent-out/has-a-car/completed-rents-icon.svg';

import EarnFirstBanner from 'img/rent-out/no-car/earn1.png';
import EarnSecondBanner from 'img/rent-out/no-car/earn2.png';
import EarnThirdBanner from 'img/rent-out/no-car/earn3.png';
import EarnFourthBanner from 'img/rent-out/no-car/earn4.png';
import EarnFifthBanner from 'img/rent-out/no-car/earn5.png';

import s from './styles';
import theme from 'theme';
import { isHostFinishedRegistrationSelector } from '../../../store/profile/selectors';
import compare from '../../../libs/compare';

const {
	statuses: { 
        NOT_VERIFIED,
        INVALID,
        BANNED,
        VERIFICATION,
        PUBLISHED, 
        RENT,
        CREATED,
        STASHED
    },
} = carStatuses;

const InfoPanel = ({ grey, content }) => {

    return (

        <TouchableScale 
            style={[s.infoPanel, grey && s.infoPanel_grey]}
            onPress={() => {}}
        >
            <content.icon 
                width={16}
                height={16}
                style={s.infoPanel_icon}
            />
            <View>
                <Text style={s.infoPanel_infoText}>
                    {content.infoText}
                </Text>
                <Text style={s.infoPanel_helpText}>
                    {content.helpText}
                </Text>
            </View>
        </TouchableScale>
    )
};

export const RentOutHasACar = ({ openRegCompleteModal }) => {

    const dispatch = useDispatch();

    openRegCompleteModal && alert('jopa')

    const isHostFinishedRegistration = useSelector(isHostFinishedRegistrationSelector, compare.values)

    const { trademark, firstName, lastName, avatar, labels, rating, carsList } = useSelector(st => st.profile);

    const [hostMyCarArticles, setHostMyCarArticles] = useState({
        beginning: [],
        earn: [],
        insurance: [],
        hostRules: [],
        guestRules: [],
        legal: [],
    });

    const [hostMyCarSections, setHostMyCarSections] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    // https://docs.google.com/document/d/1BydrN_N2OhCy6DVVaGhuJzZu8GdaeoWEbjWTZidO5b0/edit

    const getData = async () => {

        setIsLoading(true);

        try {

            api.web.getHostMyCarSections().then(( res) => !res.error && setHostMyCarSections(res?.data));
    
            const beginning = await api.web.getHostMyCarArticles(1);
            const earn = await api.web.getHostMyCarArticles(5);
            const insurance = await api.web.getHostMyCarArticles(2);
            const hostRules = await api.web.getHostMyCarArticles(7);
            const guestRules = await api.web.getHostMyCarArticles(6);
            const legal = await api.web.getHostMyCarArticles(4);
    
            setHostMyCarArticles({
                beginning: !!beginning?.error ? [] : beginning?.data,
                earn: !!earn?.error ? [] : earn?.data,
                insurance: !!insurance?.error ? [] : insurance?.data,
                hostRules: !!hostRules?.error ? [] : hostRules?.data,
                guestRules: !!guestRules?.error ? [] : guestRules?.data,
                legal: !!legal?.error ? [] : legal?.data,
            });

        } finally {
            setIsLoading(false);
        };
    };
    
    useEffect(() => {
        getData();
    }, []);   

    const sections = chunkArray(hostMyCarSections?.sort?.((a, b) => b.sortIndex - a.sortIndex), 5);

    const isArticlesLoaded = !(
        hostMyCarArticles?.beginning?.length === 0 &&
        hostMyCarArticles?.earn?.length === 0 &&
        hostMyCarArticles?.insurance?.length === 0 &&
        hostMyCarArticles?.rules?.length === 0 &&
        hostMyCarArticles?.hostRules?.length === 0 &&
        hostMyCarArticles?.guestRules?.length === 0 &&
        hostMyCarArticles?.legal?.length === 0
    );

    const handleOnPressCar = (carId, status) => {

        if (status === CREATED) {

            if (isHostFinishedRegistration) {

                api.navigation.navigate('HostRegistration', { 
                    isSecondCar: true, 
                    isCreatedCarExist: true,
                    onPressBack: () => api.navigation.deepNavigate('Cars', 'RentOutHasACar'),  
                });

            } else {
                api.navigation.deepNavigate('ProfileRoot', 'HostRegistration');
            };

        } else {
            api.navigation.navigate('CarEdit', { carId });
        }
    };

    return (
        <SafeAreaView style={s.container}>
            <ScrollView 
                style={s.container}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={() => {
                            dispatch(actions.profileRequest());
                            dispatch(actions.getCarsList());
                        }}
                    />
                }
            >
                <View style={s.whiteBg}>
                    <View style={s.topPanel}>
                        <TouchableWithoutFeedback onPress={() => api.navigation.deepNavigate('ProfileRoot', 'Profile')}>
                            <View style={[s.row, s.mb16, s.spaceBetween]}>
                                <View style={s.row}>
                                    <Avatar
                                        diameter={48}
                                        avatar={avatar}
                                        style={s.mr16}
                                        name={`${firstName} ${lastName}`} 
                                    />
                                    {
                                        (firstName || trademark)
                                        &&
                                            <View>
                                                <View style={s.row}>
                                                    <Text style={s.welcomText}>
                                                        Привет, {firstName || trademark}!
                                                    </Text>
                                                    <View style={s.rating}>
                                                        <Text style={s.rating_number}>
                                                            {rating % 1 == 0 ? rating + '.0' : rating}
                                                        </Text>
                                                        <StarIcon 
                                                            width={10} 
                                                            height={9} 
                                                        />
                                                    </View>
                                                </View>
                                                {
                                                    labels.includes("SUPERHOST")
                                                    &&
                                                        <View style={s.row}>
                                                            <SuperHostIcon style={s.superHost_icon} />
                                                            <Text style={s.superHost_text}>
                                                                Суперхозяин
                                                            </Text>
                                                        </View>
                                                }
                                            </View>
                                    }
                                </View>
                                <ArrowIcon />
                            </View>
                        </TouchableWithoutFeedback>
                        {/* <ScrollView 
                            horizontal
                            contentContainerStyle={s.row}
                            showsHorizontalScrollIndicator={false}
                        >
                            {
                                [
                                    {
                                        id: 1,
                                        icon: CompletedRentsIcon,
                                        infoText: '123',
                                        helpText: 'Завершенных аренд'
                                    },
                                    {
                                        id: 2,
                                        icon: RentsDaysIcon,
                                        infoText: '987',
                                        helpText: 'Всего дней аренды'
                                    },
                                    {
                                        id: 3,
                                        icon: IncomeIcon,
                                        infoText: '1 500 560 ₽',
                                        helpText: 'Общий доход'
                                    },
                                    {
                                        id: 4,
                                        icon: AcceptedRentsIcon,
                                        infoText: '87%',
                                        helpText: 'Подтвержденных аренд'
                                    }
                                ].map((panel) => (
                                    <InfoPanel content={panel} />
                                ))
                            }
                        </ScrollView> */}
                    </View>
                    <View style={s.ph8}>
                        <View style={(Platform.OS === 'ios' || (Platform.OS === 'android' && Platform.constants['Release'] > 7)) && { transform: [{ scaleX: -1 }] }}>
                            <TouchableScale 
                                style={s.calendar}
                                onPress={() => api.navigation.navigate('AvailabilityCalendar')}
                            >
                                <View style={[
                                    s.calendar_content,
                                    Platform.OS === 'ios' && { transform: [{ scaleX: -1 }] }
                                ]}>
                                    <Text style={[
                                        s.calendar_title,
                                        Platform.constants['Release'] <= 7 && { position: 'absolute', right: 0 }
                                    ]}>
                                        Мой календарь Getarent 
                                    </Text>
                                    <Text style={[
                                        s.calendar_subtitle,
                                        Platform.constants['Release'] <= 7 && { position: 'absolute', right: 0, top: 25 }
                                    ]}>
                                        Учет свободных для аренды дат 
                                    </Text>
                                </View>
                                <Image 
                                    resizeMode='cover'
                                    source={CalendarBanner} 
                                    style={s.calendarBanner} 
                                />
                            </TouchableScale>
                        </View>
                        <View>
                            <TouchableOpacity
                                style={s.blockHeader_main}
                                onPress={() => api.navigation.navigate('MyCars')}
                            >
                                <Text style={s.blockHeader_text}>
                                    Мои объявления
                                </Text>
                                <View style={s.row}>
                                    <Text style={s.counter}>
                                        {carsList.length}
                                    </Text>
                                    <ArrowIcon />
                                </View>
                            </TouchableOpacity>
                            <ScrollView 
                                horizontal
                                contentContainerStyle={[s.row, s.horizontalScroll]}
                                showsHorizontalScrollIndicator={false}
                            >
                                {
                                    !!carsList && !carsList.error && carsList.length !== 0 && carsList.map((car) => (
                                        <TouchableScale 
                                            key={car.uuid}
                                            style={[s.infoPanel, s.infoPanel_grey, s.infoPanel_car]}
                                            onPress={() => handleOnPressCar(car.uuid, car.status)}
                                        >
                                            <View style={[
                                                s.carStatusBarBackground,
                                                (car.status === NOT_VERIFIED || car.status === STASHED || car.status === CREATED ) && { backgroundColor: '#FF2E00' },
                                                (car.status === PUBLISHED || car.status === RENT) && { backgroundColor: theme.colors.mint },
                                                car.status === VERIFICATION && { backgroundColor: theme.colors.white },
                                                (car.status === BANNED || car.status === INVALID) && { backgroundColor: '#FF2E00' },
                                            ]}>
                                                <View style={[s.row, { opacity: 0 }]}>
                                                    <View style={s.carStatusBar_icon}>
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
                                                        s.carStatusBar_text,
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
                                                <View style={s.carStatusBar_icon}>
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
                                                    s.carStatusBar_text,
                                                    car.status === VERIFICATION && { color: theme.colors.black }
                                                ]}>
                                                    {(car.status === NOT_VERIFIED || car.status === STASHED || car.status === CREATED ) && 'Настроить'}
                                                    {(car.status === PUBLISHED || car.status === RENT) && 'На поиске'}
                                                    {car.status === VERIFICATION && 'На проверке'}
                                                    {(car.status === BANNED || car.status === INVALID) && 'Заблокирована'}
                                                </Text>
                                            </View>
                                            <Image 
                                                width={144}
                                                height={121}
                                                style={s.infoPanel_image}
                                                source={car.photoUrl ? { uri: car.photoUrl } : NoCarImage}
                                            />
                                            <View style={{ left: 8, bottom: 8 }}>
                                                <Text numberOfLines={1} style={s.infoPanel_infoText}>
                                                    {car.brand} {car.model}
                                                </Text>
                                                <Text style={s.infoPanel_helpText}>
                                                    {car.registrationNumber}
                                                </Text>
                                            </View>
                                        </TouchableScale>
                                    ))
                                }
                            </ScrollView>
                        </View>
                        <TouchableScale 
                            style={[s.row, s.addCar]}
                            onPress={() => {

                                if (isHostFinishedRegistration) {

                                    const isCreatedCarExist = !!carsList.find((car) => car.status === 'CREATED');

                                    api.navigation.navigate('HostRegistration', { 
                                        isSecondCar: true, 
                                        isCreatedCarExist: isCreatedCarExist,
                                        onPressBack: () => api.navigation.deepNavigate('Cars', 'RentOutHasACar') 
                                    });

                                } else {
                                    api.navigation.deepNavigate('ProfileRoot', 'HostRegistration');
                                };
                            }}
                        >
                            <AddCarIcon style={s.addCar_icon} />
                            <Text style={s.addCar_text}>
                                Добавить объявление
                            </Text>
                        </TouchableScale>
                        {
                            isLoading
                            ?
                                <View style={{ height: 430 }}>
                                    <Waiter />
                                </View>
                            :
                                <View style={{ marginBottom: 10 }}>
                                    <TouchableOpacity
                                        style={s.blockHeader_main}
                                        onPress={() => api.navigation.navigate('RentOutSection', { tabValue: 'BEGINNING', articles: hostMyCarArticles, sections: hostMyCarSections })}
                                    >
                                        <Text style={s.blockHeader_text}>
                                            Хостинг Getarent
                                        </Text>
                                        <View style={s.row}>
                                            <ArrowIcon />
                                        </View>
                                    </TouchableOpacity>
                                    <View style={s.banners}>
                                        {
                                            sections.length !== 0 && sections.map((dividedSections, i) => (
                                                <View key={i}>
                                                    <BlockPanels 
                                                        articles={dividedSections}
                                                        allArticles={hostMyCarArticles}
                                                        hostMyCarSections={hostMyCarSections}
                                                        defaultBanners={[
                                                            EarnFirstBanner,
                                                            EarnSecondBanner,
                                                            EarnThirdBanner,
                                                            EarnFourthBanner,
                                                            EarnFifthBanner,
                                                        ]}
                                                    />
                                                </View>
                                            ))
                                        }
                                    </View>
                                </View>
                        }
                        {/* <TouchableScale 
                            style={s.mb32}
                            onPress={() => {}}
                        >
                            <Image 
                                resizeMode='contain'
                                source={SuperHostBanner} 
                                style={s.fullWidthBanner} 
                            />
                        </TouchableScale> */}
                        {/* <View style={s.block}>
                            <TouchableOpacity
                                style={s.block.header}
                                onPress={() => {}}
                            >
                                <Text style={s.block.header.text}>
                                    Аналитика дохода в ноябре
                                </Text>
                                <ArrowIcon />
                            </TouchableOpacity>
                            <ScrollView 
                                horizontal
                                contentContainerStyle={[s.row, s.horizontalScroll]}
                                showsHorizontalScrollIndicator={false}
                            >
                                {
                                    [
                                        {
                                            id: 1,
                                            icon: IncomeIcon,
                                            infoText: '1 500 560 ₽',
                                            helpText: 'Доход'
                                        },
                                        {
                                            id: 2,
                                            icon: AcceptedRentsIcon,
                                            infoText: '5 ↗',
                                            helpText: 'Аренд'
                                        },
                                        {
                                            id: 3,
                                            icon: CompletedRentsIcon,
                                            infoText: '1 ↘',
                                            helpText: 'Аренд отменено'
                                        },
                                        {
                                            id: 4,
                                            icon: RentsDaysIcon,
                                            infoText: '3,234 дня',
                                            helpText: 'Аренда в среднем'
                                        }
                                    ].map((panel) => (
                                        <InfoPanel grey content={panel} />
                                    ))
                                }
                            </ScrollView>
                        </View> */}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
};
