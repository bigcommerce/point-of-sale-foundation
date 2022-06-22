import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { ParamsRequest } from "@/types/requests";

export class QueryStringRequest implements ParamsRequest {
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  query!: string;
}
