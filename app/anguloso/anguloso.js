/**
 * Created by pegasus on 1/27/14.
 */



var anguloso = function ($provide, $httpProvider) {

//    "http://cdn.pandox.com.br/app/anguloso/anguloso.html",
//
//    $.ajax({
//        url: "http://cdn.pandox.com.br/app/anguloso/anguloso.html",
//        cache: false
//    }).done(function( html ) {
//            console.log(html);
//        $( "#results" ).append( html );
//    });

    $provide.factory('angulosoInterceptor', function ($q) {
        return {
            // On request success
            request: function (config) {
                return config || $q.when(config);
            },

            requestError: function (rejection) {
                return $q.reject(rejection);
            },

            response: function (response) {

                var path = response.config.url;
                if(path.indexOf(".html") == -1) {
                    var data = response.data;
                    console.log("[anguloso] url:" + path, data);
                    $("#fb-root").append(angular.toJson(data, true) + "</br ></br >");
                }

                return response || $q.when(response);
            },

            responseError: function (rejection) {
                return $q.reject(rejection);
            }
        };
    });

    // Add the interceptor to the $httpProvider.
    $httpProvider.interceptors.push('angulosoInterceptor');
};
