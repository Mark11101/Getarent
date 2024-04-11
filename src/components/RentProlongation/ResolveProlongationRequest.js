import React, { memo, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { formatInTimeZone } from "date-fns-tz";
import { ru } from "date-fns/locale";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import theme from "theme";
import actions from "actions";
import api from "api";
import { useTimeLeft } from "../../hooks";
import { PROLONGATION_SOLUTION } from "../../constants/prolongation";
import Waiter from "../Waiter";
import Input from "../Input";
import Icon from "../Icon";
import PrimaryButton from "../PrimaryButton";

const RESOLVE_PROLONGATION_STATUS = {
  IDLE: "IDLE",
  LOADING: "LOADING",
  FINISHED: "FINISHED",
  FAILED: "FAILED",
};

const REJECT_PROCESS_STATUS = {
  NOPE: "NOPE",
  SHOWN: "SHOWN",
};

const ResolveProlongationRequest = ({
                                      timeZone
                                    }) => {
  const {
    rent: {
      endDate,
      status,
      finishRentDate,
      lastProlongationRequest,
      id: rentId,
    }
  } = useSelector(st => st.rentRoom, shallowEqual);

  const [rejectProcessStatus, setRejectProcessStatus] = useState(REJECT_PROCESS_STATUS.NOPE);
  const [rejectSolutionMessage, setRejectSolutionMessage] = useState("");
  const [prolongationStatus, setProlongationStatus] = useState(RESOLVE_PROLONGATION_STATUS.IDLE);
  const role = useSelector(st => st.profile.role);
  const dispatch = useDispatch();
  const [, , , refreshTimeLeft] = useTimeLeft(
    endDate,
    status,
    finishRentDate,
  );

  useEffect(() => {
    setProlongationStatus(RESOLVE_PROLONGATION_STATUS.IDLE);
  }, []);

  const {
    dates: {
      endDate: prolongEndDate,
    },
    prolongationRequestId,
  } = lastProlongationRequest;

  const onRequestAccept = async () => {
    Alert.alert(
      "Аренда",
      "Арендатор оплатил продление!",
      [
        { text: "Хорошо" },
      ],
    );

    await setProlongationStatus(RESOLVE_PROLONGATION_STATUS.LOADING);

    try {
      await api.web.resolveRentProlongationRequest({
        rentId,
        solution: PROLONGATION_SOLUTION.HOST_CONFIRM,
        prolongationRequestId,
      });

      await dispatch(actions.rentRoomRequest(rentId, role, true));
      refreshTimeLeft();

      await setProlongationStatus("loaded");
    } catch (e) {
      console.log(e);
      await setProlongationStatus(RESOLVE_PROLONGATION_STATUS.FAILED);

      await dispatch(actions.rentRoomRequest(rentId, role, true));
      refreshTimeLeft();

      Alert.alert(
        "Ошибка",
        "При подтверждение запроса что-то пошло не так... Попробуйте повторить еще раз!",
        [
          { text: "Закрыть" },
        ],
      );
    }
  };

  const onRequestRejectStart = () => {
    setRejectProcessStatus(REJECT_PROCESS_STATUS.SHOWN);
  }

  const onRequestReject = async () => {
    await setProlongationStatus(RESOLVE_PROLONGATION_STATUS.LOADING);

    try {
      await api.web.resolveRentProlongationRequest({
        rentId,
        solution: role === "HOST"
          ? PROLONGATION_SOLUTION.HOST_CANCEL
          : PROLONGATION_SOLUTION.GUEST_CANCEL,
        prolongationRequestId,
        solutionMessage: rejectSolutionMessage,
      });

      await dispatch(actions.rentRoomRequest(rentId, role, true));
      refreshTimeLeft();

      await setProlongationStatus(RESOLVE_PROLONGATION_STATUS.FINISHED);
    } catch ({error}) {
      if (error.code === 106) {
        await dispatch(actions.rentRoomRequest(rentId, role, true));
        refreshTimeLeft();
        await setProlongationStatus(RESOLVE_PROLONGATION_STATUS.FINISHED);

        Alert.alert(
          "Ошибка",
          `Похоже ${role === "HOST" ? "Арендатор отменил" : "Владелец принял/отклонил ваш"} запрос на продление аренды.`,
          [
            { text: "Закрыть" },
          ],
        );
        return;
      }

      await setProlongationStatus(RESOLVE_PROLONGATION_STATUS.FAILED);
      Alert.alert(
        "Ошибка",
        "При отклонение запроса что-то пошло не так... Попробуйте повторить еще раз!",
        [
          { text: "Закрыть" },
        ],
      );
    }
  };

  return (
    <View style={styles.container}>
      {prolongationStatus === RESOLVE_PROLONGATION_STATUS.LOADING && (
        <Waiter style={{
          backgroundColor: "rgba(0,0,0,0.3)",
          zIndex: 1,
        }} />
      )}

      <View style={styles.wrap}>
        <Text style={styles.title}>
          {role === "HOST" ? "Арендатор запрашивает продление" : "Запрос на продление ожидает подтверждения"}
        </Text>

        <View style={styles.dates}>
          <Icon name={"calendar"} style={{
            marginTop: theme.spacing(1.25),
          }} />
          <Text style={styles.dates.text}>
            <Text>Продление до: </Text>
            <Text style={styles.dates.boldText}>
              {formatInTimeZone(
                new Date(prolongEndDate),
                timeZone,
                "dd MMMM, HH:mm",
                {
                  locale: ru,
                },
              )}
            </Text>
          </Text>
        </View>

        {rejectProcessStatus === REJECT_PROCESS_STATUS.SHOWN && (
          <>
            <Input
              placeholder={"Укажите причну отказа"}
              multiline
              inputStyle={styles.textAreaInput}
              onChangeText={setRejectSolutionMessage}
              style={[{ marginBottom: theme.spacing(4) }]}
            />

            <View style={styles.buttonGroup}>
              <PrimaryButton
                title="Отказать"
                style={[styles.buttonInGroup, styles.firstButtonInGroup, styles.buttonCancel]}
                disabled={prolongationStatus === RESOLVE_PROLONGATION_STATUS.FINISHED}
                onPress={onRequestReject}
              />
              <PrimaryButton
                title="Вернуться"
                style={[styles.buttonInGroup, styles.secondButtonInGroup]}
                disabled={prolongationStatus === RESOLVE_PROLONGATION_STATUS.FINISHED}
                onPress={() => {
                  setRejectProcessStatus(REJECT_PROCESS_STATUS.NOPE);
                }}
              />
            </View>
          </>
        )}

        {rejectProcessStatus !== REJECT_PROCESS_STATUS.SHOWN && (
          <View style={styles.buttonGroup}>
            {role === "HOST" && (
              <PrimaryButton
                title="Подтвердить"
                style={[styles.buttonInGroup, styles.firstButtonInGroup]}
                disabled={prolongationStatus === RESOLVE_PROLONGATION_STATUS.FINISHED}
                onPress={onRequestAccept}
              />
            )}

            <PrimaryButton
              title={role === "HOST" ? "Отказать" : "Отменить"}
              style={[styles.buttonInGroup, role === "HOST" ? styles.secondButtonInGroup : null]}
              disabled={prolongationStatus === RESOLVE_PROLONGATION_STATUS.FINISHED}
              onPress={() => {
                if (role === "HOST") {
                  onRequestRejectStart();
                } else {
                  onRequestReject();
                }
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.lightGrey,
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(4),
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
    marginVertical: theme.spacing(4),

    text: {
      marginLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    boldText: {
      ...theme.getFontProps("bold", 14, 20),
    },
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonCancel: {
    backgroundColor: theme.colors.red,
  },
  buttonInGroup: {
    flex: 1,
  },
  rejectContainer: {
    flex: 1,
  },
  textAreaInput: {
    ...theme.styles.P2R,
    height: theme.normalize(120),
    textAlignVertical: 'top',
  },
  firstButtonInGroup: {
    marginRight: theme.spacing(2),
  },
  secondButtonInGroup: {
    marginLeft: theme.spacing(2),
  },
});

export default memo(ResolveProlongationRequest);
