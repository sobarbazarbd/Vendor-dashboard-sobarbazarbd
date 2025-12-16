const isDevelopment: boolean = process.env.NODE_ENV === "development";

// const productionUrl: string = "https://api.sms.codecanvascreation.com";
const productionUrl: string = "https://api.hetdcl.com";

const localUrl: string = "https://api.hetdcl.com"; // A

export const baseUrl: string = isDevelopment ? localUrl : productionUrl;

export const TOKEN_NAME: string = "access";
