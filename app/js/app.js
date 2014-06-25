var app = angular.module('shabbatones', ['ngRoute','ngAnimate','ngTouch', 'ui.bootstrap', 'customFilters']);

  app.config(function($routeProvider, $locationProvider){
    $routeProvider
      .when('/:id/:album', {
        templateUrl: 'partials/album.html',
        controller: 'AlbumController'
      })
      .when('/:id', {
        templateUrl: 'partials/music.html'
      })
      .otherwise({
        templateUrl: 'partials/music.html'
      });
  });

  app.config(function($sceDelegateProvider){
    $sceDelegateProvider.resourceUrlWhitelist(['self','http://www.youtube.com/embed/**']);
  });

  app.controller('MainController', ['$http', '$scope', function($http, $scope) {

    // $scope.$routeParams = $routeParams;
    // $scope.section = $routeParams.id;
    // $rootScope.$on('$locationChangeSuccess', function(section){
    //   $anchorScroll();
    // });

    worksheets = {slides: 1276842353, albums: 612845608, events: 1335839826, tour: 1237774977, members: 1478583169, alumni: 565451615};

    angular.forEach(worksheets, function(value,key){
      var spreadsheetUrl = 'https://spreadsheets.google.com/feeds/list/140NStbyyUW95Kp5EjCQWjqh06kJNpF40aY-99gI5LMs/' + value + '/public/full?alt=json';
      var rawData = [];
      var parsedData = [];
      $http.get(spreadsheetUrl).success(function(data){
        rawData = data.feed.entry;
        angular.forEach(rawData, function(record){
          parsedRecord = {};
          angular.forEach(record, function(v,k){
            if (k.slice(0,4) === 'gsx$') {
              newKey = k.slice(4);
              newVal = v['$t'];
              parsedRecord[newKey] = newVal;
            }
          });
          parsedData.push(parsedRecord);
        });
        $scope[key] = parsedData;
      });
    });

  }]);

  app.controller('AlbumController', function($scope, $routeParams){
    // $scope.selected_album = $routeParams.album;
    // $http.get(spotify_url).success(function(data){
    //   album.tracks = data.items;
    // });
  });
  
  app.controller('AlumniController', ['$scope', function($scope){
    $scope.currentPage = 0;
    $scope.pageSize = 15;
    $scope.numberPages = function () {
      return Math.ceil(alumni.members.length / $scope.pageSize);
    };
  }]);

  app.directive('gallery', function(){
    return {
      restrict: 'E',
      templateUrl: 'partials/gallery.html'
    };
  });

  // app.directive('music', function(){
  //   return {
  //     restrict: 'E',
  //     templateUrl: 'partials/music.html'
  //   };
  // });

  // app.directive('album', function(){
  //   return {
  //     restrict: 'E',
  //     templateUrl: 'partials/album.html'
  //   };
  // });

  app.directive('members', function(){
    return {
      restrict: 'E',
      templateUrl: 'partials/members.html'
    };
  });

  app.directive('alumni', function(){
    return {
      restrict: 'E',
      templateUrl: 'partials/alumni.html'
    };
  });

  app.directive('about', function(){
    return {
      restrict: 'E',
      templateUrl: 'partials/about.html',
    };
  });

$( document ).ready(function() {

  $('.members-panel').on('click', function(){
    $('.members-panel').addClass('active');
    $('.alumni-panel').removeClass('active');
  });

  $('.alumni-panel').on('click', function(){
    $('.members-panel').removeClass('active');
    $('.alumni-panel').addClass('active');
  });

});