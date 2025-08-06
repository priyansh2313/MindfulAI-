const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Event = require('../models/Event');
const { scheduleCallForEvent, cancelScheduledCall } = require('../services/exotelServices');
const User = require('../models/User');

// Get all events for a family circle
router.get('/events', async (req, res) => {
  try {
    const { familyCircleId } = req.query;
    if (!familyCircleId) {
      return res.status(400).json({ error: 'familyCircleId is required' });
    }
    
    // If familyCircleId is not a valid ObjectId, return empty array
    if (!mongoose.Types.ObjectId.isValid(familyCircleId)) {
      return res.json([]);
    }
    
    const events = await Event.find({ familyCircleId }).sort({ dateTime: 1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Create a new event
router.post('/events', async (req, res) => {
  try {
    const { title, description, dateTime, createdBy, familyCircleId, type } = req.body;
    if (!title || !dateTime || !createdBy || !familyCircleId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // If familyCircleId is not a valid ObjectId, return error
    if (!mongoose.Types.ObjectId.isValid(familyCircleId)) {
      return res.status(400).json({ 
        error: 'Invalid family circle ID. Please join or create a family circle first.' 
      });
    }
    
    const event = await Event.create({ title, description, dateTime, createdBy, familyCircleId, type });
    
    // Schedule a call to the elder 20 minutes before the event
    try {
      // Get the elder's phone number (assuming the event creator is the elder)
      const elder = await User.findById(createdBy);
      if (elder && elder.phone) {
        scheduleCallForEvent(
          event._id.toString(),
          elder.phone,
          title,
          new Date(dateTime)
        );
        console.log(`Call scheduled for elder ${elder.name} for event: ${title}`);
      } else {
        console.log('Elder phone number not found, skipping call scheduling');
      }
    } catch (error) {
      console.error('Error scheduling call:', error);
      // Don't fail the event creation if call scheduling fails
    }
    
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update an event
router.put('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const event = await Event.findByIdAndUpdate(id, update, { new: true });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete an event
router.delete('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    
    // Cancel the scheduled call when event is deleted
    cancelScheduledCall(id);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;