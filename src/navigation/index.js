import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
	Location,
	DatePicker,
	Filters,
	Select,
	Car,
	Chat,
	PublicProfile,
	Review,
	GuarantorOfSecurity,
	AdditionalServices,
	PointMap,
	CarFeatures,
	ComfortFeatures,
	PsoPhotoAuto,
	PsoVinAuto,
	PsoExternalDamage,
	PsoCondition,
	PsoMeasuring,
	PsoWait,
	RentRoom,
	RentRoomBill,
	CheckoutBill,
	ReasonCancellation,
	DeclineSuccess,
	Insurance,
	FeeInfo,
	DeliveryPlace,
	Payment,
	PaymentFailed,
	PaymentSuccess,
	ConfirmEmail,
	ConfirmPhone,
	Documents,
	CarEdit,
	ProfileFinances,
	ProfileCars,
	ProfilePayments,
	BankCard,
	CheckingAccount,
	DocumentsSuccess,
	GeneralStep,
	MilageFuelStep,
	DefectsStainsStep,
	AdditionalStep,
	PostInspection,
	QuestionTipPopup,
	WebViewScreen,
	ReferalPopup,
	RulesPopup,
	GuestPostRentPopup,
	HostPreRentPopup,
	HostPostRentPopup,
	DocumentPopup,
	ListPopup,
	FinePopup,
	InsurancePopup,
	DamageCompensation,
	Accidents,
	Washing,
	Fuel,
	Late,
	Other,
	CompleteCompensation,
	AttachSuccess,
	AttachFailed,
	PaymentMethod,
	CarRegistration,
	DriverInfo,
	RegCarDocuments,
	RegCarParametrs,
	RegCarСharacteristics,
	RegCarСheckScreen,
	RegCarSuccessScreen,
	IncreasedFeePopup,
	RentOutSection,
	RentOutArticle,
	RentOutSearch,
	MyCars,
	RentOutNoCar,
	AvailabilityCalendar,
	PreviewStep,
	PsoPhotosView,
	HostRegistration,
} from '../screens';
import {
	HostAboutTextModal,
	HostPaymentDetailsModal,
	HostProfileSettingsModal,
	HostWorkingHoursModal,
	ProfileAvatarModal
} from '../screenModals';
import RootTabsScreen from './RootTabs';

const Stack = createNativeStackNavigator();

export default function RootStack() {

	const forFade = ({ current }) => ({
		cardStyle: {
		  opacity: current.progress,
		},
	});
	
	return (
		<Stack.Navigator>
			<Stack.Group
				screenOptions={{ headerShown: false }}
			>
				<Stack.Screen name="RootTabs" component={RootTabsScreen} />
				<Stack.Screen name="Location" component={Location} options={{ cardStyleInterpolator: forFade }} />
				<Stack.Screen name="DatePicker" component={DatePicker} />
				<Stack.Screen name="Filters" component={Filters} />
				<Stack.Screen name="Select" component={Select} />
				<Stack.Screen name="Car" component={Car} />
				<Stack.Screen name="Chat" component={Chat} />
				<Stack.Screen name="Review" component={Review} />
				<Stack.Screen name="GuarantorOfSecurity" component={GuarantorOfSecurity} />
				<Stack.Screen name="AdditionalServices" component={AdditionalServices} />
				<Stack.Screen name="PointMap" component={PointMap} />
				<Stack.Screen name="CarFeatures" component={CarFeatures} />
				<Stack.Screen name="ComfortFeatures" component={ComfortFeatures} />
				<Stack.Screen name="PsoPhotoAuto" component={PsoPhotoAuto} />
				<Stack.Screen name="PsoVinAuto" component={PsoVinAuto} />
				<Stack.Screen name="PsoExternalDamage" component={PsoExternalDamage} />
				<Stack.Screen name="PsoCondition" component={PsoCondition} />
				<Stack.Screen name="PsoMeasuring" component={PsoMeasuring} />
				<Stack.Screen name="PsoWait" component={PsoWait} />
				<Stack.Screen name="PsoPhotosView" component={PsoPhotosView} />
				<Stack.Screen name="RentRoom" component={RentRoom} />
				<Stack.Screen name="RentRoomBill" component={RentRoomBill} />
				<Stack.Screen name="CheckoutBill" component={CheckoutBill} />
				<Stack.Screen name="ReasonCancellation" component={ReasonCancellation}/>
				<Stack.Screen name="DeclineSuccess" component={DeclineSuccess}/>
				<Stack.Screen name="Insurance" component={Insurance} />
				<Stack.Screen name="FeeInfo" component={FeeInfo} />
				<Stack.Screen name="DeliveryPlace" component={DeliveryPlace} />
				<Stack.Screen name="Payment" component={Payment} />
				<Stack.Screen name="PaymentFailed" component={PaymentFailed} />
				<Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
				<Stack.Screen name="ConfirmEmail" component={ConfirmEmail} />
				<Stack.Screen name="ConfirmPhone" component={ConfirmPhone} />
				<Stack.Screen name="ProfilePayments" component={ProfilePayments} />
				<Stack.Screen name="Documents" component={Documents} />
				<Stack.Screen name="CarEdit" component={CarEdit} />
				<Stack.Screen name="ProfileFinances" component={ProfileFinances} />
				<Stack.Screen name="ProfileCars" component={ProfileCars} />
				<Stack.Screen name="BankCard" component={BankCard} />
				<Stack.Screen name="CheckingAccount" component={CheckingAccount} />
				<Stack.Screen name="PublicProfile" component={PublicProfile} />
				<Stack.Screen name="DocumentsSuccess" component={DocumentsSuccess} />
				<Stack.Screen name="GeneralStep" component={GeneralStep} />
				<Stack.Screen name="PreviewStep" component={PreviewStep} />
				<Stack.Screen name="MilageFuelStep" component={MilageFuelStep} />
				<Stack.Screen name="DefectsStainsStep" component={DefectsStainsStep} />
				<Stack.Screen name="AdditionalStep" component={AdditionalStep} />
				<Stack.Screen name="PostInspection" component={PostInspection} />
				<Stack.Screen name="QuestionTipPopup" component={QuestionTipPopup} />
				<Stack.Screen name="WebViewScreen" component={WebViewScreen} />
				<Stack.Screen name="ReferalPopup" component={ReferalPopup} />
				<Stack.Screen name="RulesPopup" component={RulesPopup} />
				<Stack.Screen name="GuestPostRentPopup" component={GuestPostRentPopup} />
				<Stack.Screen name="HostPreRentPopup" component={HostPreRentPopup} />
				<Stack.Screen name="HostPostRentPopup" component={HostPostRentPopup} />
				<Stack.Screen name="DocumentPopup" component={DocumentPopup} />
				<Stack.Screen name="ListPopup" component={ListPopup} />
				<Stack.Screen name="FinePopup" component={FinePopup} />
				<Stack.Screen name="InsurancePopup" component={InsurancePopup} />
				<Stack.Screen name="DamageCompensation" component={DamageCompensation} />
				<Stack.Screen name="Accidents" component={Accidents} />
				<Stack.Screen name="Washing" component={Washing} />
				<Stack.Screen name="Fuel" component={Fuel} />
				<Stack.Screen name="Late" component={Late} />
				<Stack.Screen name="Other" component={Other} />
				<Stack.Screen name="CompleteCompensation" component={CompleteCompensation} />
				<Stack.Screen name="AttachSuccess" component={AttachSuccess} />
				<Stack.Screen name="AttachFailed" component={AttachFailed} />
				<Stack.Screen name="PaymentMethod" component={PaymentMethod} />
				<Stack.Screen name="CarRegistration" component={CarRegistration} />
				<Stack.Screen name="DriverInfo" component={DriverInfo} />
				<Stack.Screen name="RegCarDocuments" component={RegCarDocuments} />
				<Stack.Screen name="RegCarParametrs" component={RegCarParametrs} />
				<Stack.Screen name="RegCarСharacteristics" component={RegCarСharacteristics} />
				<Stack.Screen name="RegCarСheckScreen" component={RegCarСheckScreen} />
				<Stack.Screen name="RegCarSuccessScreen" component={RegCarSuccessScreen} />
				<Stack.Screen name="IncreasedFeePopup" component={IncreasedFeePopup} />
				<Stack.Screen name="RentOutSection" component={RentOutSection} />
				<Stack.Screen name="RentOutArticle" component={RentOutArticle} />
				<Stack.Screen name="RentOutSearch" component={RentOutSearch} />
				<Stack.Screen name="MyCars" component={MyCars} />
				<Stack.Screen name="AvailabilityCalendar" component={AvailabilityCalendar} />
				<Stack.Screen name="HostRegistration" component={HostRegistration} />
			</Stack.Group>
			<Stack.Group screenOptions={{ presentation: 'modal', headerShown: false }}>
				<Stack.Screen name="RentOutNoCarModal" component={RentOutNoCar} />
				<Stack.Screen name="HostWorkingHoursModal" component={HostWorkingHoursModal} />
				<Stack.Screen name="HostAboutTextModal" component={HostAboutTextModal} />
				<Stack.Screen name="ProfileAvatarModal" component={ProfileAvatarModal} />
				<Stack.Screen name="HostPaymentDetailsModal" component={HostPaymentDetailsModal} />
				<Stack.Screen name="HostProfileSettingsModal" component={HostProfileSettingsModal} />
			</Stack.Group>
		</Stack.Navigator>
	);
};
