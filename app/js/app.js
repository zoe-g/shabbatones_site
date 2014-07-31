var app = angular.module('shabbatones', ['ngRoute','ngAnimate','ngTouch','ui.bootstrap','angulartics','angulartics.google.analytics']);

  // DEFINE ROUTES
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

  // WHITELIST EXTERNAL URLS FROM YOUTUBE AND SPOTIFY
  app.config(function($sceDelegateProvider){
    $sceDelegateProvider.resourceUrlWhitelist(['self','http://www.youtube.com/embed/**','https://p.scdn.co/mp3-preview/**']);
  });

  // PRIMARY CONTROLLER FOR SINGLE PAGE APP
  app.controller('MainController', ['$http', '$scope', '$routeParams', '$filter', '$document', '$analytics', function($http, $scope, $routeParams, $filter, $document, $analytics) {

    // ASSIGNS ROUTE PARAMS TO SCOPE FOR USE WITHIN APP
    $scope.$routeParams = $routeParams;

    // ALUMNI SECTION - DEFINES VARIABLES FOR PAGINATION
    $scope.currentPage = 1;
    $scope.pageSize = 15;

    // WORK IN PROGRESS - SCROLL FUNCTIONALITY
    // $rootScope.$on('$locationChangeSuccess', function(){
    //   $anchorScroll();
    // });

    // REQUESTS DATA FROM GOOGLE SPREADSHEETS API AND PARSES FOR USE IN ALL SECTIONS
    worksheets = {slides: 'ol475pn', albums: 'oa4vf1u', songcredits: 'o3xneq0', events: 'om3boug', tour: 'okgxtgb', members: 'oogb5uj', alumni: 'o9cnl39'};
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

        // IF THE SPREADSHEET JUST CALLED WAS THE ALUMNI PAGE, SET TOTAL FOR PAGINATION
        if (key === 'alumni') {
          $scope.totalItems = $scope.alumni.length;
        }

        // IF THE SPREADSHEET JUST CALLED WAS THE EVENTS PAGE, DETERMINE IF EACH IS PAST OR FUTURE
        if (key === 'events') {
          var futureEvents = [];
          var pastEvents = [];
          angular.forEach($scope.events, function(event){
            if (event.future) {
              futureEvents.push(event);
            } else {
              pastEvents.push(event);
            }
          });
        $scope['futureEvents'] = futureEvents;
        $scope['pastEvents'] = pastEvents;
        }
      });
    });

    // ALBUM PAGE - PRE-REQUESTS SONG DATA FROM SPOTIFY
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

    // ALBUM PAGE - TRIGGERS AUDIO PLAYER, ASSIGNS CURRENT SONG, INITIATES TRACKING EVENT
    this.playClip = function(song){
      $('audio').attr( "src", song.clip );
      var a = document.getElementsByTagName("audio")[0];
      a.play();
      this.nowPlaying = song.songtitle;
      $analytics.eventTrack('Song Clip', {  category: 'Listen', label: song.songtitle });
    };
    $scope.oneAtATime = true;

  }]);

  // ALUMNI SECTION - CUSTOM FILTER REQUIRED TO PAGINATE DATA
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

  app.directive('events', function(){
    return {
      restrict: 'E',
      templateUrl: 'partials/events.html'
    };
  });

  app.directive('tour', function(){
    return {
      restrict: 'E',
      templateUrl: 'partials/tour.html'
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

// Nav bar highlights as user scrolls through sections
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Scroll to sections
$("nav").find("a").click(function(e) {
    e.preventDefault();
    var goTo = $(this).attr("href");
    $('html, body').animate({
        scrollTop: $(goTo).offset().top
    });
});