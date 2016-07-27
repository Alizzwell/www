angular.module('algorithms.category', [])
.constant('categorys', [
  { id: "array", label: "Array" },
  { id: "sort", label: "Sort" },
  { id: "search", label: "Search" },
  { id: "list", label: "Linked List" },
  { id: "tree", label: "Tree" },
  { id: "graph", label: "Graph" },
  { id: "dp", label: "Dynamic Programming" }
]);


angular.module('algorithms.list', ['algorithms.category'])

.controller('ListCtrl', function($scope, $http, categorys) {
  
  $scope.categorys = categorys;

  $scope.initCategory = function () {
    $scope.chk = {};
    categorys.forEach(function (item) {
      $scope.chk[item.id] = true;
    });
  }

  $scope.getAlgorithmList = function () {
    $http({
      method: 'GET',
      url: '/api/algorithms'
    }).then(function successCallback(res) {
      // TODO: error handle
      $scope.algorithms = res.data;
    }, function errorCallback(res) {
      // TODO: error handle
    });  
  };

  $scope.btnAddClk = function () {
    document.location.href = "add";
  };

});


angular.module('algorithms.add', 
  ['algorithms.category', 'ui.bootstrap', 'ngAnimate', 'ui.codemirror'])
.controller('AddCtrl', function($scope, $http, categorys) {
  
  Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };


  $scope.breakp = []; 
  $scope.image_file_name = "/images/thumb/add.jpg";
  $scope.categorys = categorys;
  $scope.category = categorys[0];


  $scope.initInputEdit = function () {
    $scope.mode = 'text/x-csrc'

    var inputEdit = CodeMirror.fromTextArea(document.getElementById("inputEdit"), {
      indentWithTabs: true,
      mode: $scope.mode,
      styleActiveLine: true,
      autoCloseBrackets: true,
      lineNumbers: true,
      lineWrapping: true,
      gutters: ["CodeMirror-linenumbers", "breakpoints"]
    });

    inputEdit.on("gutterClick", function(cm, n) {
      var info = cm.lineInfo(n);
      
      if (!info) {
        return;
      }

      if (info.gutterMarkers) {
        cm.setGutterMarker(n, "breakpoints", null);  
        var pos = $scope.breakp.indexOf(n);
        $scope.breakp.remove(pos, pos);
      }
      else {
        var marker = document.createElement("div");
        marker.style.color = "#933";
        marker.innerHTML = "●";
        cm.setGutterMarker(n, "breakpoints", marker);  
        $scope.breakp.push(n);
      }
    });
  }

  $scope.dropboxitemselected = function (item) {
    $scope.category = item;
  }
  
  $scope.uploadThumbFile = function($files) {
    var formdata = new FormData();
    formdata.append("thumb", $files[0]);
    $http.post('/api/image_upload', formdata, {
      headers: {
        'Content-Type': undefined
      },
      transformRequest: angular.identity

    }).success(function (res) {
      $scope.image_file_name = res.image_file_name;

    }).error(function () {
      console.log("err");
      // TODO: error handler
      
    });
  };

})
.directive('ngFiles', ['$parse', function ($parse) {
  
  function fn_link(scope, element, attrs) {
    var onChange = $parse(attrs.ngFiles);
    element.on('change', function (event) {
      onChange(scope, { $files: event.target.files });
    });
  };

  return {
    link: fn_link
  };

}]);