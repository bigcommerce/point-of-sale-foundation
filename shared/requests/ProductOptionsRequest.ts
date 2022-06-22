import { Type } from "class-transformer";
import { IsInt, IsPositive, IsArray, ValidateNested } from "class-validator";
import { BodyRequest } from "@/types/requests";

export class OptionValueId {
  @IsInt()
  @IsPositive()
  optionEntityId: number;

  @IsInt()
  @IsPositive()
  valueEntityId: number;
}

export class ProductOptionsRequest implements BodyRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionValueId)
  optionValueIds: OptionValueId[];
}
