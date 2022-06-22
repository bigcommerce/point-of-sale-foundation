import { Type } from "class-transformer";
import { IsInt, IsPositive, Max, Min, IsOptional, IsString } from "class-validator";
import { BodyRequest } from "@/types/requests";

export default class UpdateEmployeePayload implements BodyRequest {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(1000, { message: "pin must be in the range [1000, 9999]" })
  @Max(9999, { message: "pin must be in the range [1000, 9999]" })
  @IsPositive()
  pin: number;

  @Type(() => String)
  @IsOptional()
  @IsString()
  roleId: string;

  @Type(() => String)
  @IsOptional()
  @IsString()
  firstName: string;

  @Type(() => String)
  @IsOptional()
  @IsString()
  lastName: string;
}
