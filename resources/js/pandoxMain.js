/**
 * ===============================
 * |        FACEBOOK SDK         |
 * ===============================
 */
//window.fbAsyncInit = function() {
//
//    FB.init({
//        appId      : '419303404849927', // App ID
//        channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
//        status     : true, // check login status
//        cookie     : true, // enable cookies to allow the server to access the session
//        xfbml      : true  // parse XFBML
//    });
//    jQuery('#fb-root').trigger('facebook:init');
//
//    // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
//    // for any authentication related change, such as login, logout or session refresh. This means that
//    // whenever someone who was previously logged out tries to log in again, the correct case below
//    // will be handled.
//    FB.Event.subscribe('auth.authResponseChange', function(fbResponse) {
//        // Here we specify what we do with the response anytime this event occurs.
//        if (fbResponse.status === 'connected') {
//            console.log(fbResponse);
//            // The response object is returned with a status field that lets the app know the current
//            // login status of the person. In this case, we're handling the situation where they
//            // have logged in to the app.
//            loginPandox(fbResponse);
//        } else if (response.status === 'not_authorized') {
//            // In this case, the person is logged into Facebook, but not into the app, so we call
//            // FB.login() to prompt them to do so.
//            // In real-life usage, you wouldn't want to immediately prompt someone to login
//            // like this, for two reasons:
//            // (1) JavaScript created popup windows are blocked by most browsers unless they
//            // result from direct interaction from people using the app (such as a mouse click)
//            // (2) it is a bad experience to be continually prompted to login upon page load.
//            FB.login();
//        } else {
//            // In this case, the person is not logged into Facebook, so we call the login()
//            // function to prompt them to do so. Note that at this stage there is no indication
//            // of whether they are logged into the app. If they aren't then they'll see the Login
//            // dialog right after they log in to Facebook.
//            // The same caveats as above apply to the FB.login() call here.
//            FB.login();
//        }
//    });
//};
//
//// Load the SDK asynchronously
//(function(d){
//    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
//    if (d.getElementById(id)) {return;}
//    js = d.createElement('script'); js.id = id; js.async = true;
//    js.src = "//connect.facebook.net/en_US/all.js";
//    ref.parentNode.insertBefore(js, ref);
//}(document));
//
//// Here we run a very simple test of the Graph API after login is successful.
//// This testAPI() function is only called in those cases.
//function loginPandox(fbResponse) {
//    FB.api('/me', function(response) {
//        var user = new Object();
//        user.uid = response.id;
//        user.name = response.name;
//        user.accessToken = fbResponse.authResponse.accessToken;
//
//        loginUser(user);
//
//    });
//}
//function loginUser(user){
//    // Assign handlers immediately after making the request,
//    // and remember the jqxhr object for this request
//    console.log('Log in to Pandox. user=' + user.uid);
//    var jqxhr = $.getJSON('/user?uid=' + user.uid, function() {})
//        .done(function(data) {
//            if(data == null){
//                console.log("Creating user...");
//                createUser(user);
//            }else {
//                console.log("Logado...", data);
//                PANDOX.UI.renderWelcome(data);
//            }
//        })
//        .fail(function() {
//            console.log("Fails...");
////            createUser(user);
//        });
//}
//function createUser(user){
//    console.log("Creating user.");
//    console.log(user);
//    var json = JSON.stringify(user);
//
//    console.log(json);
//
//    $.ajax({
//        type : 'POST',
//        url : 'user',
//        contentType : 'application/json',
//        dataType : 'json',
//        data: json,
//        success: function(response){
//            window.location = "usuario/" + response.id + "/admin";
//            PANDOX.UI.showMessage(response.message, "alert-success");
//        }
//    });
//}
/**
 * ===============================
 * |              END            |
 * ===============================
 */




var PANDOX = PANDOX || {};


/******************************************************************************************************
 * Pandox Facebook Module
 ******************************************************************************************************/
PANDOX.FACEBOOK = function () {

    var init = function (){
        console.log("init()");
    };

    var getFeed = function(id){
        var jqxhr = $.getJSON('/user/' + id + "/feed", function() {})
            .done(function(response) {
                if(response !== null){
                    console.log("User Feed found...");
                    renderWall(response.data);
                }else {
                    console.log("FALHA no FEED..." + id);
                }
            })
            .fail(function() {
                console.log("Fails...");
            });
    };

    var getUserPicture = function(id, divId){
        var jqxhr = $.getJSON('http://graph.facebook.com/' + id + '?fields=picture', function() {})
            .done(function(response) {
                if(response !== null){
                    console.log("getUserPicture. ", response);
                    $("#" + divId).attr("src",response.picture.data.url);
                }else {
                    console.log("FALHA no UserPicture..." + id);
                }
            })
            .fail(function() {
                console.log("Fails...");
            });
    };


    /******************************************************************************************************
     * Render Facebook WALL
     * @param data
     ******************************************************************************************************/
    var renderWall = function(data){
        $.each(data, function(key, val) {
            var wall = $("#social");

            var output = '';

            output += '<div class="span4 metro">';

            output += '<div class="owner">';
            output += '<a href="http://www.facebook.com/profile.php?id=' + val.from.id + '" target="_blank">';
            output += val.from.name;
            output += '</a>';
            output += '</div>';
            output += '<div class="postdate">';
            output += PANDOX.UI.formatDate(val.created_time);
            output += '</div>';
            output += '<div class="clearfix"> </div>';

            output += '<div class="message">';
            if(val.message != null){
                output += val.message;
            }
            output += '</div>';

            if(isMediaPost(val)){
                output += generateMediaPost(val);
            }
            if(hasComment(val)){
                output += generateComment(val);
            }

            output += '</div>';
            wall.append(output);
        });
    };

    /**
     * Validade if post is MEDIA format
     * @param data
     */
    var isMediaPost = function(data){
        return (exists(data.description) || exists(data.link));
    };

    /**
     * Validade if post has Comments
     * @param data
     */
    var hasComment = function(data){
        return (exists(data.comments));
    };

    /**
     * Generate a Media Post for Wall
     * @param data
     */
    var generateMediaPost = function(data){
        var output = '';

        output += '<div class="mediaPost">';
        if(exists(data.picture)){
            output += '<a href="' + data.link + '" target="_blank">';
            output += '<img src=' + print(data.picture) + '  />';
            output += '</a>'
        }
        output += '<div class="mediaBox">';

        output += '<a href="' + data.link + '" target="_blank">';
        output += '<span class="title">' + print(data.name) + '</span><br />';
        output += '</a>'
        if(exists(data.caption)) {
            output += '<a href="' + data.link + '" target="_blank">';
            output += '<span class="subtitle">' + print(data.caption) + '</span><br /><br />';
            output += '</a>'
        }
        output += '<span class="message">' + print(data.description) + '</span>';
        output += '</div>';
        output += '<div class="clearfix"> </div>';
        output += '</div>';

        return output;
    };

    /**
     * Generate a Comments session
     * @param data
     */
    var generateComment = function(data){
        var output = '';

        $.each(data.comments.data, function(key, comment) {

            output += '<div class="commentBox">';
            output += '<div class="photo">';
            output += '<a class="user" href="http://www.facebook.com/profile.php?id=' + comment.from.id + '" target="_blank">';
            output += '<img src="" width="32px" height="32px" id="commentator' + key + '" />';
            getUserPicture(comment.from.id, ("commentator" + key));
            output += '</a>';
            output += '</div>';
            output += '<div class="comment">';
            output += '<span class="user">';
            output += '<a class="user" href="http://www.facebook.com/profile.php?id=' + comment.from.id + '" target="_blank">';
            output += '<span class="user">' + print(comment.from.name) + '</a></span> ';
            output += print(comment.message);
            output += '<span class="date">' + PANDOX.UI.formatDate(comment.created_time);+ '</span>'

            output += '</div>';
            output += '<div class="clearfix"> </div>';
            output += '</div>';
        });

        return output;
    };

    /******************************************************************************************************
     * Helper Function
     ******************************************************************************************************/

    var exists = function(data){
        if(!data || data==null || data=='undefined' || typeof(data)=='undefined') return false;
        else return true;
    }

    /**
     * Normalize a text to print.
     * It just removes any undefined text
     * @param text
     */
    var print = function(text){
        if(exists(text)){
            return text;
        }
        return '';
    };


//    PUBLIC INTERFACE
    return {
        init: init,
        getFeed: getFeed,
        getUserPicture: getUserPicture
    };
}();


/*=====================================================================================================
 * Pandox SYSTEM Module
 *======================================================================================================*/
PANDOX.SYSTEM = function() {

    var init = function(){

    };


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
        deletePage: deletePage
    };

}();




/******************************************************************************************************
 * Pandox UI Module
 ******************************************************************************************************/
PANDOX.UI = function() {


    /******************************************************************************************************
     * Generate a message Box in the page.
     * @param text Text to be show
     * @param css CSS class to provide to the box. Valid class are: alert-success, alert-error, alert-warning
     ******************************************************************************************************/
    var showMessage = function(text, css){
        var box = $("#msgBox");

        box.append(text);
        box.addClass(css);
        box.show("slow");
    };

    /******************************************************************************************************
     * Renders the navBar welcome message
     * @param socialUser - JSON returned with the User logged in
     ******************************************************************************************************/
    var renderWelcome = function(socialUser){
        $("#fb-login").hide();

        var box = $("#welcome");
        box.append('<img src="" width="32px" height="32px" id="welcomeProfile" />');
        PANDOX.FACEBOOK.getUserPicture(socialUser.uid, "welcomeProfile");
        box.append("Bem vindo, " + socialUser.name);
        box.show();

        var navBarControlPanel = $("#navBarControlPanel");
        navBarControlPanel.attr('href', '/usuario/' + socialUser.id + '/admin');
        navBarControlPanel.show();
    };


    /******************************************************************************************************
     * Parse dateStr as formatted date
     * @return: if dateStr can't be parsed as Date, return dateStr
     * @credits: neosmart.de/social-media/facebook-wall/
     ******************************************************************************************************/
    var formatDate = function formatDate(dateStr){
        var year, month, day, hour, minute, dateUTC, date, ampm, d, time;
        var iso = (dateStr.indexOf(' ')==-1&&dateStr.substr(4,1)=='-'&&dateStr.substr(7,1)=='-'&&dateStr.substr(10,1)=='T') ? true : false;

        if(iso){
            year = dateStr.substr(0,4);
            month = parseInt((dateStr.substr(5,1)=='0') ? dateStr.substr(6,1) : dateStr.substr(5,2))-1;
            day = dateStr.substr(8,2);
            hour = dateStr.substr(11,2);
            minute = dateStr.substr(14,2);
            dateUTC = Date.UTC(year, month, day, hour, minute);
            date = new Date(dateUTC);
        }else{
            d = dateStr.split(' ');
            if(d.length!=6||d[4]!='at')
                return dateStr;
            time = d[5].split(':');
            ampm = time[1].substr(2);
            minute = time[1].substr(0,2);
            hour = parseInt(time[0]);
            if(ampm=='pm')hour+=12;
            date = new Date(d[1]+' '+d[2]+' '+d[3] +' '+ hour+':'+minute);
            date.setTime(date.getTime()-(1000*60*60*7));
        }
        day = (date.getDate()<10)?'0'+date.getDate():date.getDate();
        month = date.getMonth()+1;
        month = (month<10)?'0'+month:month;
        hour = date.getHours();
        minute = (date.getMinutes()<10)?'0'+date.getMinutes():date.getMinutes();
    //            if(o.timeConversion==12){
    //                ampm = (hour<12) ? 'am' : 'pm';
    //                if(hour==0)hour==x12;
    //                else if(hour>12)hour=hour-12;
    //                if(hour<10)hour='0'+hour;
    //                return day+'.'+month+'.'+date.getFullYear()+' at '+hour+':'+minute+' '+ampm;
    //            }
    //            return day+'.'+month+'.'+date.getFullYear()+' '+o.translateAt+' '+hour+':'+minute;
    //            return day+'/'+month+'/'+date.getFullYear()+' às '+hour+':'+minute;
        return day+'/'+month+'/'+date.getFullYear();
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

    /******************************************************************************************************
     * Show the PageForm.
     * @param isEdit - TRUE or FALSE.
     ******************************************************************************************************/
    var showPageForm = function(isEdit){
        $("#pageForm").show('slow');
        if(isEdit){
            $("#pageFormH1").html("Edite sua página")
        }else {
            $("#pageFormH1").html("Cadastre sua página")
        }
    };

    var closeModal = function() {
        $("#closeModal").click();
    };

    var init = function(){
        console.log("UI.init()");

        // --- PAGE FORM ---
        $(".btn-edit").click(function (){
            renderPageToEdit($(this).attr('data-pageid'));
            $(".btn").removeClass("disabled");
        });
        $(".btn-trash").click(function (){
            $("#pageNameTrash").html($(this).attr('data-pagename'));
            $("#excluirModal").attr('data-pageId', $(this).attr('data-pageid'))
        });
        $(".btn-exclude").click(function (){
            PANDOX.SYSTEM.deletePage($("#excluirModal").attr('data-pageid'));
        });
    };


    return {
        init: init,
        closeModal: closeModal,
        showMessage: showMessage,
        renderWelcome: renderWelcome,
        renderPageToEdit: renderPageToEdit,
        showPageForm: showPageForm,
        formatDate: formatDate
    };

}();


PANDOX.UI.init();
PANDOX.SYSTEM.init();


$("#userPageBox").ready(function() {
    var id = $("#userPageBox").attr('data-id');
    PANDOX.FACEBOOK.getFeed(id);
});
