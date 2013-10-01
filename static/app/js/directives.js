'use strict';

// Directives are HTML template building blocks. If the built in directives
// provided by Angular are not enough, or for convenience, it is possible to
// create your own.
angular.module('seed.directives', []).
  // Create a link to the API. Assumes usage in an anchor tag. Specify optional
  // item id as the attribute value. Replaces the href element attribute.
  // <a seed-href>...</a>
  // <a seed-href="10">...</a>
  directive('seedHref', ['Config', function(Config) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        attrs.$observe('seedHref', function(value) {
          var href = [Config.api_url, value].filter(function(value) {
            return '' != value;
          }).join('/');

          element.attr('href', href);
        });
      }
    };
  }]).
  // Display API path. Replaces the element text value.
  // <span seed-api></span>
  // <span seed-api="10"></span>
  directive('seedApi', ['Config', function(Config) {
    return {
      restrict: 'A',  
      link: function(scope, element, attrs) {
        attrs.$observe('seedApi', function(value) {
          var href = [Config.api_url, value].filter(function(value) {
            return '' != value;
          }).join('/');

          element.text(href);
        });
      }
    };
  }]).
  directive('seedList', [function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.text("Hello World");
      }
    };
  }]).
  directive('seedRoute', [function() {
    return {
      restrict: 'A',
      replace: false,
      transclude: true,
      //template: '<a href="{{value}}">Text</a>',
      scope: {
        href: '@seedRoute',
        path: '='
      },
      template: '<a href="#{{href}}" ng-transclude></a>',
      link: function(scope, element, attrs) {
        scope.$watch('path', function(value) {
          console.log(value);
          if (value === scope.href) {
            element.addClass('active');
          } else {
            element.removeClass('active');
          }
        });
      }

      /*
      link: function(scope, element, attrs) {
        attrs.$observe('seedRoute', function(value) {
          var href = ['#', value].join('');
          if (value === scope.path) {
            element.addClass('active');
          } else {
            element.removeClass('active');
          }
          console.log(value);

          var a = angular.element(element.children()[0]);
          a.attr('href', href);
        });
      }
      */
    };
  }]);