const express = require('express');
const { body, validationResult } = require('express-validator');
const Bid = require('../models/Bid');
const Project = require('../models/Project');
const Contract = require('../models/Contract');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all bids for a project
router.get('/project/:projectId', async (req, res) => {
  try {
    const bids = await Bid.find({ project: req.params.projectId })
      .populate('freelancer', 'username profile')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    console.error('Get bids error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get freelancer's bids
router.get('/freelancer/:freelancerId', async (req, res) => {
  try {
    const bids = await Bid.find({ freelancer: req.params.freelancerId })
      .populate('project', 'title description budget')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    console.error('Get freelancer bids error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create bid
router.post('/', auth, [
  body('project').notEmpty().withMessage('Project ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('proposal').isLength({ min: 10 }).withMessage('Proposal must be at least 10 characters'),
  body('deliveryTime').notEmpty().withMessage('Delivery time is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user is a freelancer
    if (req.role !== 'freelancer') {
      return res.status(403).json({ message: 'Only freelancers can place bids' });
    }

    const { project, amount, proposal, deliveryTime, attachments } = req.body;

    // Check if project exists and is open
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (projectDoc.status !== 'open') {
      return res.status(400).json({ message: 'Project is not open for bidding' });
    }

    // Check if freelancer already bid on this project
    const existingBid = await Bid.findOne({
      project,
      freelancer: req.userId
    });

    if (existingBid) {
      return res.status(400).json({ message: 'You have already placed a bid on this project' });
    }

    const bid = new Bid({
      project,
      freelancer: req.userId,
      amount,
      proposal,
      deliveryTime,
      attachments: attachments || []
    });

    await bid.save();

    const populatedBid = await Bid.findById(bid._id)
      .populate('freelancer', 'username profile')
      .populate('project', 'title description');

    res.status(201).json({
      message: 'Bid placed successfully',
      bid: populatedBid
    });
  } catch (error) {
    console.error('Create bid error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept bid
router.put('/:id/accept', auth, async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id)
      .populate('project')
      .populate('freelancer');

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Check if user is the project owner
    if (bid.project.client.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to accept this bid' });
    }

    if (bid.status !== 'pending') {
      return res.status(400).json({ message: 'Bid has already been processed' });
    }

    // Update bid status
    bid.status = 'accepted';
    await bid.save();

    // Update project status and assign freelancer
    await Project.findByIdAndUpdate(
      bid.project._id,
      { status: 'in-progress', freelancer: bid.freelancer._id },
      { new: true }
    );

    // Create contract
    const contract = new Contract({
      project: bid.project._id,
      client: req.userId,
      freelancer: bid.freelancer._id,
      bid: bid._id,
      amount: bid.amount,
      milestones: [{
        title: 'Project Completion',
        description: 'Complete the project as per requirements',
        amount: bid.amount,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }]
    });

    await contract.save();

    // Reject all other bids for this project
    await Bid.updateMany(
      { 
        project: bid.project._id, 
        _id: { $ne: bid._id },
        status: 'pending'
      },
      { status: 'rejected' }
    );

    res.json({
      message: 'Bid accepted successfully',
      contract
    });
  } catch (error) {
    console.error('Accept bid error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject bid
router.put('/:id/reject', auth, async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id).populate('project');

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    if (bid.project.client.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to reject this bid' });
    }

    if (bid.status !== 'pending') {
      return res.status(400).json({ message: 'Bid has already been processed' });
    }

    bid.status = 'rejected';
    await bid.save();

    res.json({ message: 'Bid rejected successfully' });
  } catch (error) {
    console.error('Reject bid error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



