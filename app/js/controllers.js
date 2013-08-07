'use strict';

/* Controllers */
function IndexCtrl($scope, $http, $route, $routeParams) {
    $http.get('/api/page').success(function(data) {
        $scope.pages = data;
    });

    $scope.orderProp = "name";

    $scope.hello = "Hello World!";

    console.log($routeParams);
}

function UserPageCtrl($rootScope, $scope, $http, $route, $routeParams, $compile, $location) {
    var url = '/api/page?url=' + $location.path().substring(1);
    $http.get(url).success(function(data) {
        $scope.page = data[0];
        console.log($scope.page);

        $rootScope.bg = 'background: rgb(172, 222, 214) url("http://cdn.pandox.com.br/img/user-bg/' + data[0].img + '");';
    });

}

function AdminCtrl($scope, $http, $cookies, $cookieStore) {
    var url = '/api/page';
    if($cookieStore.get('PID')){
        url += ('?user='+$cookieStore.get('PID'));
    }
    $http.get(url).success(function(data) {
        $scope.pages = data;
    });

    $scope.reset = function(){
        var url = '/api/page';
        if($cookieStore.get('PID')){
            url += ('?user='+$cookieStore.get('PID'));
        }
        $http.get(url).success(function(data) {
            $scope.pages = data;
        });

        $scope.closeModal();
        $("#pageForm").hide();
        if($scope.pages.length > 0){
            $("#tablePage").show();
        }else {
            $("#pageForm").show();
            $("#pageFormH1").html("Crie sua página");
            $scope.pages = null;
        }
    };

    $scope.hello = $cookies.userName;

    $scope.edit = function(page) {
        $scope.pageForm = JSON.parse(JSON.stringify(page));
        $("#pageForm").show();
        $("#tablePage").hide();
        $("#pageFormH1").html("Editar página")
    };

    $scope.openModal = function(page){
        $scope.page = page;
        $('#deletePageModal').modal('show');
    };

    $scope.closeModal = function(){
        $('#deletePageModal').modal('hide');
    };

    $scope.delete = function(page){
        $http.delete('/api/page/' + page.id, PANDOX.SYSTEM.httpConfig())
            .success(function(data, status) {
                console.log("DELETE:" + status, data);
                PANDOX.UI.showMessage("Pagina deletada com sucesso.", 'danger');
                $scope.reset();
            })
            .error(function(data, status) {
                if(status == 401){ // Unathorized
                    PANDOX.UI.showMessage("Dados não conferem.", 'danger');
                }else {
                    PANDOX.UI.showMessage(data, 'danger');
                }
            });

        $scope.closeModal();
    };

    $scope.persist = function(page){
        $http.post('/api/page/', page, PANDOX.SYSTEM.httpConfig())
            .success(function(data, status) {
                console.log("INSERT:" + status, data);
                PANDOX.UI.showMessage('Pagina cadastrada com sucesso', 'success');
                $scope.pages.removeItem(page);
                $scope.pages.push(page);
            })
            .error(function(data, status) {
                PANDOX.UI.showMessage(data, 'danger');
            });
    };
}

function LoginCtrl($scope, $http, $location, $cookies, $cookieStore) {
    $scope.login = function(user) {
        PANDOX.UI.hideMessage();
        if(isValid(user)){
            $http.post('/api/user/login', user, PANDOX.SYSTEM.httpConfig())
                .success(function(data, status) {
                    console.log("LOGIN:" + status, data);
                    $cookieStore.put('PID', data.id);
                    $cookieStore.put('userName', data.name);
                    $location.path('/admin');
                })
                .error(function(data, status) {
                    if(status == 401){ // Unathorized
                        PANDOX.UI.showMessage("Dados não conferem.", 'danger');
                    }else {
                        PANDOX.UI.showMessage(data, 'danger');
                    }
                });
        }
    };

    $scope.clearField = function(fieldId){
        $("#" + fieldId + "Div").removeClass("has-error");
        $("#" + fieldId).next().hide();
    };

    // Validador de Form User
    var isValid = function(user) {
        $(".help-inline").hide();

        var isValid = true;

        var value = $("#email").val();
        if (!value) {
            $("#emailDiv").addClass("has-error");
            $("#email").next().html("Informe seu e-mail.");
            isValid = false;
        }

        value = $("#password").val();
        if (!value) {
            $("#passwordDiv").addClass("has-error");
            $("#password").next().html("A senha é obrigatória.");
            isValid = false;
        }

        if (!isValid) {
            $(".help-block").show('slow');
        }

        return isValid;
    };
}

function UserCtrl($scope, $http, $location, $cookies) {
    $scope.persist = function(user) {
        PANDOX.UI.hideMessage();
        if(isValid(user)){
            $http.post('/api/user', user)
                .success(function(data, status) {
                    console.log("SUCESSO:" + status, data);
                    $cookieStore.put('PID', data.id);
                    $cookieStore.put('userName', data.name);
                    $location.path('/admin');
                })
                .error(function(data, status) {
                    console.log("FALHA:" + status + data);
                    PANDOX.UI.showMessage(data, 'danger');
                });
        }else {
            console.log("FORM INVALID");
        }
    };

    $scope.clearField = function(fieldId){
        $("#" + fieldId + "Div").removeClass("has-error");
        $("#" + fieldId).next().hide();
    };

    // Validador de Form User
    var isValid = function(user) {
        $(".help-inline").hide();

        var isValid = true;
        var value = $("#name").val();
        if (!value) {
            $("#nameDiv").addClass("has-error");
            $("#name").next().html("Digite seu nome.");
            isValid = false;
        }

        value = $("#email").val();
        if (!value) {
            $("#emailDiv").addClass("has-error");
            $("#email").next().html("Seu e-mail é obrigatório.");
            isValid = false;
        }

        value = $("#password").val();
        if (!value) {
            $("#passwordDiv").addClass("has-error");
            $("#password").next().html("A senha é obrigatória.");
            isValid = false;
        }

        if (!isValid) {
            $(".help-block").show('slow');
        }

        return isValid;
    };
}
