const mongoose = require('mongoose');

async function connectToDatabase(MDV_SRV) {
    try {
        await mongoose.connect(MDB_SRV);
        console.log('Connected to MongoDB');
    } catch (e) {
        console.error('Error connecting to MongoDB:', e);  
        process.exit(1);
    }
}

module.exports = connectToDatabase;