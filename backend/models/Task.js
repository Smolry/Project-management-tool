const mongoose = require('mongoose') 
const Schema = mongoose.Schema

const taskSchema = new Schema({
    title: { type: String, required: true },
    status: {
    type: String,
    enum: ['todo', 'iteration' , 'in progress', 'done'],
    default: 'todo'},
    assignedTo: { type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
    project: { type: mongoose.SchemaTypes.ObjectId, ref: 'Project' , required: true}
},{ timestamps: true })

module.exports = mongoose.model('Task', taskSchema)