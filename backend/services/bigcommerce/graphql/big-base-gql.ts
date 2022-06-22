import { BC_CHANNEL_ID, BC_GQL_URL } from "@/constants/big-commerce";
import axios from "axios";
import jwt from "jsonwebtoken";
import BigBaseApi from "../api/big-base-api";

type JwtDataType = {
    expiresAt: Date;
    accessToken: string;
}

export default class BigBaseGql extends BigBaseApi {
    protected jwtData: JwtDataType;
    constructor() {
        super();
        this.jwtData = {
            expiresAt: new Date(0),
            accessToken: '',
        };
    }
    protected async getAccessToken(): Promise<JwtDataType> {
        const now = new Date();
        if (this.jwtData.accessToken && this.jwtData.expiresAt > now) {
            return this.jwtData;
        }

        now.setHours(now.getHours() + 24)
        now.getTime()
        const expiresAt = Math.floor(now.getTime() / 1000)
        const { data }: ApiTokenResponse = await this.client.post('/storefront/api-token', {
            channel_id: parseInt(BC_CHANNEL_ID || '1'),
            expires_at: expiresAt,
            allowed_cors_origins: []
        });
        const { token } = data.data;
        const jwtPayload = jwt.decode(token);
        if (typeof jwtPayload === 'string') {
            // Can't properly decode/validate, just use what's been generated for this instance
            return {
                expiresAt: new Date(),
                accessToken: token,
            }
        }
        this.jwtData = {
            expiresAt: new Date(jwtPayload.eat * 1000),
            accessToken: token,
        };
        return this.jwtData;
    }
  protected async runQuery<T>(query: string, variables: any): Promise<T> {
        const jwtData = await this.getAccessToken();
        const response = await axios.post(BC_GQL_URL, {
            query,
            variables,
        }, {
            headers: {
                'Authorization': `Bearer ${jwtData.accessToken}`
            }
        })
        return response.data
  }
}
