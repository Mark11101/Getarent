import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import actions from '../actions'

export function useTimeZone(latitude, longitude) {
  const [timeZone, setTimeZone] = useState("UTC");
  const dispatch = useDispatch();

  useEffect(() => {
    if (latitude && longitude) {
      (async () => {
        try {
          const response = await fetch(
            `https://timeapi.io/api/TimeZone/coordinate?latitude=${latitude}&longitude=${longitude}`,
          );
          const json = await response.json();
          const tz = json["timeZone"];
          if (tz) {
            setTimeZone(tz);
          } else {
            dispatch(
              actions.error(
                "Не удалось получить часовой пояс. Время отображается в UTC (всемирное координатное время)",
              ),
            );
          }
        } catch (e) {
          dispatch(
            actions.error(
              "Не удалось получить часовой пояс. Время отображается в UTC (всемирное координатное время)",
            ),
          );
        }
      })();
    }
  }, [latitude, longitude, dispatch]);

  return timeZone;
}
