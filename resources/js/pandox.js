
var PANDOX = PANDOX || {};



/******************************************************************************************************
 * Pandox Facebook Module
 ******************************************************************************************************/
PANDOX.UI = function () {

    var closeModal = function() {
        $("#closeModal").click();
    };



    /******************************************************************************************************
     * Highligth the menu Header with the param given
     * @menuId Find the menuId of the DOM to highligth
     ******************************************************************************************************/
    var highligthHeader = function(menuId){
        $("#menul").find("li").removeClass('active');
        $("#" + menuId).addClass('active');
    };

    /******************************************************************************************************
     * Highligth the Admin Menu Header with the param given
     * @menuId Find the menuId of the DOM to highligth
     ******************************************************************************************************/
    var highligthAdminMenu = function(menuId){
        console.log("active=" + menuId)
        $("#adminul").find("li").removeClass('active');
        $("#" + menuId).addClass('active');
    };


    /******************************************************************************************************
     * Verify if the user is logged in the system
     ******************************************************************************************************/
    var isUserLogged = function(){
        return true;
    }


    /******************************************************************************************************
     * Render the welcome message with the userName provided
     ******************************************************************************************************/
    var showWelcome= function(userName){
        $('#navBarUser').show();
        $('#navBarSettings').show();
        $('#navBarLogout').show();
        $('#menuLogin').hide();
        $('#navBarUser').html('Bem vindo, ' + userName);
    };

    var logout = function(){
        $('#navBarUser').hide();
        $('#navBarSettings').hide();
        $('#navBarLogout').hide();
        $('#menuLogin').show();
        $('#navBarUser').html('');
    }

    var init = function(){
        console.log("PANDOX.UI.init()");
    };


    /******************************************************************************************************
     * Generate a message Box in the page.
     * @param text Text to be show
     * @param css CSS class to provide to the box. Valid class are: success, danger, info
     ******************************************************************************************************/
    var showMessage = function(text, css){
        clearMessageBox();

        var box = $("#messageBox");
        box.addClass("alert-" + css);
        box.show("slow");

        $("#messageBoxTxt").html(text);
    };

    var clearMessageBox = function(){
        var box = $("#messageBox");
        box.removeClass("alert-success");
        box.removeClass("alert-danger");
        box.removeClass("alert-info");

        hideMessage();
    };

    var hideMessage = function(){
        $("#messageBox").hide();
    };


    /******************************************************************************************************
     * Populate the PageForm with the pageId
     * @param id - Page id
     ******************************************************************************************************/
    var renderPageToEdit = function(id){
        $.getJSON('/page/' + id, function() {})
            .done(function(page) {
                if(page != null){
                    console.log("Page found...");
                    $("#id").attr('value', page.id);
                    $("#url").attr('value', page.url);
                    $("#mainColor").attr('value', page.mainColor);
                    $("#email").attr('value', page.email);
                    $("#img").attr('value', page.img);

                    $("#ddd").attr('value', page.phones[0].ddd);
                    $("#phone").attr('value', page.phones[0].phone);

                    showPageForm(true);
                }else {
                    console.log("FALHA no PAGE..." + id);
                }
            })
            .fail(function() {
                console.log("Fails...");
            });
    };



    return {
        init: init,
        showWelcome: showWelcome,
        logout: logout,
        highligthHeader: highligthHeader,
        highligthAdminMenu: highligthAdminMenu,
        hideMessage: hideMessage,
        clearMessageBox: clearMessageBox,
        showMessage: showMessage
    };
}();



/*=====================================================================================================
 * Pandox SYSTEM Module
 *======================================================================================================*/
PANDOX.SYSTEM = function() {

    var init = function(){
        console.log("PANDOX.SYSTEM.init()");
    };

    var isValidFormChangePassword = function(){
        $(".help-block").hide();
        $(".help-block").html('');

        var isValid = true;

        var value = $("#oldPassword").val();
        if (!value) {
            $("#oldPasswordDiv").addClass("has-error");
            $("#oldPassword").next().html("Informe sua senha atual.");
            isValid = false;
        }

        value = $("#password").val();
        if (!value) {
            $("#passwordDiv").addClass("has-error");
            $("#password").next().html("A nova senha é obrigatória.");
            isValid = false;
        }

        value = $("#passwordConfirm").val();
        if (!value) {
            $("#passwordConfirmDiv").addClass("has-error");
            $("#passwordConfirm").next().html("A confirmação de senha é obrigatória.");
            isValid = false;
        }

        if(isValid){
            var pwd1 = $("#password").val();
            var pwd2 = $("#passwordConfirm").val();
            if(pwd1 != pwd2){
                $("#passwordConfirmDiv").addClass("has-error");
                $("#passwordConfirm").next().html("As senhas não conferem.");

                isValid = false;
            }
        }


        if (!isValid) {
            $(".help-block").show('slow');
        }

        return isValid;
    }

    var httpConfig = function(){
        return {headers: {
            'Accept': 'application/json;charset=UTF-8;'
        }};
    }


    var deletePage = function(pageId){
        $.ajax({
            url: '/page/' + pageId,
            type: 'DELETE'})
            .done(function(result) {
                PANDOX.UI.closeModal();
                PANDOX.UI.showMessage("Página removida com sucesso.", "alert-success");
                PANDOX.UI.showPageForm(false);
            })
            .fail(function(result) {
                PANDOX.UI.closeModal();
                PANDOX.UI.showMessage("<strong>Oooops!</strong> Ocorreu uma falha nos nossos servidores. Já estamos trabalhando para resolver isso.", "alert-error");
            })
    };

    return {
        init: init,
        httpConfig: httpConfig,
        //httpConfig2: httpConfig2,
        isValidFormChangePassword: isValidFormChangePassword,
        deletePage: deletePage
    };

}();

PANDOX.UI.init();
PANDOX.SYSTEM.init();

