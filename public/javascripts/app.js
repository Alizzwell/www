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
	$scope.selectAlgor = '';
	$scope.input = '';
	$scope.target = '';
	$scope.cmModel = '';
	$scope.dataObject;
	$scope.category = "array";
	$scope.subject = '';
	$scope.dataObject = {category: "array", subject: "array2", code: "code...", inputData: "3 1 1"};
	
	$scope.arrCategory = ["array", "sort", "search", "list", "tree", "graph", "dp"];
	
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
	
	$scope.cmOutputOption = {
		indentWithTabs: true,
		mode: $scope.mode,
		lineNumbers: true,
		lineWrapping: true,
		styleSelectedText: true,
		readOnly: true
	};
	
	$scope.outputEdit = CodeMirror.fromTextArea(document.getElementById("outputEdit"), {
		indentWithTabs: true,
		mode: $scope.mode,
		lineNumbers: true,
		lineWrapping: true,
		styleSelectedText: true,
		readOnly: true
	});
	
	$scope.inputEdit = CodeMirror.fromTextArea(document.getElementById("inputEdit"), {
		indentWithTabs: true,
		mode: $scope.mode,
		styleActiveLine: true,
		autoCloseBrackets: true,
		lineNumbers: true,
		lineWrapping: true,
		gutters: ["CodeMirror-linenumbers", "breakpoints"]
	});
	
	$scope.inputEdit.on("gutterClick", function(cm, n) {
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
	
	function makeMarker() {
		var marker = document.createElement("div");
		marker.style.color = "#933";
		marker.innerHTML = "●";
		return marker;
	}
	
	$scope.dropboxitemselected = function (item) {
 
        $scope.category = item;
    }
	
	$scope.file_changed = function(element) {

     $scope.$apply(function(scope) {
         var photofile = element.files[0];
         var reader = new FileReader();
         reader.onload = function(e) {
         };
         reader.readAsDataURL(photofile);
     });
};
	
	$scope.btnCreateClk = function() {
		$scope.dataObject.code = $scope.inputEdit.getValue();
		$scope.dataObject.inputData = $scope.input;
		$scope.dataObject.category = $scope.category;
		$scope.dataObject.subject = $scope.subject;
		$http({
			method: 'POST',
			url: '/api/algorithms/',
			data: $scope.dataObject,
			headers: {'Content-Type': 'application/json; charset=utf-8'}
		})
		.success(function(data, status, headers, config) {
			if( data ) {
				// 성공적으로 결과 데이터가 넘어 왔을 때 처리
				console.log(data);
				console.log("sus");
			}
			else {
				// 통신한 URL에서 데이터가 넘어오지 않았을 때 처리
				console.log(data);
				console.log("fail");
			}
		})
		.error(function(data, status, headers, config) {
			// 서버와의 연결이 정상적이지 않을 때 처리
			console.log(status);
			console.log(data);
			console.log("err");
		});
		
		
		$scope.page = 'select';
	}

	$scope.btnUploadClk = function() {
		$scope.page = 'view';
		$scope.cmModel = $scope.inputEdit.getValue();
		$scope.outputEdit.setValue($scope.cmModel);
		line1 = 0;
		line2 = 0;
		$scope.outputEdit.markText({line: line1, ch: 0}, {line: line2}, {className: "styled-background"});
		/*$scope.dataObject.code = $scope.inputEdit.getValue();
		$scope.dataObject.input = $scope.input;
		$scope.dataObject.target = $scope.target;
		$scope.dataObject.bps = $scope.breakp;
		$http({
			method: 'POST',
			url: '/api/excute/',
			data: dataObject,
			headers: {'Content-Type': 'application/json; charset=utf-8'}
		})
		.success(function(data, status, headers, config) {
			if( data ) {
				// 성공적으로 결과 데이터가 넘어 왔을 때 처리
			}
			else {
				// 통신한 URL에서 데이터가 넘어오지 않았을 때 처리
			}
		})
		.error(function(data, status, headers, config) {
			// 서버와의 연결이 정상적이지 않을 때 처리
			console.log(status);
		});*/
		
		/*$http.post('/api/excute/').then(function (response) {
			response.data.code = $scope.inputEdit.getValue();
			response.data.input = $scope.input;
			response.data.target = $scope.target;
			response.data.bps = $scope.breakp;
         });*/
		
		setTimeout(function() {
			$scope.outputEdit.refresh();
		}, 100);
	};
	
	$scope.btnHomeClk = function() {
		 $scope.page = 'select';
	};
	
	$scope.btnInputClk = function() {
		 $scope.page = 'input';
	};
	
	$scope.btnAddClk = function() {
		$scope.page = 'add';
	};
	
	$scope.btnStepClk = function() {
		$scope.outputEdit.setValue($scope.cmModel);
		$scope.outputEdit.markText({line: line1, ch: 0}, {line: line2}, {className: "styled-background"});
		line1 = line1 + 1;
		line2 = line2 + 1;
	};
	

	$scope.algorClk = function(subject) {
		$http.get('/api/algorithms/'+subject).then(function (response) {
			$scope.cmModel = response.data.code;
			$scope.input = response.data.inputData;
			$scope.inputEdit.setValue($scope.cmModel);
         });
		 
		$scope.page = 'input';
		setTimeout(function() {
			$scope.inputEdit.refresh();
		}, 100);
	};
  });