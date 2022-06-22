import { Type } from "class-transformer";
import { IsInt, IsPositive, Max, Min } from "class-validator";
import { BodyRequest } from "@/types/requests";

export class PinNumberRequest implements BodyRequest {
  @Type(() => Number)
  @IsInt()
  @Min(1000, { message: "pin must be in the range [1000, 9999]" })
  @Max(9999, { message: "pin must be in the range [1000, 9999]" })
  @IsPositive()
  pin!: number;
}
