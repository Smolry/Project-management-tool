// models/Project.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  type: {
    type: String,
    enum: ['personal', 'team', 'big'],
    required: true
  },
  status: {
    type: String,
    enum: ['not started', 'in progress', 'needs testing', 'failed', 'deployed'],
    default: 'not started'
  },
  githubLink: String,
  deploymentUrl: String,
  environmentNotes: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true })

module.exports = mongoose.model('Project', projectSchema)
