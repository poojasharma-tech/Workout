const mongoose = require('mongoose');
const workoutSchema = new mongoose.Schema({
  type: String,
  duration: Number, // in minutes
  intensity: String, // Low, Medium, High
  caloriesBurned: Number,  // You can calculate this later
  // date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Workout', workoutSchema);

