

if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const express = require('express');
const ejsMate = require('ejs-mate');
const bcrypt = require('bcrypt');
const path = require('path');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const moment = require('moment');

// Models
const Course = require('./model/course');
const User = require('./model/admin');

const app = express();

// Middleware to parse request bodies
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies

// Database connection
// const DB_URL = process.env.MONGO_DB_URL
const DB_URL = 'mongodb://127.0.0.1:27017/course';
mongoose.connect(DB_URL).then(() => {
    console.log('Connection established');
}).catch(err => console.log('Error connecting, error:', err));

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

// Set up session
app.use(session({
    secret: 'SecretKey',
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport and use session
app.use(passport.initialize());
app.use(passport.session());

// Set up flash messages
app.use(flash());

// Set up global variables for flash messages
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Passport Local Strategy
// Passport Local Strategy
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username });
            if (!user) {
                console.log('User not found:', username); // Debug statement
                return done(null, false, { message: 'Incorrect username.' });
            }

            // For testing purposes, compare plain text passwords
            if (user.password !== password) {
                console.log('Incorrect password for user:', username); // Debug statement
                return done(null, false, { message: 'Incorrect password.' });
            }

            console.log('User authenticated successfully:', username); // Debug statement
            return done(null, user);
        } catch (err) {
            console.error('Error during authentication:', err); // Debug statement
            return done(err);
        }
    }
));

// Serialize user into the session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in');
        return res.redirect('/admin/login');
    }
    next();
};

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', async (req, res) => {
    const course = await Course.find();
    res.render('index', { course });
});

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/admin/login',
    failureFlash: true
}), (req, res) => {
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

app.get('/admin', isLoggedIn, (req, res) => {
    res.render('adminpanel/panel');
});

app.get('/admin/login', (req, res) => {
    res.render('admin/login');
});

app.get('/admin/teacher', isLoggedIn, (req, res) => {
    res.render('admin/login');
});

app.get('/instructor/panel', isLoggedIn, (req, res) => {
    res.render('instructor/show');
});

app.get('/course', isLoggedIn, async (req, res) => {
    const course = await Course.find();
    res.render('course/show', { course });
});

app.get('/course/add', isLoggedIn, (req, res) => {
    res.render('course/add');
});

app.post('/course', isLoggedIn, async (req, res) => {
    console.log(req.body); // This should now log the parsed body
    const courseData = {
        title: req.body.courseName,
        description: req.body.courseDescription,
        imageUrl: req.body.imageUrl,
        courseLevel: req.body.courseLevel,
        instructor: req.body.instructor,
        batchDate: req.body.batchDate
    };

    //     try {
    //         // Check if instructor is already booked for the same batchDate
    //         const existingCourse = await Course.findOne({
    //             instructor: req.body.instructor,
    //             batchDate: req.body.batchDate
    //         });

    //         if (existingCourse) {
    //             // If the instructor is already booked, send a conflict response
    //             req.flash('error', 'Instructor is already booked for this date');
    //             return res.status(400).redirect('/course/add');
    //         }

    //         // If not, create and save the new course
    //         const course = new Course(courseData);
    //         await course.save();
    //         req.flash('success', 'Course saved successfully');
    //         res.redirect('/course');
    //     } catch (error) {
    //         console.error('Error saving course:', error);
    //         req.flash('error', 'Error saving course');
    //         // res.status(500).redirect('/course/add');
    //         alert("can't add course")
    //     }
    // });
    try {
        // Check if instructor is already booked for the same batchDate
        const existingCourse = await Course.findOne({
            instructor: req.body.instructor,
            batchDate: req.body.batchDate
        });

        if (existingCourse) {
            // If the instructor is already booked, send a conflict response
            return res.status(400).send('Instructor is already booked for this date');
        }

        // If not, create and save the new course
        const course = new Course(courseData);
        await course.save();
        res.send('Course saved successfully');
    } catch (error) {
        console.error('Error saving course:', error);
        res.status(500).send('Error saving course');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Listening on port 3000');
});