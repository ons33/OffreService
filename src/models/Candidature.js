import mongoose from 'mongoose';

const CandidatureSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  email: { type: String, required: false }, // Add the email field
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OffreEmploi',
    required: true,
  },
  statut: {
    type: String,
    enum: ['En cours', 'Accepter', 'Rejeter'],
    default: 'En cours',
  },
  createdAt: { type: Date, default: Date.now },
});

const Candidature = mongoose.model('Candidature', CandidatureSchema);

export default Candidature;
