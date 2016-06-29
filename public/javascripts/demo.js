function selectTextareaLine(tarea,lineNum) {
    lineNum--; // array starts at 0
    var lines = tarea.value.split("\n");

    // calculate start/end
    var startPos = 0, endPos = tarea.value.length;
    for(var x = 0; x < lines.length; x++) {
        if(x == lineNum) {
            break;
        }
        startPos += (lines[x].length+1);

    }

    var endPos = lines[lineNum].length+startPos;

    // do selection
    // Chrome / Firefox

    if(typeof(tarea.selectionStart) != "undefined") {
        tarea.focus();
        tarea.selectionStart = startPos;
        tarea.selectionEnd = endPos;
        return true;
    }

    // IE
    if (document.selection && document.selection.createRange) {
        tarea.focus();
        tarea.select();
        var range = document.selection.createRange();
        range.collapse(true);
        range.moveEnd("character", endPos);
        range.moveStart("character", startPos);
        range.select();
        return true;
    }

    return false;
}


var line = [6, 7, 8, 9];
var i = 0;

(function () {
	var text = `
#include <stdio.h>

int A[6] = {9, 8, 7, 6, 5, 4};

int main() {
	for (int i = 0; i < 6; )
		for (int j = 0; j < i; j++)
	
	return 0;
}
`;

	$('#txtCode').text(text);
})();

/*
var data = [
	[0, 0, 0],
	[1, 0, 0],
	[1, 2, 0],
	[1, 2, 3],
	[3, 2, 1]
]

var hl = [
	[],
	[0],
	[1],
	[2],
	[0, 2],
]
*/

var initData = {
	A: [9, 8, 7, 6, 5, 4]
};

var updateData = [
	{line: 6, diff: {A: [[0, 8], [1, 9]]}},
	{line: 6, diff: {A: [[1, 7], [2, 9]]}},
	{line: 6, diff: {A: [[2, 6], [3, 9]]}},
	{line: 6, diff: {A: [[3, 5], [4, 9]]}},
	{line: 6, diff: {A: [[4, 4], [5, 9]]}},
	{line: 6, diff: {A: [[0, 7], [1, 8]]}},
	{line: 6, diff: {A: [[1, 6], [2, 8]]}},
	{line: 6, diff: {A: [[2, 5], [3, 8]]}},
	{line: 6, diff: {A: [[3, 4], [4, 8]]}},
	{line: 6, diff: {A: [[0, 6], [1, 7]]}},
	{line: 6, diff: {A: [[1, 5], [2, 7]]}},
	{line: 6, diff: {A: [[2, 4], [3, 7]]}},
	{line: 6, diff: {A: [[0, 5], [1, 6]]}},
	{line: 6, diff: {A: [[1, 4], [2, 6]]}},
	{line: 6, diff: {A: [[0, 4], [1, 5]]}}
];

var svg = d3.select('#canvas').append('svg').attr('height', 100).attr('width', 900);
var options = { fontsize: 45, speed: 250 };
var v = illustrateArray(initData['A'], svg, options);

var svg2 = d3.select('#canvas').append('svg')
	.attr("height", 600)
	.attr("width", 900);
	
var graphData = JSON.parse(JSON.stringify(initData));
var graph = svg2.selectAll('g')
	.data(graphData['A'])
	.enter()
	.append('g')
	.attr("transform", function(d, i) { return "translate(" + (i * 60) + ",0)"; });

graph.append("rect")
	.attr("width", 50)
	.attr("height", function(d) {return d * 50;})
	.attr("y", function(d) {return 500 - d * 50;})
	.attr("fill", "red");
graph.append("text")
	.text(function(d) { return d; })
	.attr("y", 540)
	.attr("x", 25)
	.attr('font-size', 25)
	.attr('text-anchor', 'middle');

var h = [];
var graphH = [];

$('#btnStep').on('click', function () {
	while (graphH.length > 0)
		graphH.pop();
	
	while (h.length > 0) {
		h.pop().destroy();
	}
	

	if (!updateData[i]) return;
	selectTextareaLine(document.getElementById('txtCode'), updateData[i].line);

	var updateArr = updateData[i++].diff['A'];
	for (j = 0; j < updateArr.length; j++)
		v.splice(updateArr[j][0], updateArr[j][1]);

	updateArr.forEach(function (update) {
		h.push(v.highlight(update[0]));
	});
	
	for (j = 0; j < updateArr.length; j++) {
		graphData['A'][updateArr[j][0]] = updateArr[j][1];
		graphH.push(updateArr[j][0]);
	}
	console.log(graphData['A']);
	console.log(graphH);
	graph.data(graphData['A']);
	
	graph.select('rect')
		.attr('height', function(d) {return d * 50;})
		.attr("y", function(d) {return 500 - d * 50;})
		.attr("fill", function(d, i) { return graphH.indexOf(i) != -1 ? "orange" : "red"; });
	graph.select('text')
		.text(function(d) { return d; })
});