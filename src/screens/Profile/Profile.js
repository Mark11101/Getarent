import React, { useMemo } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import * as PS from '../../store/profile/selectors'
import theme from '../../theme'
import { Text, View } from 'react-native'
import styles from './styles'
import {
	MenuItem,
	WarningSvg,
	CreditCardSvg,
	ReviewLikeSvg,
	ReviewSvg,
	SendDocumentsSvg,
	WriteToSupportBtn,
	SteeringWheelSvg,
	InfoSvg,
	InfoMenuGroup,
	AddYourVehicleBanner,
	BlockBanner,
	CheckingDocumentsBanner,
	SuperDriverBanner,
	ProfileHeader,
	ProfileLayout
} from '../../components'
import { ROLE_LABELS } from '../../constants/roles'
import compare from '../../libs/compare'
import * as M from '../../modals'
import { paymentCardSelector } from '../../store/payment/selectors'
import * as HS from '../../store/host/selectors'

export const Profile = ({ navigation }) => {
	const profile = useSelector(PS.profileSelecotor, shallowEqual)
	const isBanned = useSelector(PS.isBannedSelector, compare.values)
	const isInProgress = useSelector(PS.isInProgressSelector, compare.values)
	const isGuest = useSelector(PS.isGuestSelector, compare.values)
	const isHost = useSelector(PS.isHostSelector, compare.values)

	/* GUEST */
	const paymentCard = useSelector(paymentCardSelector, compare.props('pan'))

	/* HOST */
	const paymentMethod = useSelector(HS.hostPaymentMethodSelector, compare.props('details'))
	const hostLoader = useSelector(HS.hostLoaderSelector, compare.values)
	const ifTrademark = useSelector(HS.hostIfTrademarkSelector, compare.values)

	const isSuper = useMemo(() => {
		return Array.isArray(profile.labels) && profile.labels
			.find(label => Object.values(ROLE_LABELS).includes(label))
	}, [ profile.labels ])

	return <ProfileLayout>
		<ProfileHeader
			avatar={profile.avatar}
			firstName={ifTrademark || profile.firstName}
			rating={profile.rating}
			role={profile.role}
			isLoading={profile.loading}
			isSuper={isSuper}
		/>

		<View style={styles.content}>
			{/* Banners */}
			
			{
				isBanned && <BlockBanner
					onPress={() => navigation.navigate('Chats', { screen: 'Support' })}
				/>
			}
			{ (isInProgress && isGuest) && <CheckingDocumentsBanner /> }
			{ (isGuest && !isSuper) && <SuperDriverBanner /> }
			{
				isGuest && <AddYourVehicleBanner
					onLearnMore={() => navigation.navigate('RentOutNoCar', { isGuest: true })}
				/>
			}

			{
				(isGuest && profile.kbm) && <MenuItem
					title={<View style={styles.flexRowCentered}>
						<Text style={[ styles.secondaryText, styles.blueText ]}>
							мой КБМ:&nbsp;
						</Text>
						<Text style={[ styles.secondaryText, styles.blueText, styles.bold ]}>
							{ profile.kbm }
						</Text>
					</View>}
					prefixContent={<SteeringWheelSvg color={theme.colors.blue} />}
					postfixContent={<InfoSvg />}
					arrow={false}
					onPress={() => M.requestKbmInfoModal()}
				/>
			}

			{
				isGuest && <MenuItem
					title='Платежная карта'
					prefixContent={<CreditCardSvg />}
					loading={profile.loading}
					postfixContent={paymentCard?.pan ? <></> : <WarningSvg />}
					onPress={() => M.requestPaymentCardModal()}
				/>
			}
			{
				isHost && <MenuItem
					title='Настройка получения выплат'
					prefixContent={<CreditCardSvg />}
					loading={hostLoader}
					postfixContent={paymentMethod ? <></> : <WarningSvg />}
					onPress={() => navigation.navigate('HostPaymentDetailsModal', paymentMethod)}
				/>
			}

			{
				(isGuest && !!profile.ownReviewsQty) && <MenuItem
					title='Отзывы о поездках'
					prefixContent={<ReviewSvg />}
					postfixContent={<Text style={styles.secondaryText}>
						{ profile.ownReviewsQty }
					</Text>}
					onPress={() => navigation.navigate(
						'Reviews',
						{
							isOwn: true,
							rating: profile.rating,
							reviews: profile.ownReviews,
							reviewsQty: profile.ownReviewsQty
						}
					)}
				/>
			}

			{
				isHost &&  <MenuItem.Group>
					{
						!!profile.reviewsQty && <MenuItem
							title='Отзывы о моих машинах'
							prefixContent={<ReviewSvg />}
							postfixContent={<Text style={styles.secondaryText}>
								{ profile.reviewsQty }
							</Text>}
							onPress={() => navigation.navigate(
								'Reviews',
								{
									title: 'Отзывы о моих машинах',
									reviews: profile.reviews,
									reviewsQty: profile.reviewsQty
								}
							)}
						/>
					}
					{
						!!profile.ownReviewsQty && <MenuItem
							title='Мои отзывы о водителях'
							prefixContent={<ReviewLikeSvg />}
							postfixContent={<Text style={styles.secondaryText}>
								{ profile.ownReviewsQty }
							</Text>}
							onPress={() => navigation.navigate(
								'Reviews',
								{
									isOwn: true,
									title: 'Мои отзывы о водителях',
									reviews: profile.ownReviews,
									reviewsQty: profile.ownReviewsQty
								}
							)}
						/>
					}
				</MenuItem.Group>
			}

			<InfoMenuGroup />

			{
				isBanned ? <MenuItem
					title='Обратная связь с серсисом'
					prefixContent={<ReviewSvg />}
				/> : <MenuItem
					title='Отправить документы сервису'
					prefixContent={<SendDocumentsSvg />}
					onPress={() => M.requestSendDocumentsModal()}
				>
					<WriteToSupportBtn
						style={{ marginHorizontal: 16, marginBottom: 16 }}
						text='Написать в поддержку'
					/>
				</MenuItem>
			}

		</View>
	</ProfileLayout>
}
