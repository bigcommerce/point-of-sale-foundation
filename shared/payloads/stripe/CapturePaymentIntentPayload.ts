import { Type } from "class-transformer";
import { IsString } from "class-validator";
import { BodyRequest } from "@/types/requests";

export default class CapturePaymentIntentPayload implements BodyRequest {
  @Type(() => String)
  @IsString()
  paymentIntentId: string;
}
