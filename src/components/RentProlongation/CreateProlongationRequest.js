import React, { memo, useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import theme from "theme";
import Icon from "../Icon";
import PrimaryButton from "../PrimaryButton";
import Separator from "../Separator";
import Waiter from "../Waiter";
import PriceRow from "../PriceRow";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { PROLONGATION_STATUS } from "../../constants/prolongation";
import { useTimeLeft } from "../../hooks";
import actions from "actions";
import api from "api";
import { formatInTimeZone, zonedTimeToUtc } from "date-fns-tz";
import { carFeatures } from "data";
import { ERROR_CODES } from "../../errorCodes";

const CREATE_PROLONGATION_STATUS = {
  HIDDEN: "HIDDEN",
  PROCESS: "PROCESS",
  LOADING: "LOADING",
  CALCULATING: "CALCULATING",
  CALCULATED_FAILED: "CALCULATED_FAILED",
  CALCULATED: "CALCULATED",
  FAILED: "FAILED",
  FINISHED: "FINISHED",
};

const CreateProlongationRequest = ({
                                     prolongationDateCreate,
                                     availableForProlongationCreateRequest,
                                     setProlongationDateCreate,
                                     timeZone,
                                     unavailableProlongationDates,
                                     createProlongationDatePickerModalRef,
                                     pageScrollViewRef,
                                   }) => {
  const {
    rent: {
      lastProlongationRequest,
      id: rentId,
      status,
      finishRentDate,
      prolongation,
      ...rent
    } = {},
  } = useSelector(st => st.rentRoom, shallowEqual);
  const role = useSelector(st => st.profile.role);
  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [calculatingInfo, setCalculatingInfo] = useState(null);
  const [createProlongationStatus, setCreateProlongationStatus] = useState(CREATE_PROLONGATION_STATUS.HIDDEN);
  const [, , , refreshTimeLeft] = useTimeLeft(
    rent.endDate,
    status,
    finishRentDate,
  );

  useEffect(() => {
    if (prolongationDateCreate) {
      onCalculating();
    }
  }, [prolongationDateCreate]);

  const onCalculating = useCallback(async () => {
    setError(null);

    if (
      createProlongationStatus === CREATE_PROLONGATION_STATUS.HIDDEN
      || createProlongationStatus === CREATE_PROLONGATION_STATUS.FINISHED
      || createProlongationStatus === CREATE_PROLONGATION_STATUS.LOADING
    ) {
      return;
    }

    setCreateProlongationStatus(CREATE_PROLONGATION_STATUS.CALCULATING);

    try {
      let date = new Date(prolongationDateCreate);
      date = zonedTimeToUtc(date, timeZone);

      const calcInfo = await api.web.calculateRentProlongationRequest({
        rentId,
        dateProlongationTo: date.toISOString(),
      });

      setCalculatingInfo({
        bill: {
          details: calcInfo.guestBill.details.details,
          total: calcInfo.guestBill.details.total,
        },
        dates: calcInfo.dates,
        days: calcInfo.days,
      });
      setCreateProlongationStatus(CREATE_PROLONGATION_STATUS.CALCULATED);
    } catch (e) {
      setError(e?.error);
      console.error(e);
      setCreateProlongationStatus(CREATE_PROLONGATION_STATUS.CALCULATED_FAILED);
    }
  }, [prolongationDateCreate, createProlongationStatus]);

  const closeRequestBox = () => {
    setCreateProlongationStatus(CREATE_PROLONGATION_STATUS.HIDDEN);
    setCalculatingInfo(null);
    setProlongationDateCreate(null);
  };

  const onRequestCreate = useCallback(async () => {
    setError(null);

    if (createProlongationStatus === CREATE_PROLONGATION_STATUS.LOADING) {
      return;
    }

    setCreateProlongationStatus(CREATE_PROLONGATION_STATUS.LOADING);

    try {
      let date = new Date(prolongationDateCreate);
      date = zonedTimeToUtc(date, timeZone);

      await api.web.createRentProlongationRequest({
        rentId,
        dateProlongationTo: date.toISOString(),
      });

      await dispatch(actions.rentRoomRequest(rentId, role, true));
      refreshTimeLeft();

      setCreateProlongationStatus(CREATE_PROLONGATION_STATUS.FINISHED);
      closeRequestBox()
    } catch ({ error }) {
      setCreateProlongationStatus(CREATE_PROLONGATION_STATUS.FAILED);
      console.log(error);
      Alert.alert(
        "Ошибка" + (error.code ? `. Код ${error.code}` : ""),
        ERROR_CODES[error.code] || "При создании запроса что-то пошло не так... Попробуйте повторить еще раз!",
        [
          { text: "Закрыть" },
        ],
      );
    }
  }, [createProlongationStatus, prolongationDateCreate, setCreateProlongationStatus]);

  if (lastProlongationRequest &&
    (
      lastProlongationRequest.status === PROLONGATION_STATUS.RENT_PROLONGATION_HOST_DECLINED ||
      lastProlongationRequest.status === PROLONGATION_STATUS.RENT_PROLONGATION_REQUEST
    )
  ) {
    return null;
  }

  if (!availableForProlongationCreateRequest) {
    return (
      <View style={styles.container}>
        <PrimaryButton
          title={"Продление аренды недоступно"}
          disabled={true}
        />
      </View>
    )
  }

  if (createProlongationStatus === CREATE_PROLONGATION_STATUS.HIDDEN) {
    return (
      <View style={styles.container}>
        <PrimaryButton
          title={unavailableProlongationDates === null ? "..." : "Продлить аренду"}
          onPress={() => {
            setCreateProlongationStatus(CREATE_PROLONGATION_STATUS.PROCESS);
            createProlongationDatePickerModalRef.current?.open();

            const scrollView = pageScrollViewRef.current;
            if (scrollView) {
              scrollView.scrollTo({
                y: 370
              })
            }
          }}
          disabled={unavailableProlongationDates === null}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {createProlongationStatus === CREATE_PROLONGATION_STATUS.LOADING && (
        <Waiter
          style={{
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 1,
          }}
        />
      )}

      <View style={styles.wrap}>
        <Text style={styles.title}>
          Продлить аренду
        </Text>

        <View style={styles.alert}>
          <Icon
            name="info"
            style={styles.alert.icon}
          />

          <Text style={styles.alert.text}>
            Будте внимательны при выборе времени.
            Оплата взимается посуточно, начиная с часа когда вы арендовали авто.
          </Text>
        </View>

        <View style={styles.prolongationDate}>
          {prolongationDateCreate && (
            <View style={styles.prolongationDate.viewTo}>
              <Text style={styles.prolongationDate.viewTo.text}>
                {"Продлить до "}
                <Text
                  style={styles.prolongationDate.viewTo.value}
                >
                  {formatInTimeZone(
                    prolongationDateCreate,
                    Intl.DateTimeFormat().resolvedOptions().timeZone,
                    "dd.MM",
                  )}
                </Text>
              </Text>

              <Text style={styles.prolongationDate.viewTo.value}>
                {formatInTimeZone(
                  prolongationDateCreate,
                  Intl.DateTimeFormat().resolvedOptions().timeZone,
                  "HH:mm",
                )}
              </Text>
            </View>
          )}
          {calculatingInfo && (
            <View style={[styles.prolongationDate.viewTo, {
              marginBottom: theme.spacing(3),
            }]}>
              <Text style={styles.prolongationDate.viewTo.text}>
                Кол-во суток продления:
              </Text>

              <Text style={styles.prolongationDate.viewTo.value}>
                {calculatingInfo.days}
              </Text>
            </View>
          )}

          <PrimaryButton
            style={styles.prolongationDate.button}
            titleStyle={styles.prolongationDate.button.text}
            title={"Выбрать дату и время"}
            onPress={() => {
              createProlongationDatePickerModalRef.current?.open();
            }}
          />
        </View>

        {createProlongationStatus === CREATE_PROLONGATION_STATUS.CALCULATING && (
          <View style={styles.calculatingView}>
            <Waiter
              isFlex={true}
              style={{
                marginTop: theme.spacing(4),
                marginBottom: theme.spacing(1),
              }}
            />
            <Text>
              Расчитываем продление аренды
            </Text>
          </View>
        )}

        {createProlongationStatus === CREATE_PROLONGATION_STATUS.CALCULATED_FAILED && (
          <Text style={{
            marginTop: theme.spacing(3),
            color: theme.colors.red,
            textAlign: "center",
          }}>
            Что то пошло не так при расчете продления. {error?.code ? `Код: ${error?.code}.` : null}
            Попробуйте изменить дату/время или обратиться в тех. поддержку
          </Text>
        )}

        {calculatingInfo?.bill
            ? (
              <View style={{
                marginTop: theme.spacing(4),
              }}>
                <PriceRow
                  titleStyle={[theme.styles.P2R]}
                  title="Стоимость аренды / день"
                  price={calculatingInfo.bill.details.daily.rentPrice}
                />
                {!!calculatingInfo.bill.details.daily.discountedAmount && (
                  <PriceRow
                    titleStyle={[theme.styles.P2R]}
                    title="Скидка за аренду / день"
                    price={"-" + calculatingInfo.bill.details.daily.discountedAmount}
                  />
                )}
                {!!calculatingInfo.bill.details?.daily?.insuranceFee && (
                  <PriceRow
                    titleStyle={[theme.styles.P2R]}
                    price={calculatingInfo.bill.details.daily.insuranceFee}
                    title="Страхование КАСКО / день"
                    onPressPopup={() =>
                      api.navigation.navigate(
                        "InsurancePopup",
                        {
                          price: calculatingInfo.bill.details.daily.insuranceFee,
                        },
                      )
                    }
                  />
                )}
                {!!calculatingInfo.bill.details?.daily?.youngDriverFee && (
                  <PriceRow
                    titleStyle={[theme.styles.P2R]}
                    price={calculatingInfo.bill.details?.daily?.youngDriverFee}
                    title="Повышенный сбор КАСКО / день"
                    onPressPopup={() => api.navigation.navigate("IncreasedFeePopup")}
                  />
                )}
                {!!calculatingInfo.bill.details?.daily?.features &&
                  Object.keys(calculatingInfo.bill.details.daily.features).map(key => {
                    return (
                      <PriceRow
                        key={key}
                        titleStyle={[theme.styles.P2R]}
                        title={carFeatures[key]?.label}
                        price={calculatingInfo.bill.details.daily.features[key]}
                      />
                    );
                  })}
                <PriceRow
                  title="Итого / день"
                  titleStyle={[theme.styles.P1_5]}
                  price={calculatingInfo.bill.details.daily.total}
                />
                <Separator
                  style={[styles.separator, { marginBottom: theme.spacing(3) }]}
                />
                {!!calculatingInfo.bill.details?.wholeRent?.offHoursReturnPrice && (
                  <PriceRow
                    titleStyle={[theme.styles.P2R]}
                    title="Передача / возврат в нерабочее время"
                    price={calculatingInfo.bill.details.wholeRent.offHoursReturnPrice}
                  />
                )}
                {!!calculatingInfo.bill.details?.wholeRent?.afterRentWashingPrice && (
                  <PriceRow
                    titleStyle={[theme.styles.P2R]}
                    title="Мойка после аренды"
                    price={calculatingInfo.bill.details.wholeRent.afterRentWashingPrice}
                  />
                )}
                {calculatingInfo.bill.details?.wholeRent?.fuelCompensationPrice && (
                  <PriceRow
                    titleStyle={[theme.styles.P2R]}
                    title="Возврат с пустым баком"
                    price={calculatingInfo.bill.details.wholeRent.fuelCompensationPrice}
                  />
                )}
                {!!calculatingInfo.bill.details?.wholeRent?.delivery && (
                  <PriceRow
                    titleStyle={[theme.styles.P2R]}
                    title="Доставка"
                    price={calculatingInfo.bill.details.wholeRent.delivery}
                  />
                )}
                {!!calculatingInfo.bill.details?.wholeRent?.serviceFee && (
                  <PriceRow
                    titleStyle={[theme.styles.P2R]}
                    price={calculatingInfo.bill.details.wholeRent.serviceFee}
                    title="Комиссия Getarent"
                  />
                )}
                <PriceRow
                  title="Итого к оплате продления"
                  titleStyle={[theme.styles.P1_22, {
                    fontSize: 16,
                  }]}
                  price={calculatingInfo.bill.total}
                />
                <Separator
                  style={styles.separator}
                />
              </View>
            )
            : null
        }

        {
          calculatingInfo && <PrimaryButton
            style={styles.submitButton}
            title={"Оплатить"}
            onPress={onRequestCreate}
          />
        }

        <PrimaryButton
          outlined={true}
          title={"Отменить"}
          onPress={closeRequestBox}
          style={{
            marginTop: theme.spacing(3),
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(3),
    backgroundColor: theme.colors.lightGrey,
  },
  wrap: {
    display: "flex",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing(4),
    paddingVertical: theme.spacing(4),
  },
  title: {
    ...theme.styles.src.P1_22,
  },
  dates: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: theme.spacing(2),

    text: {
      marginLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },

    bolderText: {
      ...theme.getFontProps("semibold", 14, 20),
    },
  },
  alert: {
    display: "flex",
    flexDirection: "row",
    marginTop: theme.spacing(2),

    icon: {
      marginTop: theme.spacing(1),
    },
    text: {
      paddingLeft: theme.spacing(2),
    },
  },
  prolongationDate: {
    ...theme.styles.src.round,
    marginTop: theme.spacing(2),

    viewTo: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: theme.spacing(1),

      text: {
        ...theme.styles.src.P2,
      },
      value: {
        ...theme.styles.src.P2,
      },
    },

    button: {
      backgroundColor: theme.colors.green,
      height: 35,

      text: {
        fontSize: 13,
      },
    },
  },
  calculatingView: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),

    daysCount: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: theme.spacing(3),
    },
  },
  submitButton: {
    marginTop: theme.spacing(3),
  },
  separator: {
    marginTop: theme.spacing(2),
  },
  extendedPriceRow: {
    width: "105%",
    left: "-2%",
  },
});

export default memo(CreateProlongationRequest);
