import mongoose from 'mongoose'

export const connectDB = () => {
    mongoose
        .connect(process.env.MONGO_URI, {
            dbName: 'keep_notes',
        })
        .then((c) => console.log(`Database Connected With ${c.connection.host}`))
        .catch((err) => console.log('Failed to connect to Database with error\n ' + err.message))
}
