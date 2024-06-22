import JobApplication from '../models/Candidature.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'ons.benamorr@gmail.com',
    pass: 'balj ctus kuar ivbm',
  },
});

// Function to send email
const sendEmail = (to, subject, html) => {
  const mailOptions = {
    from: 'ons.benamorr@gmail.com',
    to,
    subject,
    html
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Email templates
const getAcceptanceEmailTemplate = (firstName, jobTitle, entrepriseNom) => {
  return `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <p>Bonjour ,</p>
      <p>Nous sommes ravis de vous informer que votre candidature au poste de <strong>${jobTitle}</strong> a été acceptée.</p>
      <p>Félicitations et bienvenue dans notre équipe !</p>
      <p>Veuillez attendre un email avec la date de votre entretien.</p>
      <p>Cordialement,</p>
      <p>L'équipe de recrutement de ${entrepriseNom}</p>
    </div>
  `;
};

const getRejectionEmailTemplate = (firstName, jobTitle, entrepriseNom) => {
  return `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <p>Bonjour,</p>
      <p>Nous vous remercions de votre candidature au poste de <strong>${jobTitle}</strong>.</p>
      <p>Nous avons étudié votre dossier avec la plus grande attention. Cependant, d'autres candidats nous ont paru avoir un profil plus adapté au poste proposé.</p>
      <p>Pour rester en contact, vous pouvez consulter nos nouvelles offres pour notre entreprise ${entrepriseNom} sur Espritook.</p>
      <p>A bientôt.</p>
    </div>
  `;
};

// Controller functions
export const creerCandidatureEmploi = async (req, res) => {
  try {
    const { userId, email, jobId } = req.body;
    const candidatureEmploi = new JobApplication({
      userId,
      email,
      jobId,
    });
    await candidatureEmploi.save();
    res.status(201).json(candidatureEmploi);
  } catch (error) {
    console.error('Erreur lors de la création de la candidature à un emploi :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

export const obtenirToutesCandidaturesEmploi = async (req, res) => {
  try {
    const candidaturesEmploi = await JobApplication.find().populate('jobId', 'intitule entrepriseNom');
    res.json(candidaturesEmploi);
  } catch (error) {
    console.error('Erreur lors de la récupération des candidatures à un emploi :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

export const obtenirCandidatureEmploiParId = async (req, res) => {
  try {
    const candidatureId = req.params.id;
    const candidatureEmploi = await JobApplication.findById(candidatureId).populate('jobId', 'intitule entrepriseNom');
    if (!candidatureEmploi) {
      return res.status(404).json({ message: 'Candidature à un emploi non trouvée' });
    }
    res.json(candidatureEmploi);
  } catch (error) {
    console.error('Erreur lors de la récupération de la candidature à un emploi par ID :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

export const updateJobApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus } = req.body;
    const updatedApplication = await JobApplication.findByIdAndUpdate(
      id,
      { statut: newStatus },
      { new: true }
    ).populate('jobId', 'intitule entrepriseNom');

    if (!updatedApplication) {
      return res.status(404).json({ message: 'Candidature à un emploi non trouvée' });
    }

    const firstName = updatedApplication.userId; // Assuming userId is the first name, change this if necessary
    const jobTitle = updatedApplication.jobId.intitule;
    const entrepriseNom = updatedApplication.jobId.entrepriseNom;

    if (newStatus === 'Accepter') {
      const html = getAcceptanceEmailTemplate(firstName, jobTitle, entrepriseNom);
      sendEmail(updatedApplication.email, 'Candidature Acceptée', html);
    } else if (newStatus === 'Rejeter') {
      const html = getRejectionEmailTemplate(firstName, jobTitle, entrepriseNom);
      sendEmail(updatedApplication.email, 'Candidature Rejetée', html);
    }

    res.json(updatedApplication);
  } catch (error) {
    console.error('Error updating job application status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getCandidaturesByJobId = async (req, res) => {
  try {
    const { jobId } = req.params;
    const candidatures = await JobApplication.find({ jobId }).populate('jobId', 'intitule entrepriseNom');
    res.json(candidatures);
  } catch (error) {
    console.error('Error getting candidatures by job ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const compterCandidaturesParJobId = async (req, res) => {
  try {
    const { jobId } = req.params;
    const count = await JobApplication.countDocuments({ jobId });
    res.json({ count });
  } catch (error) {
    console.error('Erreur lors du comptage des candidatures à un emploi :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};