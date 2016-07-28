Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};


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
  
  $scope.chk = {};
  $scope.categorys = categorys;
  $scope.algorithms = [];

  function initCategory() {
    $scope.chk = {};
    categorys.forEach(function (item) {
      $scope.chk[item.id] = true;
    });
  }

  function getAlgorithmList() {
    $http({
      method: 'GET',
      url: '/api/algorithms'
    }).then(function successCallback(res) {
      // TODO: error handle
      $scope.algorithms = res.data;
    }, function errorCallback(res) {
      // TODO: error handle
    });
  }

  $scope.initCategory = initCategory;
  $scope.getAlgorithmList = getAlgorithmList;

});



angular.module('algorithms.add', 
  ['algorithms.category', 'ui.bootstrap', 'ngAnimate', 'ui.codemirror'])

.controller('AddCtrl', function($scope, $http, categorys) {

  $scope.categorys = categorys;
  $scope.category = categorys[0];

  $scope.inputEdit = undefined;
  $scope.mode = 'text/x-csrc'
  $scope.breakp = [];

  $scope.subject = "";
  $scope.input = "";

  $scope.thumb = "/images/thumb/add.jpg";


  function dropboxitemselected(item) {
    $scope.category = item;
  }

  function initInputEdit() {
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

  function uploadThumbFile(files) {
    var formdata = new FormData();
    formdata.append("thumb", files[0]);
    $http.post('/api/image_upload', formdata, {
      headers: {
        'Content-Type': undefined
      },
      transformRequest: angular.identity

    }).success(function (res) {
      $scope.thumb = res.image_file_name;

    }).error(function () {
      console.log("err");
      // TODO: error handler
    });
  }

  function btnCreateClk() {
      var dataObject = {
        "category": $scope.category.id,
        "subject": $scope.subject,
        "inputData": $scope.input,
        "targets": $scope.target,
        "code": $scope.inputEdit.getValue(),
        "image_file_name": $scope.thumb
      };

      $http({
        method: 'POST',
        url: '/api/algorithms/',
        data: dataObject,
        headers: {'Content-Type': 'application/json; charset=utf-8'}
      })
      .success(function(data, status) {
        document.location.href = "/algorithms";
      })
      .error(function(data, status) {
        // TODO: error handler
      });
      
  }

  $scope.dropboxitemselected = dropboxitemselected;
  $scope.initInputEdit = initInputEdit;
  $scope.uploadThumbFile = uploadThumbFile;
  $scope.btnCreateClk = btnCreateClk;

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



angular.module('algorithms.view', 
  ['ui.bootstrap', 'ngAnimate', 'ui.codemirror'])

.controller('ViewCtrl', function($scope, $http) {

  $scope.data = {};
  $scope.page = "input";

  $scope.inputEdit = undefined;
  $scope.outputEdit = undefined;
  $scope.mode = 'text/x-csrc'; // DB 데이터로 해야 함
  $scope.breakp = []; // DB 연동 필요

  var scheduler = new this_play.Scheduler();

  scheduler.on('step', function () {
    markLine(scheduler.getLine() - 1);
  });

  scheduler.on('change', function (info) {
    // console.log(JSON.stringify(info));
  });

  function getAlgoData(id) {
    $http.get(`/api/algorithms/${id}`)
    .then(function success(res, status) {
      $scope.data = res.data;
      initInputEdit($scope.data.code);
    }, function err(res, status) {
      // TODO: err handler
    });
  }

  function initInputEdit(txt) {
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
      
      if (!info) {
        return;
      }

      if (info.gutterMarkers) {
        cm.setGutterMarker(n, "breakpoints", null);  
        var pos = $scope.breakp.indexOf(n + 1);
        $scope.breakp.remove(pos, pos);
      }
      else {
        var marker = document.createElement("div");
        marker.style.color = "#933";
        marker.innerHTML = "●";
        cm.setGutterMarker(n, "breakpoints", marker);  
        $scope.breakp.push(n + 1);
      }
    });

    $scope.inputEdit.setValue(txt);
  }

  function initOutputEdit() {
    $scope.outputEdit = CodeMirror.fromTextArea(document.getElementById("outputEdit"), {
      indentWithTabs: true,
      mode: $scope.mode,
      lineNumbers: true,
      lineWrapping: true,
      styleSelectedText: true,
      readOnly: true
    });
    
    $scope.outputEdit.setValue($scope.data.code);
    markLine(scheduler.getLine() - 1);
  }

  

  function btnUploadClk() {
    var dataObject = {
      "targets": $scope.data.targets,
      "input": $scope.data.inputData,
      "code": $scope.data.code,
      "bps": $scope.breakp  // TODO: 기능 구현
    };

    $http({
      method: 'POST',
      url: '/api/execute',
      data: dataObject,
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    })
    .success(function(data, status) {
      if (status == 201) {
        scheduler.bind(data);
        $scope.page = "view";
      }
      else {
        alert(`error!! (${status})`)
      }
    })
    .error(function(data, status) {
      // TODO: error handler
    });
  }

  function btnStepClk() {
    scheduler.step();
  }

  var markText;
  function markLine(n) {
    if (markText) markText.clear();
    markText = $scope.outputEdit.markText({line: n, ch: 0}, {line: n}, {className: "styled-background"});
  }


  $scope.getAlgoData = getAlgoData;
  $scope.btnUploadClk = btnUploadClk;
  $scope.initOutputEdit = initOutputEdit;
  $scope.btnStepClk = btnStepClk;

});