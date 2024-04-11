import { 
    View, 
    Text, 
    Image,
    Alert,
    Animated,
    Platform,
    Dimensions,
    ScrollView, 
    SafeAreaView, 
    ImageBackground,
    TouchableOpacity,
} from 'react-native';
import Video from 'react-native-video';
import { Modalize } from 'react-native-modalize';
import DeviceInfo from 'react-native-device-info';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import { 
    Avatar, 
    Waiter, 
    PrimaryButton, 
    TouchableScale, 
    WriteToSupportBtn, 
} from 'components';
import api from 'api';
import actions from 'actions';
import { ROLE } from 'constants/roles';

import StarIcon from 'img/rent-out/no-car/star.svg';
import ArrowIcon from 'img/rent-out/no-car/arrow.svg';
import PlayBtnIcon from 'img/rent-out/no-car/play-btn.svg';
import RentsIcon from 'img/rent-out/no-car/rents-icon.svg';
import FirstAvatar from 'img/rent-out/no-car/first-avatar.svg';
import BannerImage from 'img/rent-out/no-car/no-car-banner.png';
import SecondAvatar from 'img/rent-out/no-car/second-avatar.svg';
import RentDaysIcon from 'img/rent-out/no-car/rent-days-icon.svg';
import SuperHostIcon from 'img/rent-out/no-car/superhost-icon.svg';
import ActiveUsersIcon from 'img/rent-out/no-car/active-users-icon.svg';
import AcceptSystemIcon from 'img/rent-out/no-car/accept-system-icon.svg';
import GetarentYellowIcon from 'img/rent-out/no-car/getarent-yellow-icon.svg';

import BeginningFirstBanner from 'img/rent-out/no-car/beginning-first-banner.png';
import BeginningSecondBanner from 'img/rent-out/no-car/beginning-second-banner.png';
import BeginningThirdBanner from 'img/rent-out/no-car/beginning-third-banner.png';
import BeginningFourthBanner from 'img/rent-out/no-car/beginning-fourth-banner.png';

import EarnFirstBanner from 'img/rent-out/no-car/earn1.png';
import EarnSecondBanner from 'img/rent-out/no-car/earn2.png';
import EarnThirdBanner from 'img/rent-out/no-car/earn3.png';
import EarnFourthBanner from 'img/rent-out/no-car/earn4.png';
import EarnFifthBanner from 'img/rent-out/no-car/earn5.png';

import s from './styles';
import theme from 'theme';

const WIDTH = Dimensions.get('window').width;

export const chunkArray = (array, chunkSize) => {

    const result = [];
    
    for (let i = 0; i < array?.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    };

    return result;
};

const compareSeactionIdWithBanner = (id) => {

    switch (id) {
        case 1: return EarnFirstBanner
        case 5: return EarnSecondBanner
        case 2: return EarnThirdBanner
        case 4: return EarnFourthBanner
        case 8: return EarnFifthBanner
    }
};

const compareSeactionIdWithName = (id) => {

    switch (id) {
        case 1: return 'BEGINNING'
        case 5: return 'EARN'
        case 2: return 'INSURANCE'
        case 4: return 'LEGAL'
        case 8: return 'RULES'
        case 7: return 'HOST_RULES'
        case 6: return 'GUEST_RULES'
    }
};

export const BlockPanels = ({ articles, i, hostMyCarSections, allArticles }) => {

    return (
        articles[0] 
        && 
            <View style={hostMyCarSections.length > 5 && i !== 0 && { top: -32 }}>
                <View style={[s.row, { marginBottom: 8, width: '100%' }]}>
                    <TouchableScale 
                        style={{ width: '45%', height: 140, marginRight: 8, overflow: 'hidden' }}
                        onPress={() => api.navigation.navigate(
                            'RentOutSection', 
                            { 
                                tabValue: compareSeactionIdWithName(articles[0].id), 
                                articles: allArticles,
                                sections: hostMyCarSections,
                            }
                        )}
                    >
                        <>
                            <Image
                                resizeMode="cover"
                                source={
                                    articles[0].imageUrl
                                    ? 
                                        { uri: articles[0].imageUrl } 
                                    : 
                                        compareSeactionIdWithBanner(articles[0].id) 
                                }
                                height={140}
                                style={[s.bannerImage, { maxHeight: 140 }]}
                            />
                            <View style={[
                                s.bannerInfo,
                                { height: 140, width: '100%' }
                            ]}>
                                <Text style={s.bannerInfoTitle}>
                                    {articles[0].sectionName}
                                </Text>
                            </View>
                            {/* <LinearGradient 
                                style={[
                                    { 
                                        height: 140, 
                                        width: '100%', 
                                        position: 'absolute', 
                                        borderRadius: 20,
                                    },
                                ]} 
                                colors={['transparent', 'rgba(0, 0, 0, 0.50)']}
                            /> */}
                        </>
                    </TouchableScale>
                    {
                        articles[1]
                        &&
                            <TouchableScale 
                                style={{ borderRadius: 20, height: 100, width: '53%', overflow: 'hidden' }}
                                onPress={() => api.navigation.navigate(
                                    'RentOutSection', 
                                    { tabValue: compareSeactionIdWithName(articles[1].id), articles: allArticles, sections: hostMyCarSections, }
                                )}
                            >
                                <Image
                                    resizeMode="cover"
                                    source={
                                        articles[1].imageUrl
                                        ? 
                                            { uri: articles[1].imageUrl } 
                                        : 
                                            compareSeactionIdWithBanner(articles[1].id) 
                                    }
                                    height={100}
                                    style={[s.bannerImage, { maxHeight: 100 }]}
                                />
                                <View style={[
                                    s.bannerInfo,
                                    { height: 100, width: '100%' }
                                ]}>
                                    <Text style={s.bannerInfoTitle}>
                                        {articles[1].sectionName}
                                    </Text>
                                </View>
                                {/* <LinearGradient 
                                    style={[
                                        { 
                                            height: 100, 
                                            width: '100%', 
                                            position: 'absolute', 
                                            borderRadius: 20,
                                        },
                                    ]} 
                                    colors={['transparent', 'rgba(0, 0, 0, 0.50)']}
                                /> */}
                            </TouchableScale>
                    }
                </View>
                {
                    articles[2]
                    &&
                        <View style={[s.row, { marginBottom: 8, width: '100%' }]}>
                            <TouchableScale 
                                style={{ width: '45%', height: 100, borderRadius: 20, marginRight: 8, overflow: 'hidden' }}
                                onPress={() => api.navigation.navigate(
                                    'RentOutSection', 
                                    { tabValue: compareSeactionIdWithName(articles[2].id), articles: allArticles, sections: hostMyCarSections }
                                )}
                            >
                                <Image
                                    resizeMode="cover"
                                    source={
                                        articles[2].imageUrl
                                        ? 
                                            { uri: articles[2].imageUrl } 
                                        : 
                                            compareSeactionIdWithBanner(articles[2].id) 
                                    }
                                    height={100}
                                    style={[s.bannerImage, { maxHeight: 100 }]}
                                />
                                <View style={[
                                    s.bannerInfo,
                                    { height: 100, width: '100%' }
                                ]}>
                                    <Text style={s.bannerInfoTitle}>
                                        {articles[2].sectionName}
                                    </Text>
                                </View>
                                {/* <LinearGradient 
                                    style={[
                                        { 
                                            height: 100, 
                                            width: '100%', 
                                            position: 'absolute', 
                                            borderRadius: 20,
                                        },
                                    ]} 
                                    colors={['transparent', 'rgba(0, 0, 0, 0.50)']}
                                /> */}
                            </TouchableScale>
                            {
                                articles[3]
                                &&
                                    <TouchableScale 
                                        style={{ height: 140, width: '53%', top: -40, borderRadius: 20, overflow: 'hidden' }}
                                        onPress={() => api.navigation.navigate(
                                            'RentOutSection', 
                                            { tabValue: compareSeactionIdWithName(articles[3].id), articles: allArticles, sections: hostMyCarSections }
                                        )}
                                    >
                                        <Image
                                            resizeMode="cover"
                                            source={
                                                articles[3].imageUrl
                                                ? 
                                                    { uri: articles[3].imageUrl } 
                                                : 
                                                    compareSeactionIdWithBanner(articles[3].id) 
                                            }
                                            height={140}
                                            style={[s.bannerImage, { maxHeight: 140 }]}
                                        />
                                        <View style={[
                                            s.bannerInfo,
                                            { height: 140, width: '100%' }
                                        ]}>
                                            <Text style={s.bannerInfoTitle}>
                                                {articles[3].sectionName}
                                            </Text>
                                        </View>
                                        {/* <LinearGradient 
                                            style={[
                                                { 
                                                    height: 140, 
                                                    width: '100%', 
                                                    position: 'absolute', 
                                                    borderRadius: 20,
                                                },
                                            ]} 
                                            colors={['transparent', 'rgba(0, 0, 0, 0.50)']}
                                        /> */}
                                    </TouchableScale>
                            }
                        </View>
                }
                {
                    articles[4]
                    &&
                        <TouchableScale 
                            style={{ width: '100%', top: -40, borderRadius: 20, overflow: 'hidden' }}
                            onPress={() => api.navigation.navigate(
                                'RentOutSection', 
                                { tabValue: compareSeactionIdWithName(articles[4].id), articles: allArticles, sections: hostMyCarSections }
                            )}
                        >
                            <Image
                                resizeMode="cover"
                                source={
                                    articles[4].imageUrl 
                                    ? 
                                        { uri: articles[4].imageUrl } 
                                    : 
                                        compareSeactionIdWithBanner(articles[4].id) 
                                }
                                height={100}
                                style={[s.bannerImage, { maxHeight: 100 }]}
                            />
                            <View style={[
                                s.bannerInfo,
                                { height: 100, width: '100%' }
                            ]}>
                                <Text style={s.bannerInfoTitle}>
                                    {articles[4].sectionName}
                                </Text>
                            </View>
                            {/* <LinearGradient 
                                style={[
                                    { 
                                        height: 100, 
                                        width: '100%', 
                                        position: 'absolute', 
                                        borderRadius: 20,
                                    },
                                ]} 
                                colors={['transparent', 'rgba(0, 0, 0, 0.50)']}
                            /> */}
                        </TouchableScale>
                }
            </View>
    )
};

const getDeclension = (number) => {

    // Ensure the number is a positive integer
    number = Math.abs(Math.floor(number));

    // Determine the declension based on the last digit of the number
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return 'поездок'; // 11-19 are exceptions
    }

    if (lastDigit === 1) {
        return 'поездка'; // Singular form for 1
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
        return 'поездки'; // Genitive singular for 2-4
    }

    return 'поездок'; // Genitive plural for the rest
};

const VideoPanel = ({
    name,
    rating,
    source,
    rentsQty,
    isSuperHost,
    isSuperGuest,
    fullPanelVideo,
}) => {

    const videoRef = React.useRef(null);

    const [volume, setVolume] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const [isVideoHasOpened, setIsVideoHasOpened] = useState(false);
    
    const [isAndroidFullScreenVideoVisible, setIsAndroidFullScreenVideoVisible] = useState(false);

    return (
        <>
            <View style={[
                s.panel,
                { marginRight: 8 },
                fullPanelVideo && { padding: 0 }
            ]}>
                <View style={[
                    s.roundVideoBtn,
                    fullPanelVideo && s.fullPanelVideo,
                ]}>
                    <Video 
                        repeat
                        ref={videoRef}
                        volume={volume}
                        source={source} 
                        paused={isPaused}
                        resizeMode='cover'
                        style={s.roundVideo}
                        ignoreSilentSwitch={'ignore'}
                        preventsDisplaySleepDuringVideoPlayback={false}
                        onProgress={(data) => {

                            if (data.playableDuration !== 0 && data.playableDuration < data.currentTime){
                                setIsLoading(true)
                            } else {
                                setIsLoading(false)
                            }
                            
                        }}
                        onFullscreenPlayerDidDismiss={() => {
                            setVolume(0)
                        }}
                    />
                    {
                        fullPanelVideo
                        &&
                            <LinearGradient 
                                style={s.videoPanelGradient} 
                                colors={['transparent', 'rgba(245, 245, 247, 0.80)']}
                            />
                    }
                </View>
                <View style={[
                    s.playBtn,
                    fullPanelVideo && { zIndex: 2000 }
                ]}>
                    {
                        isLoading
                        ?
                            <Waiter style={{ top: -35 }} />
                        :
                            <TouchableOpacity
                                style={s.playBtn}
                                onPress={() => {

                                    setIsVideoHasOpened(true);

                                    if (isAndroidFullScreenVideoVisible) {

                                        setVolume(0);
                                        setIsPaused(true);
                                        setIsAndroidFullScreenVideoVisible(false);

                                    } else {

                                        setVolume(1);
                                        setIsPaused(false);

                                        if (Platform.OS === 'ios') {
                                            videoRef.current.seek(0);
                                            videoRef.current.presentFullscreenPlayer();
                                        } else {
                                            !isVideoHasOpened && videoRef.current.seek(0); 
                                            setIsAndroidFullScreenVideoVisible(true);
                                        }
                                    }
                                }}
                            >
                                {
                                    !isAndroidFullScreenVideoVisible
                                    &&
                                        <PlayBtnIcon 
                                            width={30} 
                                            height={30}
                                        /> 
                                }
                            </TouchableOpacity>
                    }
                </View>
                <View style={s.rating}>
                    <Text style={s.ratingNumber}>
                        {rating}
                    </Text>
                    <StarIcon width={9} height={8} />
                </View>
                <View style={
                    fullPanelVideo && s.videoUserInfoAbsolute
                }>
                    <Text style={s.videoText}>
                        {name}
                    </Text>
                    {
                        (isSuperHost || isSuperGuest)
                        &&
                            <View style={s.videoSuperHost}>
                                <SuperHostIcon style={{ marginRight: 4 }} />
                                <Text style={[
                                    s.videoSuperhostText,
                                    fullPanelVideo && { color: theme.colors.black },
                                ]}>
                                    {isSuperHost ? 'Суперхозяин' : 'Суперводитель'}
                                </Text>
                            </View>
                    }
                    <Text style={s.videoText}>
                        {rentsQty} {getDeclension(rentsQty)}
                    </Text>
                </View>
            </View>
        </>
    )
};

const Review = ({
    name,
    date,
    text,
    stars,
    avatar,
    rating,
    rentsQty,
    lastName,
    guestName,
    firstName,
    onLayoutY,
    fullWidth,
    reviewerId,
    isSuperhost,
}) => {
    
    const convertDate = (createdAt) => {

        const date = new Date(createdAt);

        const monthNames = [
            'января', 'февраля', 'марта',
            'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября',
            'октября', 'ноября', 'декабря'
        ];

        const day = date.getDate();
        const monthIndex = date.getMonth();

        return `${day} ${monthNames[monthIndex]}`;
    };

    return (
        <View 
            style={[s.review, fullWidth && {
                backgroundColor: '#F5F5F7',
                marginBottom: 16,
                maxWidth: 'auto',
                width: '100%',
                height: 'auto',
            }]}
            onLayout={(e) => onLayoutY && onLayoutY(e.nativeEvent.layout.y, e.nativeEvent.layout.height)}
        >
            <TouchableOpacity 
                style={[
                    s.row,
                    { marginBottom: 24 }
                ]}
                onPress={() => (
                     api.navigation.navigate(
                        'PublicProfile',
                        { uuid: reviewerId },
                        true
                    )
                )}
            >
                <Avatar
                    diameter={56}
                    avatar={avatar}
                    style={{ marginRight: 8 }}
                    name={`${firstName} ${lastName}`} 
                />
                <View style={{ width: fullWidth ? '35%' : '70%' }}>
                    <View style={[s.row, { width: '100%', justifyContent: 'space-between' }]}>
                        <Text style={[
                            s.videoText,
                        ]}>
                            {name}
                        </Text>
                        <View style={[
                            s.rating,
                            { 
                                position: 'relative',
                                top: 'auto',
                                right: 'auto', 
                            }
                        ]}>
                            <Text style={s.ratingNumber}>
                                {rating}
                            </Text>
                            <StarIcon width={9} height={8} />
                        </View>
                    </View>
                    {
                        isSuperhost
                        &&
                            <View style={s.videoSuperHost}>
                                <SuperHostIcon style={{ marginRight: 4 }} />
                                <Text style={s.videoSuperhostText}>
                                    Суперхозяин
                                </Text>
                            </View>
                    }
                    <Text style={s.videoText}>
                        {rentsQty} дней в аренде
                    </Text>
                </View>
            </TouchableOpacity>
            <View style={{ justifyContent: 'space-between' }}>
                <View style={{ height: fullWidth ? 'auto' : 135 }}>
                    <View style={[
                        s.row,
                        { marginBottom: 8 }
                    ]}>
                        {
                            [ 1, 2, 3, 4, 5 ].slice(stars).map((item, i) => (
                                <StarIcon width={17} height={16} style={s.reviewStar} key={i} />
                            ))
                        }
                    </View>
                    <Text numberOfLines={fullWidth ? undefined : 5} style={[
                        s.reviewText
                    ]}>
                        {text}
                    </Text>
                </View>
                <View style={[
                    s.row,
                    { marginTop: fullWidth ? 24 : 0 }
                ]}>
                    <Text style={[
                        s.reviewText,
                        { marginRight: 8 }
                    ]}>
                        {guestName}
                    </Text>
                    <Text style={s.reviewText}>
                        {convertDate(date)}
                    </Text>
                </View>
            </View>
        </View>
    )
};

const ReviewsModalContent = ({ reviewsModalizeRef, reviews, authorized, selectedReviewRef, onClose }) => {

    const scrollViewRef = React.useRef(1);

    const [positions, setPositions] = useState([]);

    const scrollToReviewId = selectedReviewRef.current;

    useEffect(() => {

        if (!!scrollToReviewId && positions.length !== 0) {
    
            const y = positions.find((position) => position.id === scrollToReviewId)?.y;

            scrollViewRef.current?.scrollTo({
                animated: true,
                y: y - 200,
            });
        } 

    }, [scrollToReviewId, positions]);
    
    return (
        <Modalize
            ref={reviewsModalizeRef}
            adjustToContentHeight
            disableScrollIfPossible={false}
            contentRef={scrollViewRef}
            modalStyle={{ marginTop: DeviceInfo.hasNotch() ? 60 : 30 }}
            onClose={() => {
                setPositions([]);
                onClose();
            }}
        >
            <View style={s.reviewsModal}>
                <View style={s.reviewsModalHeader}>
                    <Text style={s.header}>
                        Познакомьтесь с хостами
                    </Text>
                    <TouchableOpacity 
                        style={s.reviewsModalCloseBtn}
                        onPress={() => {
                            reviewsModalizeRef.current?.close()
                        }}
                    >
                        <Text style={s.reviewsModalCloseBtnText}>
                            Закрыть
                        </Text>
                    </TouchableOpacity>
                </View>
                {
                    !!reviews && !reviews.error && reviews?.filter((review) => review.rating >= 4).map((review, index) => (
                        <View key={review.reviewId}>
                            {
                                index < 10 && <Review 
                                    fullWidth
                                    rating={review.host.rating}
                                    rentsQty={review.host.rentDaysCount}
                                    isSuperhost={review.host.labels.includes("SUPERHOST")}
                                    stars={review.rating}
                                    text={review.comment}
                                    guestName={`${review.guest.firstName} ${/\S/.test(review.guest.lastName) ? (review.guest.lastName[0] + '.') : ''}`}
                                    authorized={authorized}
                                    date={review.createdAt}
                                    reviewerId={review.host.uuid}
                                    avatar={review.host.avatar}
                                    lastName={review.host.lastName}
                                    firstName={review.host.firstName}
                                    name={`${review.host.firstName} ${/\S/.test(review.host.lastName) ? (review.host.lastName[0] + '.') : ''}`}
                                    onLayoutY={(y, height) => setPositions([
                                        ...positions,
                                        {
                                            id: review.reviewId,
                                            y,
                                            height
                                        }
                                    ])}
                                />
                            }
                        </View>
                    ))
                }
            </View>
        </Modalize>
    )
};

export const ArticlePanel = ({ tall, content }) => {

    const defaultBeginningBanners = [
        BeginningFirstBanner,
        BeginningSecondBanner,
        BeginningThirdBanner,
        BeginningFourthBanner,
        BeginningFirstBanner,
    ];

    const defaultEarnBanners = [
        EarnFirstBanner,
        EarnSecondBanner,
        EarnThirdBanner,
        EarnFourthBanner,
        EarnFifthBanner,
        EarnSixthBanner,
        EarnSeventhBanner,
    ];

    return (

        <TouchableScale 
            style={
                tall
                ?
                    [
                        s.makeMoreMoneyPanel
                    ]
                :
                    [
                        s.panel,
                        s.whereToStartPanel,
                    ]
            }
            onPress={() => api.navigation.navigate(
                'RentOutArticle', 
                { articleId: content.id }
            )}
        >
            {
                content.previewImage?.url
                ?
                    <Image 
                        style={tall ? s.tallImage : s.smallImage}
                        source={{ uri: content.previewImage.url }}
                    />
                :
                    <Image 
                        style={tall ? s.tallImage : s.smallImage}
                        source={
                            tall
                            ?
                                defaultEarnBanners[Math.floor(Math.random() * defaultEarnBanners.length)]
                            :
                                defaultBeginningBanners[Math.floor(Math.random() * defaultBeginningBanners.length)]
                        }
                    />
            }
            <Text style={tall ? s.makeMoreMoneyText : s.whereToStartText}>
                {content.title}
            </Text>
        </TouchableScale>
    )
};

export const ArticleHorizontalItem = ({ content, style, noDivider, onPress }) => {

    return (
        <>
            <TouchableOpacity
                style={[s.faqItem, style]}
                onPress={() => onPress ? onPress() : api.navigation.navigate(
                    'RentOutArticle', 
                    { articleId: content.id }
                )}
            >
                {
                    content.previewImage?.url
                    ?
                        <Image 
                            width={26}
                            height={26}
                            style={s.faqIcon}
                            source={{ uri: content.previewImage.url }}
                        />
                    :
                        <AcceptSystemIcon 
                            style={s.faqIcon} 
                        />
                }
                <Text style={s.faqText}>
                    {content.title}
                </Text>
            </TouchableOpacity>
            {
                !noDivider
                &&
                    <View style={s.divider} />
            }
        </>
    )
};

export const RentOutNoCar = ({ route: { params: { isGuest = false } = {} } }) => {

    const [hostMyCarInfo, setHostMyCarInfo] = useState({});
    const [hostMyCarVideos, setHostMyCarVideos] = useState([]);
    const [hostMyCarSections, setHostMyCarSections] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isArticlesLoading, setIsArticlesLoading] = useState(true);

    const [hostMyCarArticles, setHostMyCarArticles] = useState({
        beginning:  [],
        earn:       [],
        insurance:  [],
        rules:      [],
        hostRules:  [],
        guestRules: [],
        legal:      [],
    });
    
	const authorized = useSelector(st => st.profile.authorized);

    useEffect(() => {

        // https://docs.google.com/document/d/1BydrN_N2OhCy6DVVaGhuJzZu8GdaeoWEbjWTZidO5b0/edit

        const getData = async () => {

            api.web.getHostMyCarInfo().then((res) => !res?.error ? setHostMyCarInfo(res?.data) : setHostMyCarInfo(res.error));
            api.web.getHostMyCarVideos().then((res) => !res?.error && setHostMyCarVideos(res?.data));
            api.web.getHostMyCarSections().then((res) => !res.error && setHostMyCarSections(res?.data));
 
            try {

                setIsArticlesLoading(true);

                const beginning  = await api.web.getHostMyCarArticles(1);
                const earn       = await api.web.getHostMyCarArticles(5);
                const insurance  = await api.web.getHostMyCarArticles(2);
                const rules      = await api.web.getHostMyCarArticles(8);
                const hostRules  = await api.web.getHostMyCarArticles(7);
                const guestRules = await api.web.getHostMyCarArticles(6);
                const legal      = await api.web.getHostMyCarArticles(4);
    
                setHostMyCarArticles({
                    beginning:  !!beginning?.error  ? [] : beginning?.data,
                    earn:       !!earn?.error       ? [] : earn?.data,
                    insurance:  !!insurance?.error  ? [] : insurance?.data,
                    rules:      !!rules?.error      ? [] : rules?.data,
                    hostRules:  !!hostRules?.error  ? [] : hostRules?.data,
                    guestRules: !!guestRules?.error ? [] : guestRules?.data,
                    legal:      !!legal?.error      ? [] : legal?.data,
                });

            } finally {
                setIsArticlesLoading(false);
            }
        };

        getData();

    }, []);

    useEffect(() => {
        (hostMyCarInfo?.id || hostMyCarInfo?.status) && isLoading && setIsLoading(false);
    }, [hostMyCarInfo, isLoading]);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actions.getBestReviews());
    }, []);

    const reviewsModalizeRef = React.useRef(0);
    const selectedReviewRef = React.useRef();

	const { reviews } = useSelector(st => st.reviews);

    const yOffset = React.useRef(new Animated.Value(0)).current;
    
    const AnimetedImage = Animated.createAnimatedComponent(ImageBackground);
    const AnimetedShadow = Animated.createAnimatedComponent(LinearGradient);
    const AnimetedScrollView = Animated.createAnimatedComponent(ScrollView);
    
    const BANNER_HEIGHT = 430;
    const SCROLL_BOUND = Platform.OS === 'ios' ? BANNER_HEIGHT / 2.4 : BANNER_HEIGHT;

    const heightAnimation = yOffset.interpolate({
        inputRange: [0, SCROLL_BOUND],
        outputRange: [BANNER_HEIGHT, 116],
    });

    const shadowAnimation = yOffset.interpolate({
        inputRange: [0, SCROLL_BOUND],
        outputRange: ['0deg', '-90deg'],
    });

    const textOpacityAnimation = yOffset.interpolate({
        inputRange: [0, SCROLL_BOUND / 2],
        outputRange: [1, 0],
    });

    const paddingAnimation = yOffset.interpolate({
        inputRange: [0, SCROLL_BOUND],
        outputRange: [24, 16],
    });
    
    const titleTransformAnimation = yOffset.interpolate({
        inputRange: [0, SCROLL_BOUND],
        outputRange: [0, 58],
    });
    
    const titleSizeAnimation = yOffset.interpolate({
        inputRange: [0, SCROLL_BOUND],
        outputRange: [26, 16],
    });
    
    const titleLineHeightAnimation = yOffset.interpolate({
        inputRange: [0, SCROLL_BOUND],
        outputRange: [36, 18],
    });

    const textOneTransformAnimation = yOffset.interpolate({
        inputRange: [0, SCROLL_BOUND],
        outputRange: [0, 18],
    });

    const textTwoTransformAnimation = yOffset.interpolate({
        inputRange: [0, SCROLL_BOUND],
        outputRange: [0, 100],
    });

    const buttonAnimation = yOffset.interpolate({
        inputRange: [0, SCROLL_BOUND],
        outputRange: [80, 90],
    });

    const firstAvatarAnimation = yOffset.interpolate({
        inputRange: [0, 25],
        outputRange: [1, 0],
    });

    const firstAvatarMoveAnimation = yOffset.interpolate({
        inputRange: [0, 10],
        outputRange: [0, -10],
    });

    const countAnimation = yOffset.interpolate({
        inputRange: [0, SCROLL_BOUND / 4],
        outputRange: [1, 0],
    });

    const secondAvatarAnimation = yOffset.interpolate({
        inputRange: [0, SCROLL_BOUND / 2],
        outputRange: [1, 0],
    });

    const secondAvatarMoveAnimation = yOffset.interpolate({
        inputRange: [0, SCROLL_BOUND / 2],
        outputRange: [0, -40],
    });

    const activeUsersAnimation = yOffset.interpolate({
        inputRange: [0, SCROLL_BOUND / 1.5],
        outputRange: [1, 0],
    });

    const zIndexAnimation = yOffset.interpolate({
        inputRange: [0, SCROLL_BOUND],
        outputRange: [500, 1000],
    });

    const zIndexNegativeAnimation = yOffset.interpolate({
        inputRange: [0, SCROLL_BOUND],
        outputRange: [1000, 500],
    });

    const invisibleBtnAnimation = yOffset.interpolate({
        inputRange: [0, SCROLL_BOUND],
        outputRange: [0, 170],
    });
    
    const onPressRegistrate = (authorized, isGuest) => {
		
        if (authorized) {

            if (isGuest) {

                Alert.alert(
                    '',
                    'Похоже, вы авторизованы как водитель. Для регистрации машины потребуется создать новый аккаунт. \n\nПродолжить?',
                    [
                        {
                            text: 'Да',
                            onPress: () => {
                                
                                dispatch(actions.logout());

                                dispatch(actions.setInitialSelectedRole(ROLE.HOST));

                                api.navigation.deepNavigate(
                                    [ 'ProfileRoot', 'Auth', 'SignUp' ],
                                    { isHost: true }
                                )
                            }
                        },
                        { text: 'Отмена' }
                    ]
                );

            } else {
                api.navigation.deepNavigate('ProfileRoot', 'HostRegistration')
            };

        } else {
            dispatch(actions.setPotentialRole(ROLE.HOST))
            api.navigation.deepNavigate('ProfileRoot', 'Auth')
        }
    };

    const sections = chunkArray(hostMyCarSections?.sort?.((a, b) => b.sortIndex - a.sortIndex), 5);

    const [isLoadingTimedOut, setIsLoadingTimedOut] = useState(false);

    if (
        hostMyCarArticles.beginning?.length == 0 &&
        hostMyCarArticles.earn.length === 0 &&
        hostMyCarArticles.insurance.length === 0 &&
        hostMyCarArticles.rules.length === 0 &&
        hostMyCarArticles.hostRules.length === 0 &&
        hostMyCarArticles.guestRules.length === 0 &&
        hostMyCarArticles.legal.length === 0
    ) {

        setTimeout(() => {
            setIsLoadingTimedOut(true)
        }, 10000);

        return (
            !isLoadingTimedOut
            ?
                <Waiter />
            :
                <View style={s.noData}>
                    <Text style={s.noData.title}>
                        Хммм, кажется, вся полезная информация на этом экране куда-то пропала {':('}
                    </Text>
                    <Text style={s.noData.subtitle}>
                        Но вы все равно можете добавить свое авто на сервис! 
                    </Text>
                    <PrimaryButton 
                        style={s.bannerBtn}
                        titleStyle={[s.bannerBtnText, { transform: [{ scaleX: -1 }] }]}
                        title='Добавить авто'
                        onPress={() => onPressRegistrate(authorized, isGuest)}
                    />
                </View>
        )
    };

    return (
        <>
            <SafeAreaView style={s.container}>
            {
                    isLoading
                    ?
                        <Waiter />
                    :
                        <>
                            {
                                Platform.OS === 'ios' && hostMyCarInfo.topScrolledBanner?.imageUrl
                                && 
                                    <Animated.View style={[
                                        {
                                            flex: 1, 
                                            top: -50, 
                                            zIndex: zIndexAnimation,
                                            minHeight: heightAnimation, 
                                            maxHeight: heightAnimation,
                                            transform: [{ scaleX: -1 }],
                                            backgroundColor: 'white',
                                        },
                                    ]}>
                                        <View style={s.banner}>
                                            <AnimetedImage 
                                                resizeMode="cover"
                                                defaultSource={BannerImage}
                                                source={{ uri: hostMyCarInfo.topScrolledBanner.imageUrl }}
                                                imageStyle={{ borderRadius: 20 }}
                                                style={[
                                                    { 
                                                        minWidth: 412,
                                                        aspectRatio: 2.5,
                                                        minHeight: heightAnimation, 
                                                        maxHeight: heightAnimation,
                                                    },
                                                ]}
                                            />
                                            <Animated.View style={[
                                                s.bannerContent,
                                                { padding: paddingAnimation }
                                            ]}>
                                                <AnimetedShadow 
                                                    style={[
                                                        { 
                                                            height: 600, 
                                                            width: 600, 
                                                            right: -100, 
                                                            bottom: -100, 
                                                            position: 'absolute', 
                                                            transform: [{ rotate: shadowAnimation }]  
                                                        },
                                                    ]} 
                                                    colors={['transparent', 'rgba(0, 0, 0, 0.80)']}
                                                />
                                                <Animated.View style={[
                                                    s.bannerTitleBlock,
                                                    { transform: [{ translateY: titleTransformAnimation }] }
                                                ]}>
                                                    <Animated.Text style={[
                                                        s.bannerText,
                                                        {
                                                            fontSize: titleSizeAnimation,
                                                            lineHeight: titleLineHeightAnimation,
                                                            top: textOneTransformAnimation,
                                                        }
                                                    ]}>
                                                        Добавьте
                                                    </Animated.Text>
                                                    <Animated.Text style={[
                                                        s.bannerText,
                                                        {
                                                            fontSize: titleSizeAnimation,
                                                            lineHeight: titleLineHeightAnimation,
                                                            right: textTwoTransformAnimation,
                                                        }
                                                    ]}>
                                                        объявление
                                                    </Animated.Text>
                                                    <Animated.Text style={[
                                                        s.bannerText,
                                                        {
                                                            fontSize: titleSizeAnimation,
                                                            lineHeight: titleLineHeightAnimation,
                                                        }
                                                    ]}>
                                                        вашего автомобиля
                                                    </Animated.Text>
                                                </Animated.View>
                                                <Animated.View style={{ opacity: textOpacityAnimation }}>
                                                    <Text style={s.bannerSubText}>
                                                        Получайте заявки на аренду от проверенных водителей и зарабатывайте
                                                    </Text>
                                                </Animated.View>
                                                <Animated.View style={{ left: buttonAnimation }}>
                                                    <PrimaryButton 
                                                        style={s.bannerBtn}
                                                        titleStyle={s.bannerBtnText}
                                                        title={hostMyCarInfo.topScrolledBanner.buttonText}
                                                        onPress={() => onPressRegistrate(authorized, isGuest)}
                                                    />
                                                </Animated.View>
                                            </Animated.View>
                                        </View>
                                    </Animated.View>
                            }
                            <ScrollView
                                bounces={false}
                                style={[
                                    { flex: 1 },
                                    Platform.OS === 'ios' && {
                                        top: -(BANNER_HEIGHT - 40),
                                        paddingTop: BANNER_HEIGHT,
                                        marginBottom: -BANNER_HEIGHT + 40,
                                    }
                                ]}
                                scrollEventThrottle={16}
                                onScroll={(event) => {

                                    const y = event.nativeEvent.contentOffset.y;

                                    if (y <= SCROLL_BOUND) {
                                        yOffset.setValue(y);
                                    } else {
                                        yOffset.setValue(SCROLL_BOUND);    
                                    };
                                }}            
                            >
                                <View style={Platform.OS === 'ios' && { marginBottom: 400 }}>
                                    {
                                        Platform.OS === 'android' && hostMyCarInfo.topScrolledBanner?.imageUrl
                                        &&
                                            <View style={[
                                                s.banner,
                                                {
                                                    marginTop: 0,
                                                    marginBottom: 32,
                                                    position: 'relative',
                                                }
                                            ]}>
                                                <Image 
                                                    resizeMode="cover"
                                                    source={BannerImage}
                                                    imageStyle={{ borderRadius: 20 }}
                                                    style={[
                                                        { 
                                                            height: BANNER_HEIGHT,
                                                            minWidth: 412,
                                                            aspectRatio: 2.5,
                                                        },
                                                    ]}
                                                />
                                                <View style={[
                                                    s.bannerContent,
                                                    { 
                                                        padding: 24,
                                                        transform: [{ scaleX: -1 }],
                                                    }
                                                ]}>
                                                    <LinearGradient 
                                                        style={[
                                                            { 
                                                                height: 600, 
                                                                width: 600, 
                                                                right: -100, 
                                                                bottom: -100, 
                                                                position: 'absolute', 
                                                            },
                                                        ]} 
                                                        colors={['transparent', 'rgba(0, 0, 0, 0.80)']}
                                                    />
                                                    <View style={[
                                                        s.bannerTitleBlock,
                                                    ]}>
                                                        <Text style={[
                                                            s.bannerText,
                                                            {
                                                                fontSize: 26,
                                                                lineHeight: 36,
                                                            }
                                                        ]}>
                                                            Добавьте
                                                        </Text>
                                                        <Text style={[
                                                            s.bannerText,
                                                            {
                                                                fontSize: 26,
                                                                lineHeight: 36,
                                                            }
                                                        ]}>
                                                            объявление
                                                        </Text>
                                                        <Text style={[
                                                            s.bannerText,
                                                            {
                                                                fontSize: 26,
                                                                lineHeight: 36,
                                                            }
                                                        ]}>
                                                            вашего автомобиля
                                                        </Text>
                                                    </View>
                                                    <Text style={s.bannerSubText}>
                                                        Получайте заявки на аренду от проверенных водителей и зарабатывайте
                                                    </Text>
                                                    <View style={{ left: WIDTH > 400 ? 85 : 65 }}>
                                                        <PrimaryButton 
                                                            style={s.bannerBtn}
                                                            titleStyle={s.bannerBtnText}
                                                            title={hostMyCarInfo.topScrolledBanner.buttonText}
                                                            onPress={() => onPressRegistrate(authorized, isGuest)}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                    }
                                    {
                                        Platform.OS === 'ios' && hostMyCarInfo.topScrolledBanner?.imageUrl
                                        &&
                                            <Animated.View style={{
                                                transform: [{ translateY: invisibleBtnAnimation }]
                                            }}>
                                                <TouchableOpacity 
                                                    style={{
                                                        position: 'absolute',
                                                        top: -100,
                                                        left: 35,
                                                        width: 237,
                                                        height: 38,
                                                        borderRadius: 30,
                                                    }}
                                                    onPress={() => onPressRegistrate(authorized, isGuest)}
                                                />
                                            </Animated.View>
                                    }
                                    {
                                        !!hostMyCarInfo.interactiveUserCount && hostMyCarInfo.topScrolledBanner?.imageUrl
                                        &&
                                            <>
                                                <View style={s.row}>
                                                    <Animated.View style={Platform.OS === 'ios' && { 
                                                        opacity: firstAvatarAnimation,
                                                        left: firstAvatarMoveAnimation,
                                                    }}>
                                                        <TouchableScale 
                                                            activeScale={0.97}
                                                            tension={70}
                                                            friction={1}
                                                            style={s.firstAvatar}
                                                        >
                                                            <FirstAvatar />
                                                        </TouchableScale>
                                                    </Animated.View>
                                                    <Animated.View style={[
                                                        { 
                                                            width: '100%',
                                                            marginBottom: -7,
                                                        },
                                                        Platform.OS === 'ios' && {
                                                            opacity: countAnimation,
                                                        }
                                                    ]}>
                                                        <Text style={s.activeUsersCount}>
                                                            {hostMyCarInfo.interactiveUserCount.count}
                                                        </Text>
                                                        <Text style={s.activeUsersPlus}>
                                                            +
                                                        </Text>
                                                    </Animated.View>
                                                    <Animated.View style={Platform.OS === 'ios' && { 
                                                        opacity: secondAvatarAnimation,
                                                        right: secondAvatarMoveAnimation,
                                                    }}>
                                                        <TouchableScale 
                                                            activeScale={0.97}
                                                            tension={60}
                                                            friction={1}
                                                            style={s.secondAvatar}
                                                        >
                                                            <SecondAvatar />
                                                        </TouchableScale>
                                                    </Animated.View>
                                                </View>
                                                <Animated.View style={[
                                                    s.activeUsers,
                                                    Platform.OS === 'ios' && { opacity: activeUsersAnimation }
                                                ]}>
                                                    <ActiveUsersIcon style={s.activeUsersIcon} />
                                                    <Text style={s.activeUsersText}>
                                                        {hostMyCarInfo.interactiveUserCount.activeText}
                                                    </Text>
                                                </Animated.View>
                                            </>
                                    }
                                    {
                                        !hostMyCarInfo.topScrolledBanner?.imageUrl && !isGuest
                                        &&
                                            <View style={{ alignItems: 'center', marginBottom: 32 }}>
                                                <PrimaryButton 
                                                    style={s.bannerBtn}
                                                    titleStyle={[s.bannerBtnText, { transform: [{ scaleX: -1 }] }]}
                                                    title='Добавить авто'
                                                    onPress={() => onPressRegistrate(authorized, isGuest)}
                                                />
                                            </View>
                                    }
                                    <View style={{
                                        // paddingHorizontal: 8,
                                        marginBottom: 70
                                    }}>
                                        {
                                            hostMyCarVideos.length !== 0
                                            &&
                                                <View style={{ paddingHorizontal: 8 }}>
                                                    <Text style={s.header}>
                                                        Отзывы пользователей Getarent
                                                    </Text>
                                                    <ScrollView 
                                                        horizontal 
                                                        style={s.videos}
                                                        showsHorizontalScrollIndicator={false}
                                                    >
                                                        {
                                                            hostMyCarVideos.filter(video => !!video.user).map((video, i) => (
                                                                <View key={video.videoReview.url}>
                                                                    <VideoPanel
                                                                        rating={video.stars}
                                                                        rentsQty={video.user.total_rent_count}
                                                                        fullPanelVideo={!video.isCircleVideo}
                                                                        isSuperHost={video.user.labels.includes("SUPERHOST")}
                                                                        isSuperGuest={video.user.labels.includes("SUPERGUEST")}
                                                                        name={`${video.user.first_name} ${/\S/.test(video.user.last_name) ? (video.user.last_name[0] + '.') : ''}`}
                                                                        source={{ uri: video.videoReview.url }}
                                                                    />
                                                                </View>
                                                            ))
                                                        }
                                                    </ScrollView>
                                                </View>
                                        }
                                        {
                                            isArticlesLoading
                                            ?
                                                <View style={{ height: 350 }}>
                                                    <Waiter />
                                                </View>
                                            :
                                                <View style={{ paddingHorizontal: 8 }}>
                                                    {
                                                        !!hostMyCarInfo.serviceInfoAbout && sections.length !== 0
                                                        &&
                                                            <TouchableScale 
                                                                activeScale={0.99}
                                                                tension={40}
                                                                friction={1}
                                                                style={[s.panel, s.hosting]}
                                                                onPress={() => api.navigation.navigate('RentOutSection', { articles: hostMyCarArticles, sections: hostMyCarSections })}
                                                            >
                                                                <View 
                                                                    style={[
                                                                        s.headerWithArrow,
                                                                        { marginBottom: 16 }
                                                                    ]}
                                                                >
                                                                    <Text style={s.hostingHeaderText}>
                                                                        {hostMyCarInfo.serviceInfoAbout.title}
                                                                    </Text>
                                                                    <ArrowIcon />
                                                                </View>
                                                                <View style={[s.row, { marginBottom: 16 }]}>
                                                                    <Text style={s.hostingText}>
                                                                        {hostMyCarInfo.serviceInfoAbout.description}
                                                                    </Text>
                                                                    <View style={s.hostingWhitePanel}>
                                                                        <GetarentYellowIcon />
                                                                        <Text style={s.hostingWhitePanelPercent}>
                                                                            {hostMyCarInfo.serviceInfoAbout.serviceFeeNumber}
                                                                        </Text>
                                                                        <Text style={s.hostingWhitePanelText}>
                                                                            {hostMyCarInfo.serviceInfoAbout.serviceFeeText}
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                                <View style={[s.row, { justifyContent: 'space-between' }]}>
                                                                    <View>
                                                                        <View style={s.hostingBottomCount}>
                                                                            <RentDaysIcon style={s.hostingBottomCountIcon} />
                                                                            <Text style={s.hostingBottomCountNumber}>
                                                                                {hostMyCarInfo.serviceInfoAbout?.rentDaysNumber}
                                                                            </Text>
                                                                            <Text style={[
                                                                                s.hostingBottomCountNumber,
                                                                                {
                                                                                    top: -12,
                                                                                }
                                                                            ]}>
                                                                                +
                                                                            </Text>
                                                                        </View>
                                                                        <Text style={s.hostingBottomCountLabel}>
                                                                            {hostMyCarInfo.serviceInfoAbout?.rentDaysText}
                                                                        </Text>
                                                                    </View>
                                                                    <View>
                                                                        <View style={s.hostingBottomCount}>
                                                                            <RentsIcon style={s.hostingBottomCountIcon} />
                                                                            <Text style={s.hostingBottomCountNumber}>
                                                                                {hostMyCarInfo.serviceInfoAbout?.bookedNumber}
                                                                            </Text>
                                                                        </View>
                                                                        <Text style={s.hostingBottomCountLabel}>
                                                                            {hostMyCarInfo.serviceInfoAbout?.bookedText} 
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                            </TouchableScale>
                                                    }
                                                </View>
                                        }
                                        <View style={s.banners}>
                                            {
                                                isArticlesLoading
                                                ?
                                                    <View style={{ height: 590 }}>
                                                        <Waiter />
                                                    </View>
                                                :
                                                    sections.length !== 0 && sections.map((dividedSections, i) => (
                                                        <View key={dividedSections.sectionName}>
                                                            <BlockPanels
                                                                i={i}
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
                                        {
                                            !!reviews && reviews.length !== 0
                                            &&
                                                <View>
                                                    <View style={[
                                                        s.panel,
                                                        { 
                                                            paddingVertical: 16, 
                                                            marginHorizontal: 8,
                                                            marginBottom: 32,
                                                            height: 338,
                                                        }
                                                    ]}>
                                                        <TouchableOpacity 
                                                            style={[s.headerWithArrow, { paddingHorizontal: 18 }]}
                                                            onPress={() => reviewsModalizeRef.current?.open()}
                                                        >
                                                            <Text style={[s.header, { paddingLeft: -8 }]}>
                                                                Познакомьтесь с хостами
                                                            </Text>
                                                            <ArrowIcon style={{ top: -4 }} />
                                                        </TouchableOpacity>
                                                    </View>
                                                    <ScrollView 
                                                        horizontal
                                                        style={[s.row, { position: 'absolute', top: 55 }]}
                                                        showsHorizontalScrollIndicator={false} 
                                                    >
                                                        <View style={[s.row, { left: 15 }]}>
                                                            {
                                                                !!reviews && !reviews.error && reviews?.filter((review) => review.rating >= 4).map((review, index, array) => (
                                                                    <View key={review.reviewId}>
                                                                        {
                                                                            index < 10 
                                                                            && 
                                                                                <TouchableScale 
                                                                                    activeScale={0.99}
                                                                                    tension={70}
                                                                                    friction={1}
                                                                                    style={{ marginRight: (index === 9 || index === array.length - 1) ? 24 : 0 }}
                                                                                    onPress={() => {
                                                                                        selectedReviewRef.current = review.reviewId;
                                                                                        reviewsModalizeRef.current?.open();
                                                                                    }}
                                                                                >
                                                                                    <Review 
                                                                                        rating={review.host.rating}
                                                                                        rentsQty={review.host.rentDaysCount}
                                                                                        isSuperhost={review.host.labels.includes("SUPERHOST")}
                                                                                        stars={review.rating}
                                                                                        text={review.comment}
                                                                                        authorized={authorized}
                                                                                        guestName={`${review.guest.firstName} ${/\S/.test(review.guest.lastName) ? (review.guest.lastName[0] + '.') : ''}`}
                                                                                        date={review.createdAt}
                                                                                        reviewerId={review.host.uuid}
                                                                                        avatar={review.host.avatar}
                                                                                        lastName={review.host.lastName}
                                                                                        firstName={review.host.firstName}
                                                                                        name={`${review.host.firstName} ${/\S/.test(review.host.lastName) ? (review.host.lastName[0] + '.') : ''}`}
                                                                                    />
                                                                                </TouchableScale>
                                                                        }
                                                                    </View>
                                                                ))
                                                            }
                                                        </View>
                                                    </ScrollView>
                                                </View>
                                        }
                                        <View style={{ paddingHorizontal: 32 }}>
                                            <WriteToSupportBtn 
                                                text='Задать вопрос в чате' 
                                            />
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </>
                }
            </SafeAreaView>
            {
                isGuest
                &&
                    <PrimaryButton 
                        title='Назад'
                        style={s.goBackBtn}
                        onPress={() => api.navigation.goBack()}
                    />
            }
            <ReviewsModalContent 
                reviews={reviews} 
                authorized={authorized}
                reviewsModalizeRef={reviewsModalizeRef}
                selectedReviewRef={selectedReviewRef}
                onClose={() => {
                    selectedReviewRef.current = '';
                }}
            />
        </>
    )
};
