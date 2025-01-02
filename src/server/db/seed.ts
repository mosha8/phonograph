import { hashPassword } from '@lib/index';
import { PrismaClient } from '@prisma/client';
import { seed } from '@prisma/client/sql';

const seedDb = async () => {
  try {
    const prisma = new PrismaClient();

    // run seed sql
    await prisma.$queryRawTyped(seed());
    // add user accounts for development environment.
    const roleAdmin = await prisma.role.findUnique({
      where: { name: 'admin' },
    });
    const roleViewer = await prisma.role.findUnique({
      where: { name: 'viewer' },
    });
    if (roleAdmin) {
      await prisma.user.create({
        data: {
          email: 'jojo@mail.com',
          username: 'jojo',
          password: await hashPassword('password'),
          roleId: String(roleAdmin.id),
        },
      });
    }
    if (roleViewer) {
      await prisma.user.create({
        data: {
          email: 'coco@mail.com',
          username: 'coco',
          password: await hashPassword('password'),
          roleId: String(roleViewer.id),
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
};

seedDb().catch((reason) => {
  console.error('Seeding failed: ', reason);
});
