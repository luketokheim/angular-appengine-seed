'use strict';

// Declare the application module and declare its dependencies. By convention,
// app specific sub-modules are named "seed.*". 
angular.module('seed', ['ui.router',
                        'seed.controllers', 'seed.directives',
                        'seed.filters', 'seed.services', 'seed.states']).
  constant('Config', {
    // REST service.
    api_url: '/_ah/api/seed/v1/model',
    // Display more technical information in views.
    debug: false,
    // Default limit on the list of items we request in a query.
    list_limit: 5,
    // Application version.
    version: 1
  }).
  run(['$rootScope', '$state', '$stateParams', 'Config',
    function($rootScope, $state, $stateParams, Config) {
      // As per ui-router docs...
      // It's very handy to add references to $state and $stateParams to the
      // $rootScope so that you can access them from any scope within your
      // applications. For example,
      // <li ng-class="{active: $state.includes('contacts.list')}"> will set
      // the <li> to active whenever 'contacts.list' or one of its decendents is
      // active.      
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

      $rootScope.$config = Config;

      // Use this to detect when a resolve fails during a view/controller
      // change. This would probably indicate a communication error with the
      // API. Show an error page.
      $rootScope.$on('$stateChangeError',
        function(event, toState, toParams, fromState, fromParams, error) {
          if ('error' !== toState.name) {
            $state.go('error');
          }
        }
      );
    }
  ]).
  // Prevent scrolling back to the top of the page every time the route changes.
  value('$anchorScroll', angular.noop);