angular.module('chefsource', ['ionic', 'chefsource.controllers', 'chefsource.services', 'ngResource', 'ngTagsInput'])

.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.run(function($rootScope) {
  $rootScope.$on("$stateChangeError", console.log.bind(console));
})

.config(['$stateProvider','$urlRouterProvider','$resourceProvider','$httpProvider','$locationProvider',function ($stateProvider, $urlRouterProvider, $resourceProvider,$httpProvider,$locationProvider) {

  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: "LoginCtrl"
  })

  .state('registration', {
    url: '/registration',
    templateUrl: 'templates/registration.html',
    controller: "RegistrationCtrl"
  })

  .state('bulletin', {
    url: '/bulletin',
    templateUrl: "templates/bulletin.html",
    controller: "BulletinCtrl"
  })

/*
  .state('bulletin.note', {
    url: '/note/',
    views: {
      'notes': {
        templateUrl: "templates/note.html"
      }
    }
  })*/

  .state('request', {
    url: '/request',
    templateUrl: 'templates/request.html',
    controller: "RequestCtrl"
  })

  .state('profileOwn', {
    url: "/profileOwn",
    templateUrl: 'templates/profileOwn.html',
    controller: "ProfileCtrl"
  })

  .state('profileOther', {
    url: "/profileOther/:profileId",
    templateUrl: "templates/profileOther.html",
    controller: "ProfileCtrl"
  })

  .state('pantry', {
    url: '/pantry',
    templateUrl: 'templates/pantry.html',
    controller: "PantryCtrl"
  })

  .state('diet', {
    url: '/diet',
    templateUrl: 'templates/diet.html',
    controller: "EditCtrl"
  })

  .state('conversations', {
    url: '/conversations',
    templateUrl: 'templates/conversations.html',
    controller: "ConversationsCtrl"
  })

  .state('chatroom', {
    url: '/chatroom/:chatId/user/:otheruser',
    templateUrl: 'templates/chatroom.html',
    controller: "ChatroomCtrl"
  })

  .state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html',
    controller: "SettingsCtrl"
  })

  .state('transactions', {
    url: '/transactions',
    templateUrl: 'templates/transactions.html',
    controller: "TransactionsCtrl"
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise(function($injector,$location) {
    setTimeout(function() {
      console.log('Could not find a state associated with url "'+$location.$$url+'"');
    $injector.get('$state').go('registration');
  }, 2000)
  });

  
  //$urlRouterProvider.otherwise(function () {angular.injector().get('$state').go('/registration');});
  /*$stateProvider.state('otherwise', {
    url: "*path",
    templateUrl: "templates/registration.html"
  });*/
/*$urlRouterProvider.otherwise(function ($injector, $location) {
        var $state = $injector.get('$state');

        $state.go('registration');
    });*/

  $resourceProvider.defaults.stripTrailingSlashes=false;
  delete $httpProvider.defaults.headers.common['X-Requested-Width'];
  $httpProvider.defaults.useXDomain=true;
  $locationProvider.html5Mode({
  enabled: true,
  requireBase: false
  });
  $locationProvider.html5Mode(true);

}])