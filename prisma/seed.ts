import { PrismaClient } from "@prisma/client";
import employees from "./data/employees";
import roles from "./data/roles";

const prisma = new PrismaClient();

async function load() {
  await prisma.$transaction(
    roles.map(role =>
      prisma.role.upsert({
        where: { id: role.id },
        update: {
          name: role.name
        },
        create: role
      })
    )
  );

  await prisma.$transaction(
    employees.map(employee =>
      prisma.employee.upsert({
        where: { pin: employee.pin },
        update: employee,
        create: employee
      })
    )
  );
}

load()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seeded data!')
    prisma.$disconnect();
  });
