var appname = angular.module('Katori', []);

// appname.config(function($locationProvider, $routeProvider) {
//   // $locationProvider.html5Mode(true);
//   $routeProvider
//     .when('/', {
//       templateUrl: 'content.html', 
//       controller: 'KatoriController'
//     })
//     .when('/admin', {
//       templateUrl: 'admin.html', 
//       controller:  'AdminController'
//     })
//     .otherwise({ redirectTo: '/' });
// });
appname.run( function($rootScope, $location) {
   $rootScope.$watch(function() { 
      return $location.path(); 
    },
    function(a){  
      console.log('url has changed: ' + a);
      // show loading div, etc...
      // 
      setTimeout(function() {
      		$rootScope.$apply(function() {
      			if ( a == '/adminrhc') {
      	
					$rootScope.isAdmin  = true;
      			} else {

      				$rootScope.isAdmin = false;
      			} 
      		});
      	},100);
      
    });
});

appname.config(['$httpProvider', function ($httpProvider) {
  //Reset headers to avoid OPTIONS request (aka preflight)
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
}]);

appname.controller('KatoriController', ['$scope','$http','$rootScope',
  function($scope,$http,$rootScope) {
  	$scope.announcements = [];
  	// $rootScope.isAdmin = false;
  	
  	$scope.load = function() {
  		$http.get('/announcements').then(function(response){
  			$scope.announcements = response.data.reverse();
  			$scope.getFeatured();
  		});
  	}

  	$scope.add = function() {
  		$scope.announcements.unshift({ title:null,subtitle:null,text:null,image:null,date:new Date(),featured:false });
  	}

  	$scope.remove = function(index) {
  		var announcement = $scope.announcements[index];
  		//Delete announcement
  		//update here
  		console.log(announcement);
  		console.log('/remove?id='+announcement._id);
  		$http.get('/remove?id='+announcement._id).then(function(response){
  			console.log(response);
  			$scope.load();
  		});
  	}

  	$scope.save = function(announcement) {
  		//Delete announcement
  		//update here
  		console.log(announcement);
  		$http.post('/add',announcement).then(function(response){
  			console.log(response);
  			announcement = response.data;
  			$scope.load();
  		},function(error) {
  			console.log(error);
  		});
  	}


  	$scope.getFeatured = function() {
  		for (var i=0; i<$scope.announcements.length; i++) {
  			console.log($scope.announcements[i].featured);
  			if ($scope.announcements[i].featured == true) {
  				$scope.bann = "url('"+$scope.announcements[i].image+"')";
  				$scope.isFeatured = true;
  				return $scope.announcements[i];
  			}
  		}
  		$scope.isFeatured = false;
  		$scope.bann = "url('images/group.jpg')";
  		return false;
  	}

  	$scope.load();

}]);
