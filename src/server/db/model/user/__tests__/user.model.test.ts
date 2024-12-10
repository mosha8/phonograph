import { mockPrisma } from '@server/db/prisma/client/__mocks__/prisma-mock';
import userRepository from '../user.model';
describe('User model', () => {
  beforeEach(() => {});
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test to prevent interference
  });
  test('should create a new user', async () => {
    const mockedUser = { email: 'test@email.com', password: 'password' };
    jest.fn(mockPrisma.user.create).mockResolvedValue({
      id: '1',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: '',
      emailVerified: null,
      image: null,
      roleId: null,
      username: '',
      ...mockedUser,
    });
    const result = await userRepository.createUser(mockedUser);
    // expect(result).toContain<User>({ ...mockedUser } as User);
  });
});
