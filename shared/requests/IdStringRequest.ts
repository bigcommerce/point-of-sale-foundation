import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ParamsRequest } from "@/types/requests";

export class IdStringRequest implements ParamsRequest {
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  id!: string;
}
export class IdNumberRequest implements ParamsRequest {
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  id!: number;
}
