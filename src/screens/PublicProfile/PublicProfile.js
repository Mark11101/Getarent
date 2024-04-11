import { formatInTimeZone } from 'date-fns-tz';
import { useDispatch } from 'react-redux';
import { Modalize } from 'react-native-modalize';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

import {
	Icon,
	Header,
	Avatar,
	Waiter,
	Section,
	Separator,
	ButtonText,
	SafeAreaView,
	ProfileCarItem,
} from 'components';
import api from 'api';
import actions from '../../actions';
import Reviews from '../ForReview/Reviews';
import { formatRating } from 'functions';
import ReviewModal from '../ForReview/ReviewModal';
import SmallSuperHostIcon from 'img/profile/super-host-small.svg';

import s from './styles';
import theme from 'theme';

const HEIGHT = Dimensions.get('window').height;

const PublicProfile = ({ route: { params: { uuid } = {} } }) => {

	const dispatch = useDispatch();

    const [data, setData] = useState([]);
    const [waiter, setWaiter] = useState(false);
	const [modalReview, setModalReview] = useState({});

    const modalizeRef = useRef(null);

	const onOpenModalReview = () => {
		modalizeRef.current?.open();
	};

	const superGuestmodalizeRef = useRef(null);

	const onOpenSuperGuestModalReview = () => {
		superGuestmodalizeRef.current?.open();
	};

	useEffect(() => {
		Object.keys(modalReview).length !== 0 && onOpenModalReview();
	}, [modalReview]);

    const {
		avatar,
		firstName,
		reviewsQty,
		reviews,
		rating,
		labels,
		rentsQty,
		role,
		cars,
	} = data;

	const refreshing = useCallback(() => {

		setWaiter(true);

		const getData = async () => {

			try {
				const res = await api.web.profile(uuid);
				if (res?.error) {
					throw res.error;
				}

				setData(res);

			} catch (err) {
				console.log(err);
				dispatch(actions.error('Не удалось загрузить данные профиля, попробуйте еще раз'));
			} finally {
				setWaiter(false);
			}
		};

		getData();

	}, [dispatch, uuid]);

	useEffect(() => {
		refreshing();
	}, []);


	const getStatus = (role) => {

		switch (role) {
			case 'HOST':
				return 'Партнёр Getarent';
			case 'GUEST':
				return 'Путешественник';
			default:
				return 'Новый пользователь';
		}
	};

	const isSuperHost = labels && labels.includes('SUPERHOST');
	const isSuperGuest = labels && labels.includes('SUPERGUEST');

	const formattedCreatedAt = data?.createdAt ? formatInTimeZone(data.createdAt, "UTC", "dd.MM.yyyy") : '';

	return (
		<>
			<SafeAreaView style={s.publicProfile}>
				<Header />
				{!waiter && (
					<ScrollView style={s.container}>
						<View style={s.imageContainer}>
							<View style={{ alignItems: 'center' }}>
								<Avatar 
									diameter={151} 
									avatar={avatar}
									name={`${data.firstName} ${data.lastName}`} 
								/>
								<Text style={s.name}>{firstName}</Text>
								<Text style={s.userSubInfo}>
									На Getarent c {''}
									<Text style={theme.styles.P2}>
										{formattedCreatedAt}
									</Text>
								</Text>
								<Text style={s.userSubInfo}>
									Статус: {''}
									<Text style={[s.userSubInfo, theme.styles.P2, s.greenText]}>
										{getStatus(role)}
									</Text>
								</Text>
							</View>
						</View>
						{
							(isSuperHost || isSuperGuest)
							&&
								<View style={s.superHost}>
									{
										isSuperHost
										?
											<View>
												<SmallSuperHostIcon
													width={20}
													height={20}
													style={[s.superHostIcon, { left: -22 }]}
												/>
												<Text style={[theme.styles.P2, {textAlign: 'center'}]}>
													Суперзозяин - {''}
													<Text style={theme.styles.P2R}>
														это опытный и надёжный владелец. Выбирая его автомобиль, вы получаете лучший сервис
													</Text>
												</Text>
											</View>
										:
											<View>
												<SmallSuperHostIcon
													width={20}
													height={20}
													style={s.superHostIcon}
												/>
												<Text style={[theme.styles.P2, {textAlign: 'center'}]}>
													Суперводитель - {' '}
													<Text style={theme.styles.P2R}>
														это проверенный и надёжный
														арендатор в сообществе. Такие пользователи
														арендуют машины на Getarent без залога{' '}
													</Text>
													<TouchableOpacity
														onPress={() => onOpenSuperGuestModalReview()}
													>
														<Icon
															name="question"
															color={theme.colors.blue}
															size={theme.normalize(16)}
														/>
													</TouchableOpacity>
												</Text>
											</View>
									}
								</View>
						}
						<View style={s.stats}>
							<Text style={s.statsText}>
								Поездки
								<Text style={s.blueText}> {rentsQty}</Text>
							</Text>
							<View style={s.row}>
								<Text style={s.statsText}>
									Отзывы
									<Text style={s.blueText}> {reviewsQty}</Text>
								</Text>
								<TouchableOpacity
									style={s.rating}
									onPress={() => {
										api.navigation.deepNavigate(
											[ 'ProfileRoot', 'Reviews' ],
											{
												rating,
												reviews,
												reviewsQty,
											}
										)
									}}
								>
									<Text style={theme.styles.P1R}>
										{formatRating(rating)}
									</Text>
									<Icon
										name="star"
										color={theme.colors.yellow}
										style={{ marginLeft: 4 }}
										size={theme.spacing(3.5)}
									/>
								</TouchableOpacity>
							</View>
						</View>
						<Separator light style={{ marginBottom: 20 }} />
						{role === 'HOST' && !!cars && (
							<Section
								title="Автопарк"
								onPress={
									cars.length > 1 &&
									(() =>
										api.navigation.navigate(
											'ProfileCars',
											{
												cars,
											},
											true
										))
								}
							>
								{cars.slice(0, 1).map((item) => (
									<ProfileCarItem
										{...item}
										key={item.id}
										photoUrl={item.photo}
										style={s.car}
										owner={{ labels }}
										onPress={() => {
											api.navigation.navigate(
												'Car',
												{ uuid: item.uuid },
												true
											);
										}}
									/>
								))}
							</Section>
						)}
						{!!reviews?.length && (
							<View style={{ marginBottom: 30 }}>
								<View style={[s.row, s.reviewHeader]}>
									<Text style={theme.styles.P1}>
										Отзывы
									</Text>
									{reviews.length > 3 && (
										<ButtonText
											title="Ещё"
											style={{ padding: 0 }}
											onPress={
												reviews?.length > 1 &&
												(() =>
													api.navigation.push(
														'Reviews',
														{
															reviewsQty,
															rating,
															reviews,
														},
														true
													))
											}
										/>
									)}
								</View>
								<Reviews
									reviews={reviews.sort((a, b) => (
										-a.createdAt.localeCompare(b.createdAt)
									)).slice(0, 3)}
									style={{ marginBottom: 32 }}
									openReview={review =>
										setModalReview(review)
									}
								/>
							</View>
						)}
					</ScrollView>
				)}
				{waiter && <Waiter />}
			</SafeAreaView>
			<Modalize
				ref={modalizeRef}
				snapPoint={HEIGHT / 2}
				modalHeight={HEIGHT / 1.2}
				onClose={() => setModalReview({})}
			>
				{
					Object.keys(modalReview).length !== 0
					&&
						<ReviewModal review={modalReview} />
				}
			</Modalize>
			<Modalize
				ref={superGuestmodalizeRef}
				snapPoint={HEIGHT / 4.5}
				modalHeight={HEIGHT / 4.5}
			>
				<View style={s.modal}>
					<Text style={s.modalText}>
						Для партнёра Getarent - вам не нужно брать залоги у таких
						арендаторов, Getarent возьмет на себя компенсацию возможных
						убытков в рамках установленного вами залога.”
					</Text>
				</View>
			</Modalize>
		</>
	);
};

export default PublicProfile;
