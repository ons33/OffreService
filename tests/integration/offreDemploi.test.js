// tests/integration/offreDemploi.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import OffreEmploi from '../../src/models/OffreDemploi';

describe('Offre d\'emploi API', () => {
  beforeEach(async () => {
    await OffreEmploi.deleteMany();
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
        userId: '12345'
      });
  
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('data');
  }, 10000); // Increase timeout to 10000ms

  it('should get all job offers', async () => {
    await OffreEmploi.create({
      intitule: 'Développeur Full Stack',
      typeOffre: 'CDI',
      description: 'Opportunité passionnante pour un développeur Full Stack!',
      workplaceType: 'Remote',
      entrepriseNom: 'Ma Super Entreprise',
      salaire: 80000,
      photo: 'url_de_la_photo',
      tags: ['développement', 'full-stack'],
      skills: ['Node.js', 'React', 'MongoDB'],
      userId: '12345'
    });

    const res = await request(app).get('/api/offre');
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBe(1);
  });

  it('should get a job offer by ID', async () => {
    const job = await OffreEmploi.create({
      intitule: 'Développeur Full Stack',
      typeOffre: 'CDI',
      description: 'Opportunité passionnante pour un développeur Full Stack!',
      workplaceType: 'Remote',
      entrepriseNom: 'Ma Super Entreprise',
      salaire: 80000,
      photo: 'url_de_la_photo',
      tags: ['développement', 'full-stack'],
      skills: ['Node.js', 'React', 'MongoDB'],
      userId: '12345'
    });

    const res = await request(app).get(`/api/offre/${job._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.intitule).toBe('Développeur Full Stack');
  });

  it('should update a job offer by ID', async () => {
    const job = await OffreEmploi.create({
      intitule: 'Développeur Full Stack',
      typeOffre: 'CDI',
      description: 'Opportunité passionnante pour un développeur Full Stack!',
      workplaceType: 'Remote',
      entrepriseNom: 'Ma Super Entreprise',
      salaire: 80000,
      photo: 'url_de_la_photo',
      tags: ['développement', 'full-stack'],
      skills: ['Node.js', 'React', 'MongoDB'],
      userId: '12345'
    });

    const res = await request(app)
      .put(`/api/offre/${job._id}`)
      .send({
        intitule: 'Développeur Frontend',
        salaire: 90000
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.intitule).toBe('Développeur Frontend');
    expect(res.body.data.salaire).toBe(90000);
  });

  it('should delete a job offer by ID', async () => {
    const job = await OffreEmploi.create({
      intitule: 'Développeur Full Stack',
      typeOffre: 'CDI',
      description: 'Opportunité passionnante pour un développeur Full Stack!',
      workplaceType: 'Remote',
      entrepriseNom: 'Ma Super Entreprise',
      salaire: 80000,
      photo: 'url_de_la_photo',
      tags: ['développement', 'full-stack'],
      skills: ['Node.js', 'React', 'MongoDB'],
      userId: '12345'
    });

    const res = await request(app).delete(`/api/offre/${job._id}`);
    expect(res.statusCode).toEqual(204);
  });

  it('should get job offers by user ID', async () => {
    await OffreEmploi.create({
      intitule: 'Développeur Full Stack',
      typeOffre: 'CDI',
      description: 'Opportunité passionnante pour un développeur Full Stack!',
      workplaceType: 'Remote',
      entrepriseNom: 'Ma Super Entreprise',
      salaire: 80000,
      photo: 'url_de_la_photo',
      tags: ['développement', 'full-stack'],
      skills: ['Node.js', 'React', 'MongoDB'],
      userId: '12345'
    });

    const res = await request(app).get('/api/offre/offre/12345');
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBe(1);
  });
});
