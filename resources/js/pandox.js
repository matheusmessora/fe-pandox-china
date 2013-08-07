
var PANDOX = PANDOX || {};


/******************************************************************************************************
 * Pandox Facebook Module
 ******************************************************************************************************/
PANDOX.UI = function () {

    var closeModal = function() {
        $("#closeModal").click();
    };

    var init = function(){
        console.log("PANDOX.UI.init()");
    };


    /******************************************************************************************************
     * Generate a message Box in the page.
     * @param text Text to be show
     * @param css CSS class to provide to the box. Valid class are: success, danger, info
     ******************************************************************************************************/
    var showMessage = function(text, css){
        var box = $("#messageBox");
        box.addClass("alert-" + css);
        box.show("slow");

        $("#messageBoxTxt").html(text);
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
        hideMessage: hideMessage,
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

    var httpConfig = function(){
        return {headers: {
            'Accept': 'application/json;charset=utf-8;'
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
        deletePage: deletePage
    };

}();

PANDOX.UI.init();
PANDOX.SYSTEM.init();

