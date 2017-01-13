angular.module('demo', ['ionic'])

    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('root', {
                url : '/root',
                templateUrl : 'root.html',
                controller : 'RootPageController'
            })

            .state('fst', {
                url : '/fst',
                templateUrl : 'fst-abstract.html',
                abstract : true,
                controller : 'FstController'
            })
            .state('fst.home', {
                url: '/home',
                views: {
                    'fst': {
                        templateUrl: 'fst-home.html',
                        controller : 'FstHomePageController'
                    }
                }
            })
            .state('fst.first', {
                url: '/first',
                views: {
                    'fst': {
                        templateUrl: 'fst-first.html',
                        controller : 'FstFirstPageController'
                    }
                }
            })
            .state('fst.second', {
                url: '/second',
                views: {
                    'fst': {
                        templateUrl: 'fst-second.html',
                        controller : 'FstSecondPageController'
                    }
                }
            })

            .state('snd', {
                url : '/snd',
                templateUrl : 'snd-abstract.html',
                abstract : true,
                controller : 'SndController'
            })
            .state('snd.home', {
                url: '/home',
                views: {
                    'snd': {
                        templateUrl: 'snd-home.html',
                        controller : 'SndHomePageController'
                    }
                }
            })
            .state('snd.chat', {
                url: '/chat',
                views: {
                    'snd': {
                        templateUrl: 'snd-chat.html',
                        controller : 'SndChatPageController'
                    }
                }
            })
            .state('snd.chat-single', {
              url: '/chat-single',
              views: {
                'snd': {
                  templateUrl: 'snd-chat-single.html',
                  controller : 'SndChatSinglePageController'
                }
              }
            })
            .state('snd.drink', {
                url: '/drink',
                views: {
                    'snd': {
                        templateUrl: 'snd-drink.html',
                        controller : 'SndDrinkPageController'
                    }
                }
            })
            .state('snd.policy', {
                url: '/policy',
                views: {
                    'snd': {
                        templateUrl: 'snd-policy.html',
                        controller : 'SndPolicyPageController'
                    }
                }
            })

        $urlRouterProvider.otherwise('/root');
    }])