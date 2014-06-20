var app = angular.module('shabbatones', ['customFilters']);

  app.directive('alumni', ['$http', function(){
    return {
      restrict: 'E',
      templateUrl: 'partials/alumni.html',
      controller: function($scope, $http, $filter){
        var alumni = this;
        var spreadsheet_url = 'https://spreadsheets.google.com/feeds/list/140NStbyyUW95Kp5EjCQWjqh06kJNpF40aY-99gI5LMs/565451615/public/full?alt=json&orderby=gradyear&reverse=true';
        alumni.members = [];

        $http.get(spreadsheet_url).success(function(data){
          alumni.members = data.feed.entry;
        });

        $scope.currentPage = 0;
        $scope.pageSize = 15;
        $scope.numberPages = function () {
          return Math.ceil(alumni.members.length / $scope.pageSize);
        };
      },
      controllerAs: 'alumni'
    };
  }]);
