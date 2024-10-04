const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/workoutDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Import Workout model
const Workout = require('./models/workout');

// Create (POST) - Add a new workout
app.post('/api/workouts', async (req, res) => {
  try {
    const { type, duration, intensity } = req.body;
    const caloriesBurned = duration * (intensity === 'High' ? 10 : intensity === 'Medium' ? 7 : 5); // Calorie calculation

    const newWorkout = new Workout({ type, duration, intensity, caloriesBurned });
    await newWorkout.save();
    
    res.status(201).json(newWorkout);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create workout', error });
  }
});

// Read (GET) - Get all workouts
app.get('/api/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch workouts', error });
  }
});

// Read (GET) - Get a single workout by ID
app.get('/api/workouts/:id', async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch workout', error });
  }
});

// Update (PUT) - Update a workout by ID
app.put('/api/workouts/:id', async (req, res) => {
  try {
    const { type, duration, intensity } = req.body;
    const caloriesBurned = duration * (intensity === 'High' ? 10 : intensity === 'Medium' ? 7 : 5); // Calorie calculation

    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id,
      { type, duration, intensity, caloriesBurned },
      { new: true }
    );

    if (!updatedWorkout) return res.status(404).json({ message: 'Workout not found' });
    res.json(updatedWorkout);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update workout', error });
  }
});

// Delete (DELETE) - Delete a workout by ID
app.delete('/api/workouts/:id', async (req, res) => {
  try {
    const deletedWorkout = await Workout.findByIdAndDelete(req.params.id);
    if (!deletedWorkout) return res.status(404).json({ message: 'Workout not found' });
    res.json({ message: 'Workout deleted', deletedWorkout });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete workout', error });
  }
});

// Serve static files (public folder)
app.use(express.static('public'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

