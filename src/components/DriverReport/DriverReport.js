import { 
    View, 
    Text, 
    Modal, 
    Alert,
    Dimensions, 
    ScrollView,
    TouchableOpacity, 
    TouchableWithoutFeedback, 
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import React, { useEffect, useRef, useState } from 'react';

import { formatPrice } from 'functions';
import TextButton from '../TextButton';
import Avatar from '../Avatar';
import Separator from '../Separator';
import PrimaryButton from '../PrimaryButton';
import AccordionView from '../AccordionView/AccordionView';

import FaqImage from 'img/faq-image.svg';
import FailIcon from 'img/fail-red-bg.svg';
import CloseIcon from "img/close/close.svg";
import SuccessIcon from 'img/success-green-bg.svg';
import FailWalletIcon from 'img/check-driver/danger-wallet.svg';
import CreditWalletIcon from 'img/check-driver/credit-wallet.svg';
import SuccessWalletIcon from 'img/check-driver/success-wallet.svg';

import s from './styles';
import theme from 'theme';

export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('window').height;

const CHECKS = {
    PASSPORT: 'PASSPORT',
    DRIVERS_LICENSE: 'DRIVERS_LICENSE',
    FSSP_OPEN_DEBTS: 'FSSP_OPEN_DEBTS',
    FSSP_CLOSED_DEBTS: 'FSSP_CLOSED_DEBTS',
    FSSP_CLOSED_BY_ARTICLE_DEBTS: 'FSSP_CLOSED_BY_ARTICLE_DEBTS',
    BANKS_BLACK_LIST: 'BANKS_BLACK_LIST',
    RENTAL_BLACK_LIST: 'RENTAL_BLACK_LIST',
    PROCEEDINGS: 'PROCEEDINGS',
    FSSP_OPEN_BY_ARTICLE_DEBTS: 'FSSP_OPEN_BY_ARTICLE_DEBTS',
};

const DriverReport = ({ driverAvatar, driverCreatedAt, name, data, visible }) => {

    if ((Object.keys(data).length === 0)) {
        return null;
    } else if (data.checks.length === 0) {

        Alert.alert(
            'Упс, что-то пошло не так',
            'Не удалось получить данные водителя, попробуйте еще раз или повторите запрос позже'
        );

        return null;
    };

	const driverReportRef = useRef(null);

    const [modalContent, setModalContent] = React.useState({});

    const [fsspOpenAccordionTitle, setFsspOpenAccordionTitle] = useState('Показать все');
    const [fsspClosedAccordionTitle, setFsspClosedAccordionTitle] = useState('Показать все');
    const [fsspClosedByArticleAccordionTitle, setFsspClosedByArticleAccordionTitle] = useState('Показать все');

    useEffect(() => {
        visible && driverReportRef.current?.open();
    }, [visible]);

    const handleClose = () => {
        driverReportRef.current?.close();
    };

    const passport = data.checks.find((check) => check.type === CHECKS.PASSPORT)?.data;
    const driversLicense = data.checks.find((check) => check.type === CHECKS.DRIVERS_LICENSE);
    const fsspOpenDebtsData = data.checks.find((check) => check.type === CHECKS.FSSP_OPEN_DEBTS)?.data;
    const fsspClosedDebtsData = data.checks.find((check) => check.type === CHECKS.FSSP_CLOSED_DEBTS)?.data;
    const fsspClosedByArticleDebtsData = data.checks.find((check) => check.type === CHECKS.FSSP_CLOSED_BY_ARTICLE_DEBTS)?.data;
    const banksBlackList = data.checks.find((check) => check.type === CHECKS.BANKS_BLACK_LIST)?.data;
    const rentalBlackList = data.checks.find((check) => check.type === CHECKS.RENTAL_BLACK_LIST)?.data;
    const proceedings = data.checks.find((check) => check.type === CHECKS.PROCEEDINGS)?.data;

    const fsspOpenDebts = fsspOpenDebtsData.factors;
    const fsspClosedDebts = fsspClosedDebtsData.factors;
    const fsspClosedByArticleDebts = fsspClosedByArticleDebtsData.factors;

    const convertToDDMMYYYY = (date) => {
        
        const dateParts = date.split('-');
        
        if (dateParts.length === 3) {

          const year = dateParts[0];
          const month = dateParts[1];
          const day = dateParts[2];
          
          return `${day}.${month}.${year}`;
        
        } else {
          return '?';
        }
    };

    const getYearDeclension = (years) => (
        years === 0
        ?
            'меньше 1 года'
        :
            years + ' ' + (
                years === 1
                ?
                    'год'
                :
                    years > 1 && years < 5
                    ?
                        'года'
                    :
                        'лет'
            )
    )

    return (
        <Modalize
            ref={driverReportRef}
            adjustToContentHeight={true}
            modalStyle={s.driverReport}
        >
            {Object.keys(data).length !== 0 && (
                <ScrollView>
                    <View style={s.header}>
                        <Text style={s.title}>
                            Отчет о проверке водителя
                        </Text>
                        <TextButton 
                            title='Закрыть'
                            style={s.closeBtn}
                            onPress={handleClose}
                        />
                    </View>
                    <View style={s.person}>
                        <Avatar
                            name={name}
                            style={s.avatar}
                            avatar={driverAvatar}
                            diameter={60}
                        />
                        <View>
                            <Text style={s.name}>
                                {name}
                            </Text>
                            {
                                !!driverCreatedAt
                                &&
                                    <Text style={s.greyText}>
                                        Заргестрирован(а) {getRegistrationInfo(driverCreatedAt)}
                                    </Text>
                            }
                        </View>
                    </View>
                    <View style={s.section}>
                        <Text style={s.title}>
                            Паспорт благонадежности
                        </Text>
                        {
                            passport.isPassportConfirmed
                            ?
                                <SuccessLine title={'Паспорт подтвержден'} />
                            :
                                <FailLine title={'Паспорт не подтвержден'} />
                        }
                        {
                            passport.isPassportExpired
                            ?
                                <FailLine title={'Паспорт числится в базе недействительных'} />
                            :
                                <SuccessLine title={'Паспорт не числится в базе недействительных'} />
                        }
                        {
                            passport.isUserWanted
                            ?
                                <FailLine style={{ marginBottom: 0 }} title={'Физическое лицо числится в базе данных розыска МВД'} />
                            :
                                <SuccessLine style={{ marginBottom: 0 }} title={'Физическое лицо не числится в базе данных розыска МВД'} />
                        }
                    </View>
                    <Separator style={{ marginVertical: 8 }}/>
                    <View style={s.section}>
                        <Text style={s.title}>
                            Водительские права
                        </Text>
                        {
                            driversLicense.data.isValid
                            ?
                                <SuccessLine title={`Документ действителен с ${driversLicense.data.experience || '?'} года`} />
                            :
                                <FailLine title={`Документ не действителен с ${driversLicense.data.experience || '?'} года`} />
                        }
                        {
                            driversLicense.data.categories.length !== 0
                            ?
                                <SuccessLine title={'Категория ВУ: ' + driversLicense.data.categories.map(obj => obj.category).join(', ')} />
                            :
                                <FailLine title={`Категории ВУ не найдены`} />
                        }
                        {
                            driversLicense.data.factors?.map((factor) =>
                                <FailLine 
                                    title={`В ${new Date(factor.date).getFullYear()} году было лишение прав по причине:`} 
                                    subtitleReason={factor.stateDescription || '-'}
                                    subtitleValidity={`На срок: ${getYearDeclension(factor.limitation) || '?'}`}
                                    subtitleAttention={factor.stateWarn}
                                />
                            )
                        }
                    </View>
                    <TouchableOpacity 
                        style={[s.greyPanel, driversLicense.data.factors.length !== 0 && { marginTop: -16 }]}
                        onPress={() => setModalContent(
                            <View style={s.modalContent}>
                                <Text style={s.modalTitle}>
                                    Что такое КБМ?
                                </Text>
                                <Text style={s.modalText}>
                                    <Text style={s.modalTextBold}>
                                        {'Коэффициент бонус-малус, или КБМ, — '}
                                    </Text>
                                    это показатель безаварийного вождения, который рассчитывается для каждого 
                                    водителя на основе данных о страховых выплатах по ДТП, которые случились 
                                    по его вине. Он отражает риск наступления страхового события и влияет на 
                                    стоимость полиса.
                                </Text>
                                <PrimaryButton 
                                    title='Понятно'
                                    style={s.modalResumeBtn}
                                    onPress={() => setModalContent({})}
                                />
                            </View>
                        )}
                    >
                        <View style={s.row}>
                            <SuccessIcon 
                                width ={22} 
                                height={22} 
                                style={s.greyPanelIcon}
                            />
                            <Text style={{
                                fontFamily: 'Inter-Regular',
                                fontSize: 16,
                                marginRight: 10,
                                color: theme.colors.black,
                            }}>
                                КБМ:
                            </Text>
                            <Text style={{
                                fontFamily: 'Inter-Bold',
                                fontSize: 16,
                                color: theme.colors.black,
                            }}>
                                {driversLicense.kbm || '?'}
                            </Text>
                        </View>
                        <Text>
                            Что такое КБМ?
                        </Text>
                    </TouchableOpacity>
                    <Separator style={{ marginVertical: 8 }}/>
                    <View style={s.section}>
                        <Text style={s.title}>
                            Открытые задолженности ФССП ({fsspOpenDebts.length})
                        </Text>
                        {
                            fsspOpenDebtsData.total > 0 ? (
                                <Text style={s.subtitle}>
                                    На сумму: {formatPrice(fsspOpenDebtsData.total)}
                                </Text>
                            ) : null
                        }
                        {
                            fsspOpenDebts.length === 0
                            ?
                                <SuccessLine walletIcon title={'Задолжености нет'} />
                            :
                                fsspOpenDebts.map((factor, i) => 
                                    i < 4 && (
                                        <FailLine 
                                            accordion
                                            walletIcon
                                            title={`${factor.reason}`}
                                            date={convertToDDMMYYYY(factor.date)}
                                            amount={factor.amount}
                                        />
                                    )
                                )
                        }
                        {
                            fsspOpenDebts.length > 4
                            &&
                                <AccordionView 
                                    withoutArrow 
                                    title={fsspOpenAccordionTitle}
                                    style={{ marginTop: 10, marginBottom: -16 }}
                                    titleStyle={[s.lineTitle, { marginBottom: 25 }]}
                                    onPress={(isExpanded) => setFsspOpenAccordionTitle(isExpanded ? 'Показать все' : 'Скрыть')}
                                >
                                    {
                                        fsspOpenDebts.map((factor, i) => 
                                            i >= 4 && (
                                                <FailLine 
                                                    accordion
                                                    walletIcon
                                                    title={factor.reason} 
                                                    date={convertToDDMMYYYY(factor.date)}
                                                    amount={factor.amount}
                                                />
                                            )
                                        )

                                    }
                                </AccordionView>
                        }
                    </View>
                    <Separator style={{ marginVertical: 8 }}/>
                    <View style={s.section}>
                        <Text style={s.title}>
                            Закрытые задолженности ФССП ({fsspClosedDebts.length})
                        </Text>
                        {
                            fsspClosedDebtsData.total > 0 ? (
                                <Text style={s.subtitle}>
                                    На сумму: {formatPrice(fsspClosedDebtsData.total)}
                                </Text>
                            ) : null
                        }
                        {
                            fsspClosedDebts.length === 0
                            ?
                                <SuccessLine walletIcon title={'Задолжености нет'} />
                            :
                                fsspClosedDebts.map((factor, i) => 
                                    i < 4 && (
                                        <SuccessLine 
                                            accordion
                                            walletIcon
                                            title={factor.reason} 
                                            date={convertToDDMMYYYY(factor.date)}
                                            amount={factor.amount}
                                        />
                                    )
                                )
                        }
                        {
                            fsspClosedDebts.length > 4
                            &&
                                <AccordionView 
                                    withoutArrow 
                                    title={fsspClosedAccordionTitle}
                                    style={{ marginTop: 10, marginBottom: -16 }}
                                    titleStyle={[s.lineTitle, { marginBottom: 25 }]}
                                    onPress={(isExpanded) => setFsspClosedAccordionTitle(isExpanded ? 'Показать все' : 'Скрыть')}
                                >
                                    {
                                        fsspClosedDebts.map((factor, i) => 
                                            i >= 4 && (
                                                <SuccessLine 
                                                    accordion
                                                    walletIcon
                                                    title={factor.reason} 
                                                    date={convertToDDMMYYYY(factor.date)}
                                                    amount={factor.amount}
                                                />
                                            )
                                        )

                                    }
                                </AccordionView>
                        }
                    </View>
                    <Separator style={{ marginVertical: 8 }}/>
                    <View style={s.section}>
                        <Text style={s.title}>
                            Закрытые задолженности ФССП по статье ({fsspClosedByArticleDebts.length})
                        </Text>
                        {
                            fsspClosedByArticleDebtsData.total > 0 ? (
                                <Text style={s.subtitle}>
                                    На сумму: {formatPrice(fsspClosedByArticleDebtsData.total)}
                                </Text>
                            ) : null
                        }
                        {
                            fsspClosedByArticleDebts.length === 0
                            ?
                                <SuccessLine walletIcon title={'Задолжености нет'} />
                            :
                                fsspClosedByArticleDebts.map((factor, i) => 
                                    i < 4 && (
                                        <SuccessLine 
                                            accordion
                                            walletIcon
                                            title={`${factor.reason}`}
                                            date={convertToDDMMYYYY(factor.date)}
                                            amount={factor.amount}
                                        />
                                    )
                                )
                        }
                        {
                            fsspClosedByArticleDebts.length > 4
                            &&
                                <AccordionView 
                                    withoutArrow 
                                    title={fsspClosedByArticleAccordionTitle}
                                    style={{ marginTop: 10, marginBottom: -16 }}
                                    titleStyle={[s.lineTitle, { marginBottom: 25 }]}
                                    onPress={(isExpanded) => setFsspClosedByArticleAccordionTitle(isExpanded ? 'Показать все' : 'Скрыть')}
                                >
                                    {
                                        fsspClosedByArticleDebts.map((factor, i) => 
                                            i >= 4 && (
                                                <SuccessLine 
                                                    accordion
                                                    walletIcon
                                                    title={`${factor.reason}`}
                                                    date={convertToDDMMYYYY(factor.date)}
                                                    amount={factor.amount}
                                                />
                                            )
                                        )

                                    }
                                </AccordionView>
                        }
                    </View>
                    <Separator style={{ marginVertical: 8 }}/>
                    <View style={s.section}>
                        <Text style={s.title}>
                            Черные списки банков
                        </Text>
                        {
                            banksBlackList.isBannedByBanks
                            ?
                                <FailLine title={'Находится в черном списке банков'} />
                            :
                                <SuccessLine title={'Нет в черном списке банков'} />
                        }
                    </View>
                    <TouchableOpacity 
                        style={s.greyPanel}
                        onPress={() => setModalContent(
                            <View style={s.modalContent}>
                                <Text style={s.modalTitle}>
                                    Что такое Черные списки банков?
                                </Text>
                                <Text style={s.modalText}>
                                    Это список неблагонадежных клиентов.{'\n'}{'\n'}  
                                    К этой категории относятся:{'\n'}{'\n'}  
                                    - заёмщики, которые ранее предоставляли недостоверную информацию;{'\n'} 
                                    - нарушители закона или договора с банком;{'\n'} 
                                    - неблагонадежные, по мнению конкретной кредитной организации, клиенты и т. д.{'\n'}{'\n'} 
                                    Касается это как граждан, так и организаций.
                                </Text>
                                <PrimaryButton 
                                    title='Понятно'
                                    style={s.modalResumeBtn}
                                    onPress={() => setModalContent({})}
                                />
                            </View>
                        )}
                    >
                        <Text>
                            Что такое Черные списки банков?
                        </Text>
                    </TouchableOpacity>
                    <Separator style={{ marginVertical: 8 }}/>
                    <View style={s.section}>
                        <Text style={s.title}>
                            Уголовные и Административные правонарушения
                        </Text>
                        {
                            proceedings.hasCriminalFactors
                            ?
                                <FailLine title={'Найдены данные о судимости'} />
                            :
                                <SuccessLine title={'Не найдены данные о судимости'} />
                        }
                        {
                            proceedings.hasAdministrativeFactores
                            ?
                                <FailLine title={'Найдены данные об административных правонарушениях'} />
                            :
                                <SuccessLine title={'Не найдены данные об административных правонарушениях'} />
                        }
                        {
                            proceedings.hasSDAFactores
                            ?
                                <FailLine title={'Найдены данные о нарушении ПДД'} />
                            :
                                <SuccessLine title={'Не найдены данные о нарушении ПДД'} />
                        }
                    </View>
                    <TouchableOpacity 
                        style={s.greyPanel}
                        onPress={() => setModalContent(
                            <View style={[s.modalContent, { paddingBottom: 0 }]}>
                                <View>
                                    <Text style={[s.modalTitle, { marginBottom: 20 }]}>
                                        Найдены уголовные правонарушения?
                                    </Text>
                                    <ScrollView style={{ maxHeight: '79%' }}>
                                        <TouchableOpacity>
                                            <Text style={[s.modalText, { marginBottom: 0 }]}>
                                                Найденые данные о судимости означают, что водитель привлекался и/или был осужден по одной или нескольким статьям уголовного кодекса РФ кроме статей от 158 по 168 включительно (Глава 21 Преступления против собственности).{'\n'}{'\n'}                           
                                                Если водитель привлекался и/или был осужден по одной или нескольким статьям уголовного кодекса РФ: Глава 21 Преступления против собственности (статьи от 158 по 168 включительно), то он не допускается до бронирования автомобилей на Getaren{'\n'}{'\n'}
                                            </Text>
                                        </TouchableOpacity>
                                        <PrimaryButton 
                                            title='Понятно'
                                            style={[s.modalResumeBtn, { marginBottom: 30 }]}
                                            onPress={() => setModalContent({})}
                                        />
                                    </ScrollView>
                                </View>
                            </View>
                        )}
                    >
                        <Text>
                            Найдены уголовные правонарушения?
                        </Text>
                    </TouchableOpacity>
                    <Separator style={{ marginVertical: 8 }}/>
                    <View style={s.section}>
                        <Text style={s.title}>
                            Черные списки прокатов
                        </Text>
                        {
                            rentalBlackList.isBannedByRentals
                            ?
                                rentalBlackList.factors.map((factor) => 
                                    <>
                                        <FailLine 
                                            title={'Находится в черном списке проката:'} 
                                            subtitleReason={factor.authorName}
                                            subtitleValidity={`С ${convertToDDMMYYYY(factor.created)}`}
                                        />
                                    </>
                                )
                            :
                                <SuccessLine title={'Не числится'} />
                        }
                    </View>
                    <TouchableOpacity 
                        style={[s.greyPanel, { marginBottom: 30 }]}
                        onPress={() => setModalContent(
                            <View style={s.modalContent}>
                                <Text style={s.modalTitle}>
                                    Что такое Черные списки прокатов?
                                </Text>
                                <Text style={s.modalText}>
                                    К данной категории относятся недобросовестные Арендаторы, преступники и мошенники, специализирующиеся на завладении имуществом в салонах проката.
                                </Text>
                                <PrimaryButton 
                                    title='Понятно'
                                    style={s.modalResumeBtn}
                                    onPress={() => setModalContent({})}
                                />
                            </View>
                        )}
                    >
                        <Text>
                            Что такое Черные списки прокатов?
                        </Text>
                    </TouchableOpacity>
                    <PrimaryButton 
                        title='Понятно'
                        style={[s.modalResumeBtn, { marginBottom: 60 }]}
                        onPress={handleClose}
                    />
                </ScrollView>
            )}
            <Modal
                transparent={true}
                animationType="fade"
                visible={Object.keys(modalContent).length !== 0}
            >
                <TouchableOpacity 
                    style={s.modal} 
                    onPressOut={() => setModalContent({})} 
                >
                    <TouchableWithoutFeedback>
                        <View style={s.modalPanel}>
                            <TouchableOpacity 
                                style={s.modalCloseBtn}
                                onPress={() => setModalContent({})}
                            >
                                <CloseIcon width={22} height={22}/>
                            </TouchableOpacity>
                            <FaqImage 
                                width={200} 
                                height={170}
                                style={s.modalImage} 
                            />
                            {modalContent}
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </Modalize>
    );
};

const AccordionWrapper = ({ 
    title,
    children, 
    withAccordion, 
}) => (
    withAccordion
    ?
        <AccordionView 
            title={title} 
            expandedViewStyle={{ marginTop: 4 }}
            titleStyle={[s.lineTitle, { maxWidth: '90%' }]}
        >
            {children}
        </AccordionView>
    :
        <>
            {children}
        </>
);

const SuccessLine = ({ 
    title, 
    style, 
    date,
    amount,
    subtitleReason,  
    accordion = false,
    walletIcon = false,
    creditIcon = false,
}) => (
    <View style={[
        s.line,
        subtitleReason && { alignItems: 'left' }, 
        style
    ]}>
        {
            walletIcon
            ?
                <SuccessWalletIcon 
                    width ={22} 
                    height={22} 
                    style={s.lineIcon}
                />
            :
                creditIcon
                ?
                    <CreditWalletIcon
                        width ={22} 
                        height={22} 
                        style={s.lineIcon}
                    />
                :
                    <SuccessIcon 
                        width ={22} 
                        height={22} 
                        style={s.lineIcon}
                    />
        }
        <View style={{ flexShrink: 1 }}>
            <AccordionWrapper
                title={title}
                withAccordion={accordion}
            >
                {
                    !accordion
                    &&
                        <Text style={[
                            s.lineTitle,
                            (subtitleReason || date) && { marginBottom: 4 }
                        ]}>
                            {title}
                        </Text>
                }
                {
                    date
                    &&
                        <Text style={[
                            s.lineTitle,
                            subtitleReason && { marginBottom: 4 }
                        ]}>
                            {date} на сумму <Text style={s.bold}>{formatPrice(amount)}</Text>
                        </Text>
                }
                {
                    subtitleReason
                    &&
                        <Text style={[s.subtitle, s.greyText]}>
                            {subtitleReason}
                        </Text>
                }
            </AccordionWrapper>
        </View>
    </View>
);

const FailLine = ({ 
    title, 
    style, 
    date,
    amount,
    subtitleReason, 
    subtitleValidity,
    subtitleAttention,
    accordion = false,
    walletIcon = false,
}) => (
    <View style={[
        s.line, 
        subtitleReason && { alignItems: 'left' },
        style
    ]}>
        {
            walletIcon
            ?
                <FailWalletIcon 
                    width ={22} 
                    height={22} 
                    style={s.lineIcon}
                />
            :
                <FailIcon 
                    width ={22} 
                    height={22} 
                    style={s.lineIcon}
                />
        }
        <View style={{ flexShrink: 1 }}>
            <AccordionWrapper
                title={title}
                withAccordion={accordion}
            >
                {
                    !accordion
                    &&
                        <Text style={[
                            s.lineTitle,
                            (subtitleReason || date) && { marginBottom: 4 }
                        ]}>
                            {title}
                        </Text>
                }
                {
                    date
                    &&
                        <Text style={[
                            s.lineTitle,
                            subtitleReason && { marginBottom: 4 }
                        ]}>
                            c {date} на сумму <Text style={s.bold}>{formatPrice(amount)}</Text>
                        </Text>
                }
                {
                    subtitleReason
                    &&
                        <Text style={[s.subtitle, s.greyText]}>
                            {subtitleReason}
                        </Text>
                }
                {
                    subtitleReason && subtitleValidity
                    &&
                        <Text style={[s.greyText, { marginBottom: 4 }]}>
                            {subtitleValidity}
                        </Text>
                }
                {
                    subtitleAttention
                    &&
                        <Text style={[s.greyText, { marginBottom: 4 }]}>
                            {subtitleAttention}
                        </Text>
                }
            </AccordionWrapper>
        </View>
    </View>
);

export default DriverReport;



export const getRegistrationInfo = (registrationDate) => {

    const currentDate = new Date();
    const diffInMilliseconds = currentDate - new Date(registrationDate);
  
    const millisecondsInMinute = 60 * 1000;
    const millisecondsInHour = 60 * millisecondsInMinute;
    const millisecondsInDay = 24 * millisecondsInHour;
    const millisecondsInMonth = 30.44 * millisecondsInDay;
  
    let formattedTime = '';

    // Function to handle plural forms
    const declension = (number, titles) => {
        const cases = [2, 0, 1, 1, 1, 2];
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[Math.min(number % 10, 5)]];
    }
  
    if (diffInMilliseconds < millisecondsInMinute) {
      formattedTime = 'менее минуты назад';
    } else if (diffInMilliseconds < millisecondsInHour) {
      const minutes = Math.floor(diffInMilliseconds / millisecondsInMinute);
      formattedTime = `${minutes} ${declension(minutes, ['минута', 'минуты', 'минут'])} назад`;
    } else if (diffInMilliseconds < millisecondsInDay) {
      const hours = Math.floor(diffInMilliseconds / millisecondsInHour);
      formattedTime = `${hours} ${declension(hours, ['час', 'часа', 'часов'])} назад`;
    } else if (diffInMilliseconds < millisecondsInMonth) {
      const days = Math.floor(diffInMilliseconds / millisecondsInDay);
      formattedTime = `${days} ${declension(days, ['день', 'дня', 'дней'])} назад`;
    } else {
      const months = Math.floor(diffInMilliseconds / millisecondsInMonth);
      formattedTime = `${months} ${declension(months, ['месяц', 'месяца', 'месяцев'])} назад`;
    };

    return formattedTime;
};
