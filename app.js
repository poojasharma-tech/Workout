document.getElementById('workoutForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const type = document.getElementById('type').value;
  const duration = document.getElementById('duration').value;
  const intensity = document.getElementById('intensity').value;

  const response = await fetch('/api/workouts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ type, duration, intensity })
  });

  const workout = await response.json();
  displayWorkoutHistory();
});

// Toggle Workout History Display
document.getElementById('toggleHistory').addEventListener('click', () => {
  const history = document.getElementById('workoutHistory');
  const historyTitle = document.getElementById('historyTitle');
  
  if (history.style.display === 'none') {
    history.style.display = 'block';
    historyTitle.style.display = 'block';
    displayWorkoutHistory();
  } else {
    history.style.display = 'none';
    historyTitle.style.display = 'none';
  }
});

// Display Workout History
async function displayWorkoutHistory() {
  const response = await fetch('/api/workouts');
  const workouts = await response.json();

  const workoutHistory = document.getElementById('workoutHistory');
  workoutHistory.innerHTML = workouts.map(w => `
    <p>
      ${w.type} - ${w.duration} mins - ${w.intensity} - ${w.caloriesBurned} calories
      <button onclick="deleteWorkout('${w._id}')">Delete</button>
      <button onclick="showEditForm('${w._id}')">Edit</button>
    </p>`).join('');
}

// Delete Workout
async function deleteWorkout(id) {
  await fetch(`/api/workouts/${id}`, { method: 'DELETE' });
  displayWorkoutHistory();
}

// Show Edit Form
function showEditForm(id) {
  const form = document.getElementById('workoutForm');
  
  form.dataset.editingId = id; // Track the workout being edited
  form.querySelector('button[type="submit"]').innerText = 'Update Workout';

  fetch(`/api/workouts/${id}`)
    .then(response => response.json())
    .then(workout => {
      document.getElementById('type').value = workout.type;
      document.getElementById('duration').value = workout.duration;
      document.getElementById('intensity').value = workout.intensity;
    });
}

// Handle Update vs. Add
document.getElementById('workoutForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = e.target.dataset.editingId;
  const type = document.getElementById('type').value;
  const duration = document.getElementById('duration').value;
  const intensity = document.getElementById('intensity').value;

  if (id) {
    // Update Workout
    await fetch(`/api/workouts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, duration, intensity })
    });

    delete e.target.dataset.editingId; // Remove edit mode
    e.target.querySelector('button[type="submit"]').innerText = 'Add Workout';
  } else {
    // Add Workout
    await fetch('/api/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, duration, intensity })
    });
  }
  
  displayWorkoutHistory();
  e.target.reset();
});

displayWorkoutHistory(); // Initial history load
