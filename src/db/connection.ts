import mongoose from "mongoose";

const options = {
    dbName: 'chat_app',
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 30000 // Close sockets after 45 seconds of inactivity
};

mongoose.connect('mongodb://127.0.0.1:27017', options).then(() => {
    console.log('DB connected.');
}).catch((e) => {
    console.error('Error connecting DB', e);
})