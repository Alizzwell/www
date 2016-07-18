var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var algorithmSchema = new Schema({
	category: String,
	subject: String,
	inputData: String,
	code: String
});

module.exports = mongoose.model('algorithm', algorithmSchema);
