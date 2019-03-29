import mongoose from 'mongoose';

const HomeSchema = mongoose.Schema({
  human_sentence: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Home',HomeSchema);
