
const express = require('express');

const app = express();
const PORT = 3000;

// Middleware to read JSON data
app.use(express.json());

// Initial student records
let students = [
    {
        id: 201,
        rollNumber: "CSE2401",
        name: "Aarav Sharma",
        branch: "CSE",
        semester: 3,
        email: "aarav@example.com"
    },
    {
        id: 202,
        rollNumber: "ECE2402",
        name: "Diya Verma",
        branch: "ECE",
        semester: 3,
        email: "diya@example.com"
    },
    {
        id: 203,
        rollNumber: "CSE2403",
        name: "Kabir Singh",
        branch: "CSE",
        semester: 3,
        email: "kabir@example.com"
    }
];

// Generate unique numeric ID
let nextId = 204;

// Validate student data
function validateStudent(data) {
    const { rollNumber, name, branch, semester, email } = data;

    return (
        typeof rollNumber === 'string' &&
        rollNumber.trim() !== '' &&
        typeof name === 'string' &&
        name.trim() !== '' &&
        typeof branch === 'string' &&
        branch.trim() !== '' &&
        Number.isInteger(semester) &&
        semester > 0 &&
        typeof email === 'string' &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );
}

// 1. GET all students
app.get('/api/students', (req, res) => {
    res.status(200).json(students);
});

// 2. POST a new student
app.post('/api/students', (req, res) => {

    if (!validateStudent(req.body)) {
        return res.status(400).json({
            message: "Invalid input. All fields are required."
        });
    }

    // Check duplicate roll number
    const existingStudent = students.find(
        s => s.rollNumber === req.body.rollNumber.trim()
    );

    if (existingStudent) {
        return res.status(400).json({
            message: "Roll number already exists."
        });
    }

    const newStudent = {
        id: nextId++,
        rollNumber: req.body.rollNumber.trim(),
        name: req.body.name.trim(),
        branch: req.body.branch.trim(),
        semester: req.body.semester,
        email: req.body.email.trim()
    };

    students.push(newStudent);

    res.status(201).json(newStudent);
});

// 3. GET student by ID
app.get('/api/students/:id', (req, res) => {

    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.status(200).json(student);
});

// 4. PUT update student
app.put('/api/students/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    if (!validateStudent(req.body)) {
        return res.status(400).json({
            message: "Invalid input. All fields are required."
        });
    }

    // Check duplicate roll number
    const duplicate = students.find(
        s => s.rollNumber === req.body.rollNumber.trim() && s.id !== id
    );

    if (duplicate) {
        return res.status(400).json({
            message: "Roll number already exists."
        });
    }

    students[index] = {
        id: id,
        rollNumber: req.body.rollNumber.trim(),
        name: req.body.name.trim(),
        branch: req.body.branch.trim(),
        semester: req.body.semester,
        email: req.body.email.trim()
    };

    res.status(200).json(students[index]);
});

// 5. DELETE student
app.delete('/api/students/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    students.splice(index, 1);

    res.status(200).json({
        message: "Student deleted successfully"
    });
});

// 6. Filter students by branch
app.get('/api/students/filter', (req, res) => {

    const branch = req.query.branch;

    if (typeof branch !== 'string' || branch.trim() === '') {
        return res.status(400).json({
            message: "Please provide branch query parameter"
        });
    }

    const filteredStudents = students.filter(
        s => s.branch.toLowerCase() === branch.trim().toLowerCase()
    );

    res.status(200).json(filteredStudents);
});

// Handle invalid JSON requests
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            message: "Invalid JSON format"
        });
    }

    next(err);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
