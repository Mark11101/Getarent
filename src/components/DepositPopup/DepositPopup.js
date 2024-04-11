import React from 'react';
import { Modalize } from 'react-native-modalize';
import { View, Text, Dimensions } from 'react-native';

import s from './styles';

const HEIGHT = Dimensions.get('window').height;

const DepositPopup = ({ modalRef, pledge, rentalAgreement }) => {

    return (
        <Modalize
            ref={modalRef}
            snapPoint={HEIGHT / 1.1}
            modalHeight={HEIGHT / 1.1}
        >
            <View style={s.depositModal}>
                <Text style={s.depositModalText}>
                    Залог передается и возвращается напрямую между участниками аренды.
                    {"\n"}{"\n"}
                    {
                        !!pledge?.pledgeMaxTerm
                        &&
                            <>Максимальный срок удержания залога - {rentalAgreement ? pledge.pledgeMaxTerm : 14} дней</>
                    } 
                    {"\n"}
                </Text>
                <Text style={[s.depositModalText, { fontWeight: 'bold' }]}>
                    Причины, по которым залог может быть не возвращен полностью или частично:
                    {"\n"}
                </Text>
                {
                    rentalAgreement && pledge?.pledgeNoRefundReason
                    ?
                        <Text style={s.depositModalText}>
                            {pledge.pledgeNoRefundReason}
                        </Text>
                    :
                        [
                            {
                                id: '0',
                                title: 'Опоздания, поздний возврат без продления аренды'
                            },
                            {
                                id: '1',
                                title: 'Возврат в грязном виде без купленной услуги “Мойка после аренды”'
                            },
                            {
                                id: '2',
                                title: 'Возврат с меньшим количеством топлива по сравнению с количеством при получении'
                            },
                            {
                                id: '3',
                                title: 'Штрафы ГИБДД, полученные водителем во время аренды'
                            },
                            {
                                id: '4',
                                title: 'Штрафы за парковку, убытки, связанные с возвратом автомобиля со штрафстоянки '
                            },
                            {
                                id: '5',
                                title: 'Утеря / повреждение полиса ОСАГО'
                            },
                            {
                                id: '6',
                                title: 'Нарушение правил пробега (включенных километров в поездку)'
                            },
                            {
                                id: '7',
                                title: 'Превышение скорости свыше 140 км/ч за пределами населённого пункта'
                            },
                            {
                                id: '8',
                                title: 'Превышение скорости 90 км/ч в пределах населенного пункта'
                            },
                            {
                                id: '9',
                                title: 'Нарушение правил географии использования машины'
                            },
                            {
                                id: '10',
                                title: 'Курение в салоне табачных изделий, наркотических веществ, электронных сигарет, кальянов и др.'
                            },
                            {
                                id: '11',
                                title: 'Повреждения кузовных и стеклянных деталей машины'
                            },
                            {
                                id: '12',
                                title: 'Повреждения деталей салона'
                            },
                            {
                                id: '13',
                                title: 'Повреждения деталей багажника'
                            },
                            {
                                id: '14',
                                title: 'Отключение систем трекинга, маяков слежения и другого оборудования'
                            },
                            {
                                id: '15',
                                title: 'Утеря/повреждение дополнительного оборудования, ключей, аптечки, брелоков, комплекта документов, домкрата, баллоного ключа, запасного колеса, огнетушителя, знака аварийной остановки, магнитолы, навигатора, регистратора, детского кресла и другое'
                            },
                            {
                                id: '16',
                                title: 'Утеря / повреждение  напольных ковриков в салоне / багажнике'
                            },
                            {
                                id: '17',
                                title: 'Повреждение обивки салона, крыши'
                            },
                            {
                                id: '18',
                                title: 'Повреждение элементов панорамной крыши'
                            },
                            {
                                id: '19',
                                title: 'Повреждение колес и дисков'
                            },
                            {
                                id: '20',
                                title: 'Передача управления третьим лицам, которые не допущены до управления'
                            },
                            {
                                id: '21',
                                title: 'Эвакуация автомобиля по вине арендатора или при самостоятельном заборе ТС арендодателем'
                            },
                            {
                                id: '22',
                                title: 'Нарушение правил пользования ТС по договору аренды'
                            },
                            {
                                id: '23',
                                title: 'Ущерб, вызванный заправкой топлива автомобиля плохого качества'
                            },
                            {
                                id: '24',
                                title: 'Существенное нарушение Договора аренды'
                            },
                            {
                                id: '25',
                                title: 'Несвоевременная оплата аренды'
                            },
                            {
                                id: '26',
                                title: 'Нарушение правил оформления ДТП в органах МВД'
                            },
                            {
                                id: '27',
                                title: 'Другие финансовые убытки (потери), которые понес арендодатель в результате эксплуатации машины арендатором, возникшие во время аренды'
                            },
                        ].map((reason) => (
                            <Text key={reason.id} style={s.depositModalText}>
                                • {reason.title}
                                {"\n"}
                            </Text>
                        ))
                }
                <Text style={[s.depositModalText, { fontStyle: 'italic', marginTop: 30 }]}>
                    Невозврат залоговой суммы водителю снижает, но не освобождает 
                    полностью от финансовой отвественности водителя в случаях, 
                    когда сумма убытков превышает размер залога.
                </Text>
            </View>
        </Modalize>
    )
};

export default DepositPopup;