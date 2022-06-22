import { IsString, IsNotEmpty, IsIn, IsBoolean, IsInt, IsOptional } from "class-validator";
import CouponAppliesTo from "./CouponAppliesTo";
import { BodyRequest } from "@/types/requests";

export default class CreateCouponPayload implements BodyRequest {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  @IsIn([
    "per_item_discount",
    "per_total_discount",
    "shipping_discount",
    "free_shipping",
    "percentage_discount",
    "promotion"
  ])
  type: string;
  @IsString()
  @IsNotEmpty()
  amount: string;
  @IsString()
  @IsOptional()
  min_purchase: string;
  @IsString()
  @IsOptional()
  expires: string;
  @IsBoolean()
  @IsOptional()
  enabled: boolean;
  @IsString()
  @IsNotEmpty()
  code: string;
  applies_to: CouponAppliesTo;
  @IsInt()
  @IsOptional()
  max_uses: number;
  @IsInt()
  @IsOptional()
  max_uses_per_customer: number;
  @IsString()
  @IsOptional()
  shipping_methods: string[];
}
