import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Text, TouchableOpacity, View } from "react-native";

import api from "api";
import actions from "actions";
import Waiter from "../Waiter";
import NewCardIcon from "img/new-card.svg";
import ExistingCardIcon from "img/existing-card.svg";
import { trackPaymentCardDetached } from '../../myTrackerService';
import s from "./styles";

const PaymentCard = ({ stage = 'ACCOUNT', rentId }) => {
    const dispatch = useDispatch();
    const { paymentCard, waiter } = useSelector(({ payment }) => payment);
    const { pan } = paymentCard || {};

    const handleAttachNewCard = () => {
        dispatch(actions.attachBankCard(stage, rentId));
    };

    const handleCardDetach = () => {
        Alert.alert(
          'Платежные данные',
          `Вы уверены что хотите отвязать банковскую карту **** **** ${pan.slice(-4)} ?`,
          [
              {
                  text: 'Отвязать',
                  onPress() {
                    dispatch(actions.detachBankCard());
                    trackPaymentCardDetached();
                  },
                  style: 'destructive',
              },
              { text: 'Отмена' },
          ],
          {
              cancelable: true,
          }
        );
    };

    return (
        <>
            {
                paymentCard && Object.keys(paymentCard).length !== 0
                  ? (
                    <View style={s.existingCard}>
                        {
                          stage !== "CHECKOUT"
                          &&
                          <TouchableOpacity
                            style={s.deleteButton}
                            onPress={handleCardDetach}
                          >
                              <Text style={s.deleteButtonText}>
                                  x
                              </Text>
                          </TouchableOpacity>
                        }
                        <ExistingCardIcon
                          width={16}
                          height={12}
                          style={s.existingCardImg}
                        />
                        <Text style={s.existingCardText}>
                            {`**** **** ${pan.slice(-4)}`}
                        </Text>
                    </View>
                  )
                  : (
                    <TouchableOpacity
                      style={s.newCard}
                      onPress={handleAttachNewCard}
                    >
                        {
                            waiter
                              ?
                              <View style={{ padding: 12, marginBottom: 2, top: -3 }}>
                                  <Waiter size="small" />
                              </View>
                              :
                              <NewCardIcon
                                width={16}
                                height={16}
                                style={s.newCardImg}
                              />
                        }
                        <Text style={s.newCardText}>
                            Новая карта
                        </Text>
                    </TouchableOpacity>
                  )
            }
        </>
    )
};

export default PaymentCard;
