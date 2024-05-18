const { MongoClient } = require('mongodb');
const faker = require('faker');

async function seedDB() {
  const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB URI
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to database');

    const database = client.db('yourDatabaseName'); // Replace with your database name
    const coursesCollection = database.collection('courses');

    // Clear existing data
    await coursesCollection.deleteMany({});
    console.log('Cleared existing data');

    // Generate random courses data
    const courses = [];
    const courseLevels = ['Beginner', 'Intermediate', 'Advanced'];
    const instructors = ['A', 'B', 'C'];
    const imageUrl = 'https://etc.usf.edu/techease/wp-content/uploads/2017/12/daylily-flower-and-buds-100.jpg';

    for (let i = 0; i < 10; i++) { // Adjust the number of documents to be created
      courses.push({
        title: faker.lorem.words(),
        description: faker.lorem.sentence(),
        imageUrl: imageUrl,
        courseLevel: courseLevels[Math.floor(Math.random() * courseLevels.length)],
        instructor: instructors[Math.floor(Math.random() * instructors.length)],
        batchDate: faker.date.future(),
        __v: 0
      });
    }

    // Insert the generated courses data
    const result = await coursesCollection.insertMany(courses);
    console.log('Inserted ${ result.insertedCount } documents into courses collection');

  } finally {
    await client.close();
    console.log('Disconnected from database');
  }
}

seedDB().catch(console.error);