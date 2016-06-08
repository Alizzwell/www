var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var problemSchema = new Schema({
	number: Number,
	difficulty: String,
	category: [String],
	inputData: String,
	code: String
});

module.exports = mongoose.model('problem', problemSchema);
