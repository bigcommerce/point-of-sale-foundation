import { BC_AUTH_TOKEN, BC_BASE_URL, BC_PAYMENT_URL } from "@/constants/big-commerce";
import { BigClient } from "@/types/big-client";
import axios from "axios";

export default class BigBaseApi {
  protected client: BigClient;
  constructor(version: "v2" | "v3" | "payment" = "v3") {
    this.initBigClient(version);
  }
  protected initBigClient(
    version: "v2" | "v3" | "payment" = "v3",
    paymentAccessToken?: string
  ): void {
    let baseURL: string;
    let headers: any;
    if ("payment" === version) {
      baseURL = BC_PAYMENT_URL;
      headers = {
        Accept: "application/vnd.bc.v1+json",
        Authorization: `PAT ${paymentAccessToken}`
      };
    } else {
      baseURL = BC_BASE_URL + "/" + version;
      headers = { "X-Auth-Token": BC_AUTH_TOKEN };
    }
    this.client = axios.create({ baseURL: baseURL, headers: headers });
  }
}
