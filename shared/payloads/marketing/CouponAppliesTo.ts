import { IsString, IsNotEmpty, IsIn } from "class-validator";

export default class CouponAppliesTo {
  @IsString({ each: true })
  ids: string[];
  @IsString()
  @IsNotEmpty()
  @IsIn(["products", "categories"])
  entity: string;
}
