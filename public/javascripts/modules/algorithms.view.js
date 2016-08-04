Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};


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
    onStep(scheduler);
  });

  scheduler.on('change', function (info) {
    // console.log(JSON.stringify(info));
    onChange(scheduler, info);
  });

  function getAlgoData(id) {
    $http.get('/api/algorithms/' + id)
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

  function initCanvas() {
    onBind(scheduler);
  }
  
  function btnUploadClk() {
    $scope.data.code = $scope.inputEdit.getValue();

    var dataObject = {
      "targets": $scope.data.targets.split(' '),
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
        $scope.page = "view";
        $scope.data.code = data.code;
        scheduler.bind(data.data);
      }
      else {
        alert('error!! (' + status + ')')
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
  $scope.initCanvas = initCanvas;
  $scope.btnStepClk = btnStepClk;

});