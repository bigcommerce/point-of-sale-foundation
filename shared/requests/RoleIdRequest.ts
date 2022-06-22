import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { BodyRequest } from "@/types/requests";

export class RoleStringRequest implements BodyRequest {
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  roleId!: string;
}
