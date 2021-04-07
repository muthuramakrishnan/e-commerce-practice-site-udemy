const mongooose = require('mongoose');

const connectDatabase = () => {
    mongooose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(con => {
        console.log(`MongoDB connected with HOST: ${con.connection.host}`)
    }).catch(err => {
        console.log('Shutting down the server due to DB connection failure');
        console.log(`stack trace: ${err.stack}`)
        process.exit(1);
    });
}

module.exports = connectDatabase