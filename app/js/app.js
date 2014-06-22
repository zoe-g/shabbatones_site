var app = angular.module('shabbatones', ['customFilters']);

  app.directive('music', ['$http', function(){
    return {
      restrict: 'E',
      templateUrl: 'partials/music.html',
      controller: function($scope, $http, $filter){
        var music = this;
        var spreadsheet_url = 'https://spreadsheets.google.com/feeds/list/140NStbyyUW95Kp5EjCQWjqh06kJNpF40aY-99gI5LMs/612845608/public/full?alt=json&orderby=releaseyear&reverse=true';
        music.albums = [];

        $http.get(spreadsheet_url).success(function(data){
          music.albums = data.feed.entry;
        });
      },
      controllerAs: 'music'
    };
  }]);

  app.directive('album', ['$http', function(){
    return {
      restrict: 'E',
      templateUrl: 'partials/album.html',
      controller: function($scope, $http, $filter){
        var albums = this;
        var spreadsheet_url = 'https://spreadsheets.google.com/feeds/list/140NStbyyUW95Kp5EjCQWjqh06kJNpF40aY-99gI5LMs/612845608/public/full?alt=json&orderby=releaseyear&reverse=true';
        albums.cd = [];

        $http.get(spreadsheet_url).success(function(data){
          albums.cd = data.feed.entry;
        });

        cd = albums.cd[0]
      },
      controllerAs: 'album'
    };
  }]);

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

  app.directive('about', function(){
    return {
      restrict: 'E',
      templateUrl: 'partials/about.html',
    };
  });
