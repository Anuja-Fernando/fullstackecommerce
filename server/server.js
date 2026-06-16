const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, "config/config.env") }); // load first

const app = require('./app');
const connectDatabase = require('./config/database');

connectDatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port: ${process.env.PORT} in ${process.env.NODE_ENV}`);
});

process.on('unhandledRejection',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled Server Error`);
    server.close(() => {
        process.exit(1);
    })
})


process.on('uncaughtException',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to uncaught execption Error`);
    server.close(() => {
        process.exit(1);
    })
})

