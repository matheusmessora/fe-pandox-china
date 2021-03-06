'use strict';

/* App Module */

var app = angular.module('pandox', ['ngCookies']);
app.run(function($rootScope, $templateCache) {
    $rootScope.$on('$viewContentLoaded', function() {
        $templateCache.removeAll();
    });
});

ANGULOSO.CONFIG.init();
app.config(ANGULOSO.CONFIG.anguloso);

app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/', {templateUrl: '/app/partials/index.html',   controller: IndexCtrl}).
            when('/busca', {templateUrl: '/app/partials/lista.html',   controller: ListaCtrl}).
            when('/senha', {templateUrl: '/app/partials/admin/senha.html',   controller: SenhaCtrl}).
            when('/cadastrar', {templateUrl: '/app/partials/cadastrar.html',   controller: UserCtrl}).
            when('/login', {templateUrl: '/app/partials/login.html',   controller: LoginCtrl}).
            when('/logout', {templateUrl: '/app/partials/index.html',   controller: LogoutCtrl}).
            when('/admin', {templateUrl: '/app/partials/admin/admin.html', controller: AdminCtrl}).
            when('/loja/:name', {templateUrl: '/app/partials/userPage.html', controller: UserPageCtrl}).
            otherwise({redirectTo: '/'});
}]);


app.directive('ngFocus', function() {
    return function(scope, element, attrs) {

        element.bind('focus', function(){
            scope.$eval(attrs.ngFocus)
        });
    }
});