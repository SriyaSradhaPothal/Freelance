const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Contract = require('../models/Contract');
const auth = require('../middleware/auth');

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { contractId, amount } = req.body;

    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    if (contract.client.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to make payment for this contract' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        contractId: contractId,
        userId: req.userId
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Confirm payment
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    const { contractId, milestoneId, amount } = req.body;

    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    if (contract.client.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to confirm payment for this contract' });
    }

    // Update milestone status
    if (milestoneId) {
      const milestone = contract.milestones.id(milestoneId);
      if (milestone) {
        milestone.status = 'paid';
      }
    }

    // Update contract payment status
    contract.totalPaid += amount;
    if (contract.totalPaid >= contract.amount) {
      contract.paymentStatus = 'completed';
    } else {
      contract.paymentStatus = 'partial';
    }

    await contract.save();

    res.json({
      message: 'Payment confirmed successfully',
      contract
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



