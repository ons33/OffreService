import mongoose from 'mongoose';

const OffreEmploiSchema = new mongoose.Schema({
  intitule: { type: String, required: true },
  typeOffre: { type: String, required: true },
  description: { type: String, required: true },
  workplaceType: { type: String, required: true },
  entrepriseNom: { type: String, required: true },
  salaire: { type: Number, required: true },
  photo: { type: String, required: false },
  userId: { type: String, required: false },
  tags: [String],
  skills: [String],
  createdAt: { type: Date, default: Date.now }, 
});

const OffreEmploi = mongoose.model('OffreEmploi', OffreEmploiSchema);

export default OffreEmploi;
