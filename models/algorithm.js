var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var algorithmSchema = new Schema({
	category: String,
	subject: String,
	inputData: String,
	code: String,
	imageURL: String,
	targets: String,
	breaks: [Number]
});

module.exports = mongoose.model('algorithm', algorithmSchema);
