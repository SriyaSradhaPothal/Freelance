const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: ['web-development', 'mobile-development', 'design', 'writing', 'marketing', 'data-science', 'other']
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  budgetType: {
    type: String,
    enum: ['fixed', 'hourly'],
    required: true
  },
  duration: {
    type: String,
    required: true,
    enum: ['less-than-1-week', '1-to-4-weeks', '1-to-3-months', '3-to-6-months', 'more-than-6-months']
  },
  skills: [String],
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  attachments: [String],
  deadline: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', projectSchema);

