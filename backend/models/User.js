const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  given_name: { type: String },
  family_name: { type: String },
  nickname: { type: String },
  name: { type: String },
  picture: { type: String },
  updated_at: { type: Date },
  email: { type: String, required: true, unique: true },
  email_verified: { type: Boolean },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  
  // Allow multiple subs (Auth0 IDs)
  sub: [{ type: String }]
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('User', userSchema);
