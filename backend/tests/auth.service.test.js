const authService = require('../src/services/auth.service');
const prisma = require('../src/config/db');
const bcrypt = require('bcrypt');
const { generateToken } = require('../src/utils/jwt.util');

// Mock des dépendances pour exécuter les tests unitaires en isolation
jest.mock('../src/config/db', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('../src/utils/jwt.util', () => ({
  generateToken: jest.fn(),
}));

describe('Auth Service - Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register()', () => {
    it('devrait inscrire un nouvel utilisateur avec succès et retourner un token', async () => {
      const mockUserData = {
        nom: 'Jean Dupont',
        email: 'jean@example.com',
        mdp: 'password123',
        role: 'APPRENANT',
      };

      const mockCreatedUser = {
        id_user: 1,
        nom: 'Jean Dupont',
        email: 'jean@example.com',
        mdp: 'hashed_password_123',
        role: 'APPRENANT',
      };

      prisma.user.findUnique.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed_password_123');
      prisma.user.create.mockResolvedValue(mockCreatedUser);
      generateToken.mockReturnValue('mocked_jwt_token');

      const result = await authService.register(mockUserData);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'jean@example.com' } });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(prisma.user.create).toHaveBeenCalled();
      expect(result.token).toBe('mocked_jwt_token');
      expect(result.user).not.toHaveProperty('mdp');
      expect(result.user.email).toBe('jean@example.com');
    });

    it('devrait lever une erreur 409 si l\'email est déjà utilisé', async () => {
      prisma.user.findUnique.mockResolvedValue({ id_user: 2, email: 'existant@example.com' });

      await expect(
        authService.register({
          nom: 'Pierre',
          email: 'existant@example.com',
          mdp: 'password123',
          role: 'APPRENANT',
        })
      ).rejects.toThrow('Cet email est déjà utilisé');
    });
  });

  describe('login()', () => {
    it('devrait connecter un utilisateur si le mot de passe est correct', async () => {
      const mockUser = {
        id_user: 1,
        nom: 'Jean Dupont',
        email: 'jean@example.com',
        mdp: 'hashed_password_123',
        role: 'APPRENANT',
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      generateToken.mockReturnValue('mocked_jwt_token');

      const result = await authService.login({ email: 'jean@example.com', mdp: 'password123' });

      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password_123');
      expect(result.token).toBe('mocked_jwt_token');
      expect(result.user).not.toHaveProperty('mdp');
    });

    it('devrait lever une erreur 401 si l\'email n\'existe pas', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'inconnu@example.com', mdp: 'password123' })
      ).rejects.toThrow('Email ou mot de passe incorrect');
    });

    it('devrait lever une erreur 401 si le mot de passe est incorrect', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id_user: 1,
        email: 'jean@example.com',
        mdp: 'hashed_password_123',
      });
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        authService.login({ email: 'jean@example.com', mdp: 'faux_mdp' })
      ).rejects.toThrow('Email ou mot de passe incorrect');
    });
  });
});
