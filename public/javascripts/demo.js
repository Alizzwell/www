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

var scheduler;
var step_index;
var steps;
var updateArr;	// 이 부분이 scheduler 내 에서 모델로 제공되고, canvas가 이용하는 부분은 모델로 바인딩 하도록 해야함

function initScheduler(jsonData) {
	scheduler = new this_play.Scheduler();
	scheduler.addTarget(jsonData.targets);

	scheduler.targets['A'].on('change', function (before, after) {
		updateArr['A'] = [];

		before.forEach(function (d, i) {
			if (d != after[i]) {
				updateArr['A'].push([i, after[i]]);
			}
		});

		redraw();
	});

	step_index = 0;
	steps = jsonData.steps;

	var initData = {};
	initData[jsonData.targets[0].name] = jsonData.targets[0].init;
	initCanvas(initData);
}


function upload(inputData, userCode, done) {	
	$.post('/api/demo/upload', { inputData: inputData, userCode: userCode }, function (data) {
		initScheduler(data);
		done();
	});
}


$('#btnStep').on('click', function () {
	var step = steps[step_index];
	if (!step) {
		return;
	}

	selectTextareaLine(document.getElementById('txtCode'), step.line);

	updateArr = {};
	scheduler.step(step.status);

	step_index++;
});



/* ---- Canvas module ---- */
var arrayData;
var charData;
var chart;
var arrayH = [];
var chartH = [];

function initCanvas(initData) {
	d3.select('#canvas').html('');

	var svg = d3.select('#canvas').append('svg').attr('height', 100).attr('width', 900);
	var options = { fontsize: 45, speed: 250 };
	arrayData = illustrateArray(initData['A'], svg, options);

	var svg2 = d3.select('#canvas').append('svg')
	.attr("height", 600)
	.attr("width", 900);
		
	charData = JSON.parse(JSON.stringify(initData));
	chart = svg2.selectAll('g')
		.data(charData['A'])
		.enter()
		.append('g')
		.attr("transform", function(d, i) { return "translate(" + (i * 60) + ",0)"; });

	chart.append("rect")
		.attr("width", 50)
		.attr("height", function(d) {return d * 50;})
		.attr("y", function(d) {return 500 - d * 50;})
		.attr("fill", "red");
	chart.append("text")
		.text(function(d) { return d; })
		.attr("y", 540)
		.attr("x", 25)
		.attr('font-size', 25)
		.attr('text-anchor', 'middle');

	arrayH = [];
	chartH = [];
}

function redraw() {
	while (arrayH.length > 0) {
		arrayH.pop().destroy();
	}

	while (chartH.length > 0) {
		chartH.pop();
	}

	for (j = 0; j < updateArr['A'].length; j++) {
		arrayData.splice(updateArr['A'][j][0], updateArr['A'][j][1]);
	}

	updateArr['A'].forEach(function (update) {
		arrayH.push(arrayData.highlight(update[0]));
	});
	
	for (j = 0; j < updateArr['A'].length; j++) {
		charData['A'][updateArr['A'][j][0]] = updateArr['A'][j][1];
		chartH.push(updateArr['A'][j][0]);
	}

	chart.data(charData['A']);
	
	chart.select('rect')
		.attr('height', function(d) {return d * 50;})
		.attr("y", function(d) {return 500 - d * 50;})
		.attr("fill", function(d, i) { return chartH.indexOf(i) != -1 ? "orange" : "red"; });
	chart.select('text')
		.text(function(d) { return d; })
}
