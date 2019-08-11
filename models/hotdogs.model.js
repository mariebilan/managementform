const mongoose = require('mongoose');

var hotdogSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: 'This field is required.'
    },
    ID: {
        type: String
    }
});

mongoose.model('Hotdog', hotdogSchema);