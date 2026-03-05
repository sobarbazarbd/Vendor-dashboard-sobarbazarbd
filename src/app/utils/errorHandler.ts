export const GetErrorMassage = (error: any): string => {
  const details = error?.error?.data?.details;
  const rawMessage = error?.error?.data?.message;
  // If backend sends {detail: "..."} at top level, use it
  const topLevelDetail = error?.error?.data?.detail;
  const message =
    typeof rawMessage === "string"
      ? rawMessage
      : typeof topLevelDetail === "string"
      ? topLevelDetail
      : rawMessage;

  // Handle array of messages
  if (Array.isArray(message)) {
    return message
      .map((msg: any) => {
        if (msg.comment && Array.isArray(msg.comment)) {
          return `Comment: ${msg.comment.join(", ")}`;
        }
        return `Error: ${JSON.stringify(msg)}`;
      })
      .join(", ");
  }

  // Handle object-based validation errors
  if (details && typeof details === "object") {
    return Object.entries(details)
      .map(([field, msgs]) => {
        const messageText = Array.isArray(msgs) ? msgs.join(", ") : msgs;
        return `${field.split("_").join(" ")}: ${messageText}`;
      })
      .join(" | ");
  }

  // Fallback to message or generic error
  return typeof message === "string"
    ? message
    : "An unexpected error occurred.";
};

// export const GetErrorMassage = (error: any): string => {
//   // First, check if there are validation messages in the 'message' array

//   console.log(
//     error.error?.data?.details,
//     "errorerrorerrorerrorerrorerrorerrorerrorerrorerrorerrorerrorerror"
//   );

//   if (error.error?.data?.message && Array.isArray(error.error.data.message)) {
//     const messageArray = error.error.data.message;

//     // Map over the message array and return the error details
//     return messageArray
//       .map((msg: any) => {
//         // If there's a 'comment' field, display its error message
//         if (msg.comment && Array.isArray(msg.comment)) {
//           return `Comment: ${msg.comment.join(", ")}`;
//         }
//         // Handle other fields or just return the message
//         return `Error: ${JSON.stringify(msg)}`;
//       })
//       .join(", "); // Join all the errors into a single string if there are multiple messages
//   }

//   // Check if there are validation details for specific fields
//   if (error.error?.data?.details) {
//     const details = error.error.data.details;

//     // Check if the error is related to the 'comment' field and return the error message
//     if (details.comment && Array.isArray(details.comment)) {
//       return `Comment: ${details.comment.join(", ")}`; // Handling array of errors
//     }

//     // Check other fields if needed
//     const firstKey = Object.keys(details)[0];
//     return `${firstKey.split("_").join(" ")}: ${details[firstKey][0]}`;
//   }

//   // Return a generic error message if no specific error details are found
//   return error.error?.data?.message || "An unexpected error occurred.";
// };
