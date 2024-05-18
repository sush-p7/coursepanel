# Course Management System

This is a simple Course Management System built using Node.js, Express, and MongoDB with Mongoose as the ODM (Object Data Modeling) library. This system allows you to manage users, courses, and instructors. Below is a guide to help you set up and run the project.

## Features

- User Authentication
- Course Management (Add, View, Assign Instructors)
- Instructor Management
- Admin Panel for managing the above features

## Prerequisites

- Node.js
- npm (Node Package Manager)
- MongoDB

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/course-management-system.git
   cd course-management-system
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up MongoDB:**

   Make sure MongoDB is running on your system. You can start MongoDB with the default settings or specify a custom URL in the `DB_URL` constant.

4. **Start the server:**

   ```bash
   node app.js
   ```

5. **Access the application:**

   Open your browser and go to `http://localhost:3000`.

## Usage

### Adding a User

To add a user, you can use the following Mongoose model:

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

const newUser = new User({
    username: 'admin',
    password: 'admin'
});

newUser.save()
    .then(() => {
        console.log('User saved successfully');
    })
    .catch(err => {
        console.log('Error saving user, error:', err);
    });

module.exports = User;
```

### Adding a Course

To add a course, you can use the following Mongoose model:

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: String,
    description: String,
    imageUrl: String,
    city: String,
    courseLevel: String,
    instructor: String,
    batchDate: Date
});

const Course = mongoose.model('Course', courseSchema);

const newCourse = new Course({
    title: 'Node.js Basics',
    description: 'Learn the basics of Node.js',
    imageUrl: 'http://example.com/image.jpg',
    city: 'New York',
    courseLevel: 'Beginner',
    instructor: 'John Doe',
    batchDate: new Date()
});

newCourse.save()
    .then(() => {
        console.log('Course saved successfully');
    })
    .catch(err => {
        console.log('Error saving course, error:', err);
    });

module.exports = Course;
```

### Adding an Instructor

To add an instructor, you can use the following Mongoose model:

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const instructorSchema = new Schema({
    name: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Instructor = mongoose.model('Instructor', instructorSchema);

const newInstructor = new Instructor({
    name: 'John Doe',
    rating: 5,
    author: '60d0fe4f5311236168a109ca'  // Replace with a valid User ID
});

newInstructor.save()
    .then(() => {
        console.log('Instructor saved successfully');
    })
    .catch(err => {
        console.log('Error saving instructor, error:', err);
    });

module.exports = Instructor;
```

## Views

### Admin Panel

The admin panel can be accessed at `http://localhost:3000/admin`. It provides functionalities to view and manage users, courses, and instructors.

### Course List

The course list can be accessed at `http://localhost:3000/courses`. It shows a list of all available courses with their details.

### Instructor List

The instructor list can be accessed at `http://localhost:3000/instructors`. It shows a list of all instructors with their details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
## Drive Linkk

https://drive.google.com/drive/folders/1uT8dwAwyRzlTU4LFUGgeXmVpKXUCh5Xs?usp=sharing

Feel free to contribute to this project by opening issues or submitting pull requests. Happy coding!
