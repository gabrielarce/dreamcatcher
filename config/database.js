const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.DB_STRING, { dbName: "dreams" })
        console.log(`MongoDB Connected: ${conn.connection.host}`)
        console.log(conn)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

module.exports = connectDB