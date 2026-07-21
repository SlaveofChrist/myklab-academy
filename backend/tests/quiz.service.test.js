const quizService = require('../src/services/quiz.service');
const prisma = require('../src/config/db');

jest.mock('../src/config/db', () => ({
  quiz: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  tentativeQuiz: {
    count: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
  },
}));

describe('Quiz Service - Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('soumettreTentative()', () => {
    it('devrait calculer le score et réussir le quiz si la note est suffisante', async () => {
      const mockQuiz = {
        id_quiz: 1,
        titre: 'Quiz Javascript',
        score_min_reussite: 50,
        questions: [
          { id_quest: 1, reponse_correcte: 'Option A' },
          { id_quest: 2, reponse_correcte: 'Option B' },
        ],
      };

      prisma.quiz.findUnique.mockResolvedValue(mockQuiz);
      prisma.tentativeQuiz.count.mockResolvedValue(0); // 0 tentative enregistrée
      prisma.tentativeQuiz.create.mockImplementation(({ data }) => Promise.resolve({ id_tentative: 1, ...data }));

      const reponsesApprenant = [
        { id_quest: 1, reponse: 'Option A' },
        { id_quest: 2, reponse: 'Option B' },
      ];

      const result = await quizService.soumettreTentative(10, 1, reponsesApprenant);

      expect(result.score_obtenu).toBe(100);
      expect(result.est_reussi).toBe(true);
      expect(result.nb_bonnes_reponses).toBe(2);
      expect(prisma.tentativeQuiz.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            apprenant_id: 10,
            quiz_id: 1,
            score_obtenu: 100,
            est_reussi: true,
          },
        })
      );
    });

    it('devrait rejeter la tentative si la limite de 3 essais est atteinte', async () => {
      prisma.quiz.findUnique.mockResolvedValue({ id_quiz: 1, questions: [] });
      prisma.tentativeQuiz.count.mockResolvedValue(3); // 3 tentatives déjà faites !

      await expect(
        quizService.soumettreTentative(10, 1, [{ id_quest: 1, reponse: 'A' }])
      ).rejects.toThrow('Vous avez atteint la limite maximale de 3 tentatives pour ce quiz.');
    });

    it('devrait lever une erreur 404 si le quiz n\'existe pas', async () => {
      prisma.quiz.findUnique.mockResolvedValue(null);

      await expect(
        quizService.soumettreTentative(10, 999, [{ id_quest: 1, reponse: 'A' }])
      ).rejects.toThrow('Quiz introuvable');
    });
  });

  describe('getQuizById()', () => {
    it('devrait retourner le quiz et ses questions', async () => {
      const mockQuiz = { id_quiz: 1, titre: 'Quiz React', questions: [] };
      prisma.quiz.findUnique.mockResolvedValue(mockQuiz);

      const result = await quizService.getQuizById(1);
      expect(result).toEqual(mockQuiz);
    });

    it('devrait lever une erreur 404 si le quiz est introuvable', async () => {
      prisma.quiz.findUnique.mockResolvedValue(null);

      await expect(quizService.getQuizById(99)).rejects.toThrow('Quiz introuvable');
    });
  });
});
