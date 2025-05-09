document.getElementById('contactForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    purpose: document.getElementById('purpose').value.trim(),
    person_visiting: document.getElementById('person_visiting').value.trim(),
    time_in: document.getElementById('time_in').value,
    time_out: document.getElementById('time_out').value
  };

  try {
    const response = await fetch('/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok) {
      alert('✅ Contact added successfully!');
      document.getElementById('contactForm').reset();
    } else {
      console.error('❌ Server error:', result.message);
      alert('Error: ' + result.message);
    }
  } catch (error) {
    console.error('❌ Network or server error:', error);
    alert('An unexpected error occurred while saving the contact.');
  }
});
