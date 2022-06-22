import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, IsString } from "class-validator";
import { ParamsRequest } from "@/types/requests";

export class PaginatedRequest implements ParamsRequest {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  pageSize!: number;
  @Type(() => String)
  @IsString()
  @IsOptional()
  cursor!: string;
}

export class PaginatedRequestWithId implements ParamsRequest {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  id: number;
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  pageSize!: number;
  @Type(() => String)
  @IsString()
  @IsOptional()
  cursor!: string;
}

export class PaginatedRequestWithCategoryId implements ParamsRequest {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  pageSize!: number;
  @Type(() => String)
  @IsString()
  @IsOptional()
  cursor!: string;
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  categoryId: number;
}
