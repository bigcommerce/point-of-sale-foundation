import { Employee } from ".prisma/client";
import { JWT_EXPIRE_HOURS, JWT_SECRET } from "@/constants/common";
import JWT from "jsonwebtoken";

const getAccessToken = (employee: Employee) => {
  const token = JWT.sign({ userId: employee.id }, JWT_SECRET, {
    expiresIn: `${JWT_EXPIRE_HOURS}h`
  });
  return token;
};

export default getAccessToken;
