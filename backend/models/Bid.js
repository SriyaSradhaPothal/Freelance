const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  proposal: {
    type: String,
    required: true,
    maxlength: 1000
  },
  deliveryTime: {
    type: String,
    required: true,
    enum: ['less-than-1-week', '1-to-2-weeks', '2-to-4-weeks', '1-to-2-months', 'more-than-2-months']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  attachments: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bid', bidSchema);

