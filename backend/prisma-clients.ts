import { prismaClient } from "./prisma";
export const {
  employee: employeeClient,
  role: roleClient,
  settings: settingsClient
} = prismaClient;
