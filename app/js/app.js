var app = angular.module('shabbatones', ['ngRoute','ngAnimate','ngTouch','ui.bootstrap','angulartics','angulartics.google.analytics']);

  app.config(function($routeProvider, $locationProvider){
    $routeProvider
      .when('/:id/:album', {
        templateUrl: 'partials/album.html'
      })
      .when('/:id', {
        templateUrl: 'partials/music.html'
      })
      .otherwise({
        templateUrl: 'partials/music.html'
      });
  });

  app.config(function($sceDelegateProvider){
    $sceDelegateProvider.resourceUrlWhitelist(['self','http://www.youtube.com/embed/**','https://p.scdn.co/mp3-preview/**']);
  });

  app.controller('MainController', ['$http', '$scope', '$routeParams', '$filter', '$document', '$analytics', function($http, $scope, $routeParams, $filter, $document, $analytics) {

    $scope.$routeParams = $routeParams;

    // $rootScope.$on('$locationChangeSuccess', function(){
    //   $anchorScroll();
    // });

    worksheets = {slides: 1276842353, albums: 612845608, songcredits: 237917842, events: 1335839826, tour: 1237774977, members: 1478583169, alumni: 565451615};

    angular.forEach(worksheets, function(value,key){
      var spreadsheetUrl = 'https://spreadsheets.google.com/feeds/list/140NStbyyUW95Kp5EjCQWjqh06kJNpF40aY-99gI5LMs/' + value + '/public/full?alt=json';
      var spreadsheetRaw = [];
      var spreadsheetParsed = [];

      $http.get(spreadsheetUrl).success(function(data){
        spreadsheetRaw = data.feed.entry;
        angular.forEach(spreadsheetRaw, function(record){
          parsedRecord = {};
          angular.forEach(record, function(v,k){
            if (k.slice(0,4) === 'gsx$') {
              newKey = k.slice(4);
              newVal = v['$t'];
              parsedRecord[newKey] = newVal;
            }
          });
          spreadsheetParsed.push(parsedRecord);
        });
        $scope[key] = spreadsheetParsed;
      });
    });

    var spotifyUrl = 'https://api.spotify.com/v1/albums?ids=0hMgrz23VgOBUjGaGuIkRf,316HR3MeCktdPTsDP306yA,5wzldeHMr41i5uDYEia4Yw,0qqa61lKTVIxlHdbYWgfuG,0Qh0MvCO8s3wuL3SffnsBH';
    var spotifyRaw = [];
    var spotifyParsed = [];

    $http.get(spotifyUrl).success(function(data){
      spotifyRaw = data.albums;
      
      angular.forEach(spotifyRaw, function(album){
        parsedAlbum = {};
        parsedAlbum['albumid'] = album.id;

        parsedSongs = [];
        angular.forEach(album.tracks.items, function(song){
          songSimple = {};
          songSimple['songid'] = song.id;
          songSimple['songtitle'] = song.name;
          songSimple['clip'] = song.preview_url;
          songSimple['tracknumber'] = song.track_number;
          parsedSongs.push(songSimple);
        });
        parsedAlbum['songs'] = parsedSongs;
        spotifyParsed.push(parsedAlbum);
      });
      $scope['spotify'] = spotifyParsed;
    });

    this.playClip = function(song){
      $('audio').attr( "src", song.clip );
      var a = document.getElementsByTagName("audio")[0];
      a.play();
      this.nowPlaying = song.songtitle;
      $analytics.eventTrack('Song Clip', {  category: 'Listen', label: song.songtitle });
    };
    $scope.oneAtATime = true;

    $scope.currentPage = 1;
    $scope.totalItems = 90;
    $scope.pageSize = 15;

  }]);

  app.filter('pagination', function() {
    return function(input, start){
      start = +start;
      return input.slice(start);
    };
  });


  app.directive('gallery', function(){
    return {
      restrict: 'E',
      templateUrl: 'partials/gallery.html'
    };
  });

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
