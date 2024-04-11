
// import PressIcon from 'img/press-icon.svg';

// const scrollViewRef = useRef(null);

// const [isDotsVisible, setIsDotsVisible] = React.useState(true);

// const toggleInvestButton = (isDotsVisible) => {
//     setIsDotsVisible(!isDotsVisible);
// };

// const handleCloseInvestModal = () => {
//     dispatch(actions.toggleInvestModal());
// };

// const handleOpenInvestModal = () => {

//     scrollViewRef.current?.scrollTo({ y: 0, animated: true });
//     dispatch(actions.toggleInvestModal());

//     toggleInvestButton(isDotsVisible)
// };

// // status bar
// <View style={[s.statusBar, { backgroundColor: '#282c34' }]}>
// <SafeAreaView>
//     <StatusBar 
//         barStyle="light-content" 
//     />
// </SafeAreaView>
// </View>

// //top button
// <View style={{
//     paddingTop: 8,
//     paddingHorizontal: 0,
//     backgroundColor: '#282c34',
// }}>
//     <View style={{
//         height: 2,
//         backgroundColor: theme.colors.darkGrey,
//     }} />
//     <Text style={{
//         textAlign: 'center',
//         color: theme.colors.white,
//         fontWeight: 'bold',
//         paddingTop: 9,
//         paddingBottom: 12,
//     }}>
//         Инвестируйте в Getarent 💸
//     </Text>
//     <TouchableOpacity 
//         style={{
//             position: 'absolute',
//             padding: 20,
//             right: 3,
//             top: 0,
//         }}
//         onPress={handleOpenInvestModal}
//     >
//         {
//             isDotsVisible
//             ?
//                 <View style={{
//                 }}>
//                     <PressIcon width={15} height={15} />
//                 </View>
//             :
//                 <View style={{
//                     top: 0,
//                     right: 0,
//                 }}>
//                     <Icon
//                         name="cross"
//                         size={15}
//                         color={theme.colors.white}
//                     />
//                 </View>
//         }
//     </TouchableOpacity>
// </View>

// /// modal

// const [isVisible, setIsVisible] = useState(true);
// const [loadInvestModal, setLoadInvestModal] = useState(false);

// useEffect(() => {
//     setTimeout(() => {
//         setLoadInvestModal(true);
//     }, 1000);
// }, []);

// const HEIGHT = Dimensions.get('window').height;

// const toggleHeight = () => {
    
//   const newHeightValue = isVisible ? 0 : HEIGHT;
//   const heightDuration = 600;

//   Animated.timing(animatedHeight, {
//     toValue: newHeightValue,
//     duration: heightDuration,
//     useNativeDriver: false,
//   }).start(() => setIsVisible(!isVisible));

//   const newOpacityValue = isVisible ? 0 : 1;
//   const opacityDuration = 600;

//   Animated.timing(animatedOpacity, {
//     toValue: newOpacityValue,
//     duration: opacityDuration,
//     useNativeDriver: false,
//   }).start();
// };

// const { isInvestModalVisible } = useSelector(st => st.layout.investModal);
// const { founderData } = useSelector(st => st.layout.investModal);

// const animatedHeight = new Animated.Value(isVisible ? HEIGHT : 0);
// const animatedOpacity = new Animated.Value(isVisible ? 1 : 0);

// React.useEffect(() => {

//     if (isInvestModalVisible) {
//         toggleHeight();
//     } else {
//         toggleHeight();
//     }

// }, [isInvestModalVisible]);

// {
//     loadInvestModal
//     &&
//         <Animated.View style={{
//             height: animatedHeight,
//             width: '100%',
//             position: 'absolute',
//             top: 64,
//             left: 0,
//             backgroundColor: '#282c34',
//         }}>
//             <Animated.View style={{
//                 paddingHorizontal: 20,
//                 paddingVertical: 20,
//                 opacity: animatedOpacity,
//             }}>
//                 <TouchableOpacity
//                     style={{
//                         flexDirection: 'row',
//                         marginBottom: 20,
//                     }}
//                     onPress={() =>
//                         api.navigation.push(
//                             'PublicProfile',
//                             {
//                                 uuid: founderData.id,
//                             },
//                             true
//                         )
//                     }
//                 >
//                     <Avatar 
//                         style={{ 
//                             marginRight: 20, 
//                             transform: [{ rotate: '90deg'}] 
//                         }}
//                         avatar={founderData.avatar} 
//                         diameter={50} 
//                     />
//                     <View>
//                         <Text style={{
//                             ...theme.styles.H4,
//                             color: theme.colors.white,
//                             marginBottom: -7,
//                         }}>
//                             {founderData.firstName}
//                         </Text>
//                         <Text style={{
//                             ...theme.styles.P1R,
//                             color: theme.colors.grey
//                         }}>
//                             основатель Getarent
//                         </Text>
//                     </View>
//                 </TouchableOpacity>
//                 <ScrollView style={{
//                     marginBottom: 150,
//                 }}>
//                     <Text style={{
//                         ...theme.styles.P2R,
//                         color: theme.colors.white,
//                         marginBottom: 10,
//                     }}>
//                         Мы строим маркетплейс по аренде авто номер 1 в России. Этот процесс не 
//                         быстрый, нужно привлекать много арендодателей с машинами, которые не идут 
//                         сюда, пока не будет много водителей. Такой некий «баланс» спроса и предложения.
//                     </Text>
//                     <Text style={{
//                         ...theme.styles.P2R,
//                         color: theme.colors.white,
//                         marginBottom: 10,
//                     }}>
//                         Но это вопрос времени. Getarent строится всего 22 месяца, у нас уже более 12 000 
//                         регистраций и на 50 млн ₽ забронировано арендодней с помощью этого приложения.
//                     </Text>
//                     <Text style={{
//                         ...theme.styles.P2R,
//                         color: theme.colors.white,
//                         marginBottom: 10,
//                     }}>
//                         Позади многое: напилили удобный (как нам кажется) продукт, привлекли в проект крупную 
//                         страховую компанию (чтобы было безопаснее), научились отсекать мошенников и банкротов, 
//                         научились быстро ремонтировать машины при ДТП и многое другое.
//                     </Text>
//                     <Text style={{
//                         ...theme.styles.P2R,
//                         color: theme.colors.white,
//                         marginBottom: 10,
//                     }}>
//                         Впереди амбициозные планы: увеличить парк машин в десятки раз, зарегать еще сотни тысяч 
//                         водителей, внедрить искусственный интеллект (вот-вот уже) для динамического ценообразования 
//                         и максимизации прибыли наших партнеров с машинами, улучшить прилагу, запуститься во всех 
//                         городах-миллионниках России, во всех туристических центрах, запустить проект в других странах..
//                     </Text>
//                     <Text style={{
//                         ...theme.styles.P2R,
//                         color: theme.colors.white,
//                         marginBottom: 10,
//                     }}>
//                         Прямо сейчас вы можете стать инвестором и полноценным владельцем маркетплейса Getarent. 
//                         Если вам это интересно и вы владеете от 1 млн ₽, напишите мне в тележик @whroom. 
//                     </Text>
//                     <Text style={{
//                         ...theme.styles.P2R,
//                         color: theme.colors.white,
//                         marginBottom: 10,
//                     }}>
//                         Буду рад познакомиться. Спасибо за внимание.
//                     </Text>
//                 </ScrollView>
//             </Animated.View>
//         </Animated.View>
// }