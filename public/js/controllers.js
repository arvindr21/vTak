'use strict';

ngAuth.controller('AppCtrl',
  function($rootScope, $scope, $window, $firebaseSimpleLogin) {
    $rootScope.URL = 'https://nwkchatapp.firebaseio.com/';
    var ref = new Firebase($rootScope.URL);
    $rootScope.authClient = $firebaseSimpleLogin(ref);

    $rootScope.redirect = function(user) {
      if ($window.location.href.indexOf('home') < 0)
        $window.location.assign('http://localhost:3000/#home');

      if (user.provider == 'password') {
        user.name = user.email;
        user.img = '/img/user.png'
      } else if (user.provider == 'facebook') {
        user.name = user.displayName;
        user.img = user.thirdPartyUserData.picture.data.url;
      } else if (user.provider == 'twitter') {
        user.name = user.displayName;
        user.img = user.thirdPartyUserData.profile_image_url;
      } else if (user.provider == 'google') {
        user.name = user.displayName;
        user.img = user.thirdPartyUserData.picture;
      }

      $rootScope.user = user;

    };

    $rootScope.$on("$firebaseSimpleLogin:login", function(e, user) {
      if (user) {
        $rootScope.redirect(user);
      }
    });

  }
).controller('Toolbar', ['$rootScope', '$scope', 'Window',
  function($rootScope, $scope, Window) {
    $scope.minimize = function() {
      Window.minimize();
    };

    $scope.toggleFullscreen = function() {
      Window.toggleKioskMode();
    };

    $scope.close = function() {
      Window.close();
    };

    $scope.logoutUser = function() {
      $rootScope.user = '';
      $rootScope.authClient.$logout();
    };
  }
]).controller('AuthCtrl', function($rootScope, $scope) {

  var user = {
    email: '',
    password: '',
    rpassword: ''
  };

  //signup
  $scope.signup = function() {
    var user = $scope.user;
    if (!user || (!user.email || user.password.length == 0 || user.rpassword.length == 0)) {
      alert('Please enter valid credentials');
    } else {
      if (user.password == user.rpassword) {
        $rootScope.authClient.$createUser(user.email, user.password).then(function(user) {
            $rootScope.redirect(user);
          },
          function(error) {
            if (error.code == 'INVALID_EMAIL') {
              alert('Please enter a valid email address');
            } else if (error.code == 'EMAIL_TAKEN') {
              alert('This email address is already in use. Please try logging in.');
            } else {
              alert("Error creating user");
            }
          });
      } else {
        alert('Passwords do not match');
      }
    }
  };

  // signin
  $scope.signin = function() {
    var user = $scope.user;
    if (!user || (!user.email || user.password.length == 0)) {
      alert('Please enter valid credentials');
    } else {
      $rootScope.authClient.$login('password', {
        email: user.email,
        password: user.password
      }).then(function(user) {
          //alert("Successfully logged in", user);
        },
        function(error) {
          if (error.code == 'INVALID_EMAIL') {
            alert('Please enter a valid email address');
          } else if (error.code == 'INVALID_PASSWORD' || error.code == 'INVALID_USER') {
            alert('Invalid Email or Password');
          } else {
            alert("Something went wrong");
          }
        });
    }
  };

  // social login
  $scope.login = function(provider) {
    $rootScope.authClient.$login(provider).then(function(user) {
      //console.log("Logged in as: " + user.uid);
    }, function(error) {
      //console.error("Login failed: " + error);
    });
  }

}).controller('HomeCtrl', function($rootScope, $scope, $firebase, $location) {
  var ref = new Firebase($rootScope.URL + 'chatRooms');
  var sync = $firebase(ref);

  $scope.rooms = sync.$asArray();

  $scope.newRoom = function() {
    sync.$push({
      createdby: $rootScope.user.name,
      roomname: $scope.roomName,
      createddate: Date.now()
    });
    $scope.isNew = false;
  };
  $scope.deleteRoom = function(room) {
    sync.$remove($scope.rooms[room].$id);
  };

  $scope.joinChat = function(room) {
    $location.path('/chat/' + $scope.rooms[room].$id);
  };

}).controller('ChatCtrl', function($rootScope, $scope, $firebase, $routeParams) {
  // get room details
  var chatRoom = new Firebase($rootScope.URL + 'chatRooms/' + $routeParams.roomid);
  var roomSync = $firebase(chatRoom);
  $scope.roomInfo = roomSync.$asObject();

  var msgsSync = $firebase(chatRoom.child('chatMessages'));
  $scope.chatMessages = msgsSync.$asArray();

  $scope.sendMessage = function($event) {
    if (!($event.which == 13)) return;
    if ($scope.message.length == 0) return;

    msgsSync.$push({
      postedby: $rootScope.user.name,
      message: $scope.message,
      posteddate: Date.now(),
      userimg: $rootScope.user.img
    });

    $scope.message = '';
  };
});