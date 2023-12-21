// index.js
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// In-memory database
let users = [];

// CRUD operations

// GET all users
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

// GET user by ID
app.get('/users/:id', (req, res) => {
    const user = users.find((u) => u.id === req.params.id);

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// POST create user
app.post('/users', (req, res) => {
    const { username, age, hobbies } = req.body;

    if (!username || !age || !hobbies) {
        res.status(400).json({ error: 'Username, age, and hobbies are required' });
    } else {
        const newUser = {
            id: generateUniqueId(), // You'll need to implement a function to generate a unique ID (e.g., using uuid)
            username,
            age,
            hobbies,
        };

        users.push(newUser);
        res.status(201).json(newUser);
    }
});

function generateUniqueId() {
    return Date.now().toString();
}

app.put('/users/:id', (req, res) => {
    const userIndex = users.findIndex((u) => u.id === req.params.id);

    if (userIndex !== -1) {
        const { username, age, hobbies } = req.body;

        if (username !== undefined) {
            users[userIndex].username = username;
        }

        if (age !== undefined) {
            users[userIndex].age = age;
        }

        if (hobbies !== undefined) {
            users[userIndex].hobbies = hobbies;
        }

        res.status(200).json(users[userIndex]);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});




// DELETE user by ID
app.delete('/users/:id', (req, res) => {
    const userIndex = users.findIndex((u) => u.id === req.params.id);

    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Handle non-existing endpoints
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Handle server errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


