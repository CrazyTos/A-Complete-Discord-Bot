const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    Guild: String,
    Prefix: String,
});

module.exports = mongoose.model('prefix', schema);
