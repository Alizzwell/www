var strictCode = '#include <stdio.h>\n\
\n\
int A[6] = {9, 8, 7, 6, 5, 4};\n\
\n\
int main() {\n\
	for (int i = 5; i >= 0; i--) {\n\
		for (int j = 0; j < i; j++) {\n\
			if (A[j] > A[j + 1]) {\n\
				swap(A[j], A[j + 1]);\n\
			}\n\
		}\n\
	}\n\
\n\
	return 0;\n\
}';



angular
  .module('this-play.demo', ['ngAnimate', 'ui.bootstrap', 'ui.codemirror'])
  
  .controller('DemoCtrl', function($scope, $rootScope) {
	  
	$scope.arrayChk = true;
	$scope.sortChk = true;
	$scope.searchChk = true;
	$scope.listChk = true;
	$scope.treeChk = true;
	$scope.graphChk = true;
	$scope.dpChk = true;
    
	$scope.modes = ['text/x-csrc', 'text/x-c++src', 'text/x-java'];
	$scope.mode = $scope.modes[0];
	
	$scope.cmModel = strictCode;
	
	$scope.cmOutputOption = {
		indentWithTabs: true,
		mode: $scope.mode,
		lineNumbers: true,
		lineWrapping: true,
		styleSelectedText: true
	};
	
	$scope.cmInputOption = {
		indentWithTabs: true,
		mode: $scope.mode,
		styleActiveLine: true,
		lineNumbers: true,
		lineWrapping: true,
		styleSelectedText: true
	};
	  
	$scope.cmModel = strictCode;


	$scope.btnRunClick = function() {
		$scope.visualize = true;
		//$scope.cmModel = strictCode;	
		
		$('#txtCode').val($scope.cmModel);
		
		upload($scope.input, $scope.cmModel);
	};
	
	$scope.selectAlgor = '';
	
	$scope.btnRunClick = function() {
		$scope.visualize = true;
		//$scope.cmModel = strictCode;	
		
		$('#txtCode').val($scope.cmModel);
		
		upload($scope.input, $scope.cmModel);
	};
	
	$scope.btnAlgorClick = function() {
		location.href = "/main";       
	};
	
  });