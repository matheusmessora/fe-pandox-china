'use strict';

/* Controllers */
function IndexCtrl($scope, $http, $routeParams, auguloso) {
    PANDOX.UI.highligthHeader('menuHome');
    $http.get('/api/page').success(function(data) {
        $scope.pages = data;
    });

    $scope.orderProp = "name";
    $scope.hello = "Hello World!";
    console.log($routeParams);
}

function ListaCtrl($scope, $http) {
    PANDOX.UI.highligthHeader('menuLista');

    $http.get('/api/page').success(function(data) {
        $scope.pages = data;
    });
}

function UserPageCtrl($rootScope, $scope, $http, $routeParams, $location) {

    var url = '/api/page?url=' + $location.path().substring(6);
    $http.get(url).success(function(data) {
        $scope.page = data[0];
        console.log($scope.page);

        //$rootScope.bg = 'background: rgb(172, 222, 214) url("http://cdn.pandox.com.br/img/user-bg/' + data[0].img + '");';
    });
}

function AdminCtrl($scope, $http, $cookies, $cookieStore, $templateCache) {
    PANDOX.UI.highligthHeader('menuHome');
    PANDOX.UI.highligthAdminMenu('pageli');

    var url = '/api/page';
    if($cookieStore.get('PID')){
        url += ('?user='+$cookieStore.get('PID'));
    }
    $http.get(url).success(function(data) {
        console.log("pages=", data);
        $scope.pages = data;
    });

    // SERVICE FOR CATEGORY
    var url = '/api/category';
    $http.get(url).success(function(data) {
        $scope.categoryList = data;
    });

    // SERVICE FOR QUALITY
    var url = '/api/quality';
    $http.get(url).success(function(data) {
        $scope.qualityList = data;
    });

    $scope.toggle = function (quality) {
        quality.selected = !quality.selected;
    };

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
        var phones = new Array(1);
        phones[0] = { };
        $scope.pageForm = JSON.parse(JSON.stringify(page));
        console.log("pageForm=", JSON.parse(JSON.stringify(page)));
//        if($scope.pageForm.phones){
//            phones = $scope.pageForm.phones;
//        }
//        $scope.pageForm.phonesForm = phones;
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
        console.log(page);
        console.log()
//        $http.post('/api/page/', page, PANDOX.SYSTEM.httpConfig())
//            .success(function(data, status) {
//                console.log("INSERT:" + status, data);
//                PANDOX.UI.showMessage('Pagina cadastrada com sucesso', 'success');
//                $scope.pages.removeItem(page);
//                $scope.pages.push(page);
//            })
//            .error(function(data, status) {
//                PANDOX.UI.showMessage(data, 'danger');
//            });
    };
}

function SenhaCtrl($scope, $http, $location, $cookies, $cookieStore) {
    PANDOX.UI.highligthAdminMenu('pwdli');

    $scope.clearField = function(fieldId){
        $("#" + fieldId + "Div").removeClass("has-error");
        $("#" + fieldId).next().hide();
        $("#" + fieldId).next().html('');
    };

    $scope.changePwd = function(user){
        PANDOX.UI.hideMessage();
        if(PANDOX.SYSTEM.isValidFormChangePassword()){

            $http.post('/api/user/passwd', user, PANDOX.SYSTEM.httpConfig())
                .success(function(data, status) {
                    $location.path('/admin');
                    PANDOX.UI.showMessage("Senha alterada com sucesso.", 'success');
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
}

function LogoutCtrl($scope, $http, $location, $cookies, $cookieStore) {
    PANDOX.UI.logout();

    $cookieStore.remove('PID');
    $cookieStore.remove('userName');
    $location.path('/');
}

function LoginCtrl($scope, $http, $location, $cookies, $cookieStore) {
    PANDOX.UI.hideMessage();
    PANDOX.UI.highligthHeader('menuLogin');


    $scope.login = function(user) {
        PANDOX.UI.hideMessage();
        if(isValid(user)){
            $http.post('/api/user/login', user, PANDOX.SYSTEM.httpConfig())
                .success(function(data, status) {
                    console.log("LOGIN:" + status, data);
                    $cookieStore.put('PID', data.id);
                    $cookieStore.put('userName', data.name);
                    $location.path('/admin');
                    PANDOX.UI.showWelcome(data.name);
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

function UserCtrl($scope, $http, $location, $cookies, $cookieStore) {
    $scope.persist = function(user) {
        PANDOX.UI.hideMessage();
        if(isValid(user)){
            $http.post('/api/user', user, PANDOX.SYSTEM.httpConfig())
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
