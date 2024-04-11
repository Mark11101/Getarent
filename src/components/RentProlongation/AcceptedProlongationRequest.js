import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { StyleSheet, Text, View } from "react-native";
import theme from "theme";
import Icon from "../Icon";
import { ru } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";

const AcceptedProlongationRequest = ({
                                       timeZone,
                                     }) => {
  const {
    rent: {
      lastProlongationRequest,
      ...rent
    } = {}
  } = useSelector(st => st.rentRoom);

  return (
    <View style={styles.container}>
      <View style={styles.wrap}>
        <Text style={styles.title}>
          Ваша аренда продлена
        </Text>
        <View style={styles.prolongationTo}>
          <Icon
            name={"calendar"}
            style={styles.prolongationTo.calendarIcon}
          />
          <Text>
            {"До "}
            {formatInTimeZone(
              new Date(rent.endDate),
              timeZone,
              "dd MMMM, HH:mm",
              {
                locale: ru,
              },
            )}
          </Text>
        </View>
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
  prolongationTo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",

    marginTop: theme.spacing(1),

    calendarIcon: {
      marginRight: theme.spacing(1.5),
    },
    text: {
      ...theme.styles.src.P2,
    },
  },
});

export default AcceptedProlongationRequest;
