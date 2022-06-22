import { Type } from "class-transformer";
import { IsInt, IsPositive } from "class-validator";
import { BodyRequest } from "@/types/requests";

export default class CreatePaymentIntentPayload implements BodyRequest {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  amount: number;
  orderId: number;
}
