import { Type } from "class-transformer";
import {
  IsInt,
  IsPositive,
  IsOptional
} from "class-validator";
import { BodyRequest } from "@/shared/types/requests";

export default class UpdateOrderPayload implements BodyRequest {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  customer_id?: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  status_id?: number;

  @Type(() => String)
  @IsOptional()
  payment_provider_id?: string;
}
