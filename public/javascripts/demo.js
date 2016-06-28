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
	var text = "\
#include <stdio.h>\n\
\n\
int A[3];\n\
\n\
int main() {\n\
	A[0] = 1;\n\
	A[1] = 2;\n\
	A[2] = 3;\n\
	swap(A[0], A[2]);\n\
	return 0;\n\
}\
";

	$('#txtCode').text(text);
})();

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

var svg = d3.select('#canvas').append('svg').attr('height', 100).attr('width', 900);
var options = { fontsize: 45, speed: 250 };
var v = illustrateArray(data[i], svg, options);

var h = [];

$('#btnStep').on('click', function () {
	while (h.length > 0) {
		h.pop().destroy();
	}

	if (!line[i]) return;
	selectTextareaLine(document.getElementById('txtCode'), line[i++]);

	v.update(data[i]);

	hl[i].forEach(function (n) {
		h.push(v.highlight(n));
	});
});