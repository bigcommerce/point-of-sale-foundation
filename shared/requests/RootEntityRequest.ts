import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";
import { ParamsRequest } from "@/types/requests";

export class RootEntityRequest implements ParamsRequest {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  rootEntityId!: number;
}
