const express = require('express');
const Contract = require('../models/Contract');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's contracts
router.get('/user/:userId', async (req, res) => {
  try {
    const contracts = await Contract.find({
      $or: [
        { client: req.params.userId },
        { freelancer: req.params.userId }
      ]
    })
      .populate('project', 'title description')
      .populate('client', 'username profile')
      .populate('freelancer', 'username profile')
      .sort({ createdAt: -1 });

    res.json(contracts);
  } catch (error) {
    console.error('Get contracts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single contract
router.get('/:id', async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('project', 'title description')
      .populate('client', 'username profile')
      .populate('freelancer', 'username profile');

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    res.json(contract);
  } catch (error) {
    console.error('Get contract error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update milestone status
router.put('/:id/milestone/:milestoneId', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Check if user is authorized
    if (contract.client.toString() !== req.userId && 
        contract.freelancer.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this contract' });
    }

    const milestone = contract.milestones.id(req.params.milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    milestone.status = status;
    if (status === 'completed') {
      milestone.completedAt = new Date();
    }

    await contract.save();

    res.json({
      message: 'Milestone updated successfully',
      contract
    });
  } catch (error) {
    console.error('Update milestone error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete contract
router.put('/:id/complete', auth, async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    if (contract.client.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only client can complete the contract' });
    }

    contract.status = 'completed';
    contract.endDate = new Date();

    // Update project status
    await Project.findByIdAndUpdate(contract.project, { status: 'completed' });

    await contract.save();

    res.json({
      message: 'Contract completed successfully',
      contract
    });
  } catch (error) {
    console.error('Complete contract error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



