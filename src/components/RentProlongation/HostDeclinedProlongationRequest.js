import React, { memo } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { StyleSheet, Text, View } from "react-native";
import theme from "theme";
import Icon from "../Icon";
import { ru } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";

const HostDeclinedProlongationRequest = ({
                                           timeZone
                                         }) => {
  const {
    rent: {
      lastProlongationRequest,
      ...rent
    } = {},
  } = useSelector(st => st.rentRoom, shallowEqual);

  return (
    <View style={styles.container}>
      <View style={styles.wrap}>
        <Text style={styles.title}>
          Хозяин автомобиля отказал
          в продление аренды
        </Text>

        <View style={styles.dates}>
          <Icon name={"calendar"} style={{
            marginTop: theme.spacing(1.25),
          }} />
          <Text style={styles.dates.text}>
            <Text>Продление: </Text>
            <Text style={styles.dates.boldText}>
              {formatInTimeZone(
                new Date(rent.startDate),
                timeZone,
                "dd MMMM, HH:mm",
                {
                  locale: ru,
                },
              )}
              <> -&nbsp;</>
              {formatInTimeZone(
                new Date(lastProlongationRequest.dates.endDate),
                timeZone,
                "dd MMMM, HH:mm",
                {
                  locale: ru,
                },
              )}
            </Text>
          </Text>
        </View>

        {lastProlongationRequest.reason && (
          <View>
            <Text style={styles.solutionMessage.title}>
              Причина отказа:
            </Text>

            <Text style={styles.solutionMessage.value}>
              {lastProlongationRequest.reason}
            </Text>
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
  solutionMessage: {
    marginTop: theme.spacing(4),

    title: {
      marginTop: theme.spacing(2),
      fontSize: 16,
    },
    value: {
      ...theme.styles.src.P2,
    },
  },
  dates: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: theme.spacing(4),

    text: {
      marginLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    boldText: {
      ...theme.getFontProps("semibold", 14, 20),
    },
  },
});

export default memo(HostDeclinedProlongationRequest);
