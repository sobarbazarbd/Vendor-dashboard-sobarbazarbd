import { Dispatch } from "@reduxjs/toolkit";
import { ApiResponse } from "./constant";
import { closeModal } from "../features/modalSlice";
import { openNotification } from "../features/notificationSlice";
import { GetErrorMassage } from "./errorHandler";

interface QueryFulfilledResponse<T> {
  data: ApiResponse<T>;
}

interface QueryError {
  error: {
    status: number;
    data: { message: string; success: boolean };
  };
}

export const handleOnQueryStarted = async <T>(
  queryFulfilled: Promise<QueryFulfilledResponse<T>>,
  dispatch: Dispatch
) => {
  try {
    const response = await queryFulfilled;
    dispatch(closeModal());
    const successMsg = response.data.message;
    dispatch(
      openNotification({
        type: "success",
        message:
          typeof successMsg === "string"
            ? successMsg
            : typeof (successMsg as any)?.detail === "string"
            ? (successMsg as any).detail
            : "Operation completed successfully.",
      })
    );
  } catch (err) {
    const error = err as QueryError;
    dispatch(
      openNotification({
        type: "error",
        message: GetErrorMassage(error),
        placement: "bottomLeft",
      })
    );
  }
};
