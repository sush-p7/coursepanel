const mongoose = require('mongoose');
const User = require('./model/admin'); // Adjust the path as necessary

const seedAdmin = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/course', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log('Database connected');

    // Clear existing admin data
    await User.deleteMany({});

    // Create admin user
    const adminUser = new User({
        username: 'admin',
        password: 'admin', // Plain text password for testing
    });

    await adminUser.save();
    console.log('Admin user seeded');

    mongoose.connection.close();
};

seedAdmin().catch(err => console.log(err));