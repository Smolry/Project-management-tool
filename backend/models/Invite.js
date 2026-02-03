const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  expiresAt: {
    type: Date,
    default: () => Date.now() + 1000 * 60 * 60 * 24, // 24 hours
    required: true,
    expires: 0 // TTL index: auto-remove after `expiresAt`
  }
});

module.exports = mongoose.model('Invite', inviteSchema);
