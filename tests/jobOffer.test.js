import request from 'supertest';
import app from '../src/app';
import OffreEmploi from '../src/models/OffreDemploi';

describe('Offre d\'emploi API', () => {
  beforeEach(async () => {
    await OffreEmploi.deleteMany(); // Vider la collection des offres d'emploi avant chaque test
  });

  it('should create a new job offer', async () => {
    const res = await request(app)
      .post('/api/offre/add')
      .send({
        intitule: 'Développeur Full Stack',
        typeOffre: 'CDI',
        description: 'Opportunité passionnante pour un développeur Full Stack!',
        workplaceType: 'Remote',
        entrepriseNom: 'Ma Super Entreprise',
        salaire: 80000,
        photo: 'url_de_la_photo',
        tags: ['développement', 'full-stack'],
        skills: ['Node.js', 'React', 'MongoDB'],
        userId: '12345',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('data');
  });
});
