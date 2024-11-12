import { PrismaClient } from '@prisma/client';

class Client {
  private static client: PrismaClient | null = null;

  private Client() {}
  public static getInstance(): PrismaClient {
    if (Client.client === null) {
      Client.client = new PrismaClient();
    }
    return Client.client;
  }
}

const dbClient = Client.getInstance();

export default dbClient;
