import axios from "axios";

import { appConfig } from "../../config";
import { registerInterceptors } from "./interceptors";

export const httpClient = axios.create({
  baseURL: appConfig.api.baseUrl,
  timeout: appConfig.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

registerInterceptors();