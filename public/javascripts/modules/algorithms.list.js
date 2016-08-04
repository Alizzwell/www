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

  function btnAddClk() {
    document.location.href = "algorithms/add";
  }

  $scope.initCategory = initCategory;
  $scope.getAlgorithmList = getAlgorithmList;
  $scope.btnAddClk = btnAddClk;

});
