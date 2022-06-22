import { Type } from "class-transformer";
import { IsBoolean, IsNumber } from "class-validator";
import { BodyRequest } from "@/types/requests";

export default class ProductSubConfigPayload implements BodyRequest {
  constructor(str = null) {
    const data = str ? JSON.parse(str) : {};
    this.is_enabled = data?.is_enabled ?? true;
    this.configsCount = data?.configsCount ?? 0;
    this.optionsCount = data?.optionsCount ?? 0;
  }
  @Type(() => Boolean)
  @IsBoolean()
  is_enabled?: boolean;
  @Type(() => Number)
  @IsNumber()
  configsCount?: number;
  @Type(() => Number)
  @IsNumber()
  optionsCount?: number;
}
