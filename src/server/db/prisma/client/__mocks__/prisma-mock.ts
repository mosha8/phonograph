import type { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';

const mockPrisma = mockDeep<PrismaClient>();
jest.mock('../index.ts', () => ({
  __esModule: true,
  default: mockPrisma,
}));

beforeEach(() => {
  mockReset(mockPrisma);
});

export { mockPrisma };
