const mongoose = require('mongoose');
const connectDB = async () => {

    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connection à la base de données reussie: ${conn.connection.host}`);
    } catch(error) {
        console.log(error);
    }

}

module.exports = connectDB;