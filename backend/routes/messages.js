const express = require('express');
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const router = express.Router();

// Get messages for a project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    // Verify project exists and user is involved
    const projectDoc = await Project.findById(req.params.projectId);
    if (!projectDoc) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (projectDoc.client.toString() !== req.userId &&
        (!projectDoc.freelancer || projectDoc.freelancer.toString() !== req.userId)) {
      return res.status(403).json({ message: 'Not authorized to view messages for this project' });
    }

    const messages = await Message.find({ project: req.params.projectId })
      .populate('sender', 'username profile')
      .populate('receiver', 'username profile')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/', auth, [
  body('project').notEmpty().withMessage('Project ID is required'),
  body('content').notEmpty().withMessage('Message content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { project, content, attachments } = req.body;

    // Verify project exists and user is involved
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (projectDoc.client.toString() !== req.userId &&
        (!projectDoc.freelancer || projectDoc.freelancer.toString() !== req.userId)) {
      return res.status(403).json({ message: 'Not authorized to send messages for this project' });
    }

    // Determine receiver
    let receiver;
    if (projectDoc.client.toString() === req.userId) {
      if (!projectDoc.freelancer) {
        return res.status(400).json({ message: 'Freelancer not assigned to this project yet' });
      }
      receiver = projectDoc.freelancer;
    } else {
      receiver = projectDoc.client;
    }

    const message = new Message({
      sender: req.userId,
      receiver,
      project,
      content,
      attachments: attachments || []
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username profile')
      .populate('receiver', 'username profile');

    res.status(201).json({
      message: 'Message sent successfully',
      data: populatedMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark message as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.receiver.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to mark this message as read' });
    }

    message.isRead = true;
    await message.save();

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Mark message read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



