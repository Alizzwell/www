var line1 = 0;
var line2 = 0;
var points = {};

angular
  .module('this-play.demo', ['ngAnimate', 'ui.bootstrap', 'ui.codemirror'])
  
  .controller('DemoCtrl', function($scope, $rootScope, $http) {	  
	$http({
		method: 'GET',
		url: '/api/algorithms'
	}).then(function successCallback(response) {
		$scope.response = response;
	}, function errorCallback(response) {
	});
	
	Array.prototype.remove = function(from, to) {
		var rest = this.slice((to || from) + 1 || this.length);
		this.length = from < 0 ? this.length + from : from;
		return this.push.apply(this, rest);
	};
	
	$scope.breakp = []; 
	
	$scope.page = 'select';
	
	$scope.chk = {
		"array": true,
		"sort": true,
		"search": true,
		"list": true,
		"tree": true,
		"graph": true,
		"dp": true
	};
    
	$scope.modes = ['text/x-csrc', 'text/x-c++src', 'text/x-java'];
	$scope.mode = $scope.modes[0];
	
	$scope.cmInputOption = {
		indentWithTabs: true,
		mode: $scope.mode,
		styleActiveLine: true,
		autoCloseBrackets: true,
		lineNumbers: true,
		lineWrapping: true,
		styleSelectedText: true
	};
	
	$scope.editor = CodeMirror.fromTextArea(document.getElementById("txtCode"), {
		indentWithTabs: true,
		mode: $scope.mode,
		lineNumbers: true,
		lineWrapping: true,
		styleSelectedText: true,
		readOnly: true,
		autoRefresh: true,
		gutters: ["CodeMirror-linenumbers", "breakpoints"]
	});
	
	$scope.editor.on("gutterClick", function(cm, n) {
		var info = cm.lineInfo(n);
		cm.setGutterMarker(n, "breakpoints", info.gutterMarkers ? null : makeMarker());
		var pos = $scope.breakp.indexOf(n);
		if(pos < 0)
		{
			$scope.breakp.push(n);
		}
		else
		{
			$scope.breakp.remove(pos, pos);
		}
	});
	
	//editor.markText({line: 0, ch: 0}, {line: 1}, {className: "styled-background"});
	
	function makeMarker() {
		var marker = document.createElement("div");
		marker.style.color = "#933";
		marker.innerHTML = "●";
		return marker;
	}

	$scope.btnRunClick = function() {
		$scope.page = 'view';
		
		$scope.editor.setValue($scope.cmModel);
		$scope.editor.markText({line: 0, ch: 0}, {line: 1}, {className: "styled-background"});
		line1 = 0;
		line2 = 0;
		setTimeout(function() {
			$scope.editor.refresh();
		}, 100);
	};
	
	$scope.fresh = function() {
		$scope.editor.refresh();
	}
	
	$scope.homeClk = function() {
		 $scope.page = 'select';
	};
	
	$scope.inputClk = function() {
		 $scope.page = 'input';
	};
	
	$scope.stepClk = function() {
		$scope.editor.setValue($scope.cmModel);
		$scope.editor.markText({line: line1, ch: 0}, {line: line2}, {className: "styled-background"});
		line1 = line1 + 1;
		line2 = line2 + 1;
	};
	
	$scope.selectAlgor = '';

	$scope.algorClick = function(subject) {
		$http.get('/api/algorithms/'+subject).then(function (response) {
			$scope.cmModel = response.data.code;
			$scope.input = response.data.inputData;
         });
		 
		 $scope.page = 'input';
	};
  });