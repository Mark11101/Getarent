import React from "react";
import { PROLONGATION_STATUS } from "../../constants/prolongation";
import AcceptedProlongationRequest from "./AcceptedProlongationRequest";
import CreateProlongationRequest from "./CreateProlongationRequest";
import ResolveProlongationRequest from "./ResolveProlongationRequest";
import HostDeclinedProlongationRequest from "./HostDeclinedProlongationRequest";
import { shallowEqual, useSelector } from "react-redux";
import { useTimeZone } from "../../hooks/useTimeZone";

const RentProlongation = ({
                            availableForProlongationCreateRequest,
                            pageScrollViewRef,
                            prolongationDateCreate,
                            createProlongationDatePickerModalRef,
                            setProlongationDateCreate,
                            unavailableProlongationDates,
                          }) => {
  const role = useSelector(st => st.profile.role);
  const {
    rent: {
      status,
      lastProlongationRequest,
      carTransferLocation,
    },
  } = useSelector(st => st.rentRoom, shallowEqual);
  const timeZone = useTimeZone(carTransferLocation?.data?.latitude, carTransferLocation?.data?.longitude);

  if (status !== "IN_PROGRESS") {
    return null;
  }

  return (
    <>
      {
        role === "GUEST" &&
        !!lastProlongationRequest
        && lastProlongationRequest.status === PROLONGATION_STATUS.RENT_PROLONGATION_ACCEPTED
          ? <AcceptedProlongationRequest
            timeZone={timeZone}
          />
          : null
      }

      {
        role === "GUEST" &&
        !!lastProlongationRequest
        && lastProlongationRequest.status === PROLONGATION_STATUS.RENT_PROLONGATION_HOST_DECLINED
          ? <HostDeclinedProlongationRequest
            timeZone={timeZone}
          />
          : null
      }

      {
        !!lastProlongationRequest
        && lastProlongationRequest.status === PROLONGATION_STATUS.RENT_PROLONGATION_REQUEST
          ? <ResolveProlongationRequest
            timeZone={timeZone}
          />
          : null
      }

      {
        role === "GUEST" && (
          <CreateProlongationRequest
            availableForProlongationCreateRequest={availableForProlongationCreateRequest}
            prolongationDateCreate={prolongationDateCreate ? new Date(prolongationDateCreate) : null}
            createProlongationDatePickerModalRef={createProlongationDatePickerModalRef}
            setProlongationDateCreate={setProlongationDateCreate}
            pageScrollViewRef={pageScrollViewRef}
            unavailableProlongationDates={unavailableProlongationDates}
            timeZone={timeZone}
          />
        )
      }
    </>
  );
};

export default RentProlongation;
