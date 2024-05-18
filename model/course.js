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
module.exports = Course;
