const mongoose = require('mongoose');

const connectToDatabase = (username, password, clusterURL, database) => {
    return mongoose.connect(`mongodb+srv://${username}:${password}@${clusterURL}/?retryWrites=true&w=majority`, {dbName: database})
};

module.exports = connectToDatabase;