var ANGULOSO = ANGULOSO || {};

ANGULOSO.CONFIG = function () {

    var init = function(){
        console.log("[anguloso] Iniciando Configuracao do Anguloso");

        $.ajax({
            url: "http://pandox.com.br/anguloso/teste",
            cache: false
        }).done(function( html ) {
                $( "body" ).prepend( html );
                console.log("[anguloso] Anguloso carregado com sucesso");
            });
    };

    var anguloso = function ($provide, $httpProvider) {

        //"http://pandox.com.br/anguloso/teste",

        $provide.factory('angulosoInterceptor', function ($q) {
            return {
                // On request success
                request: function (config) {
                    var path = config.url;
                    if(path.indexOf(".html") == -1) {
                        console.log("[anguloso][request] url:" + path);

                        $.ajax({
                            url:"anguloso/teste",
                            type:"POST",
                            data: JSON.stringify({path: path, requestDate: new Date()}),
                            contentType:"application/json; charset=utf-8",
                            dataType:"json",
                            success: function(result){
                                var div = "<p>";
                                console.log(result.id + " | " + result.path);
                                div += result.id + " | " + result.path;
                                div += "<br />";


                                div += "</p>";
                                $("#anguloso").append(div);

                            }
                        })

                    }

                    return config || $q.when(config);
                },

                requestError: function (rejection) {
                    return $q.reject(rejection);
                },

                response: function (response) {

                    var path = response.config.url;
                    if(path.indexOf(".html") == -1) {
                        var data = response.data;
//                        console.log("[anguloso][response] url:" + path, data);
                        console.log("[anguloso][response] url:" + path, response.data);

                        $.ajax({
                            url:"anguloso/teste",
                            type:"POST",
                            data: JSON.stringify({path: path, responseDate: new Date(), httpStatus: response.status, json: response.data.toString()}),
                            contentType:"application/json; charset=utf-8",
                            dataType:"json",
                            success: function(result){
                                var div = "<p>";
                                var element;
                                for (var i = 0; i < result.length; i++) {
                                    element = result[i];
                                    div += angular.toJson(element, true);
                                    div += "<br />"
                                }


                                div += "</p>";
                                console.log("[anguloso][div]", result);
                                $("#anguloso").append(div);


                            }
                        })

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

    return {
        anguloso: anguloso,
        init: init
    };

}();


ANGULOSO.WATCHER = function(){

    var watch = function($scope){
        console.log("[anguloso][watcher] ", $scope);
//        $("#watchers").append("ABC<br />");
        console.log("[anguloso][watcher] MMMMM ", $scope);
    };


    return {
        watch: watch
    };

}();