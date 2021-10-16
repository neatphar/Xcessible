function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function initArtyom(voice_commands){
    var local_artyom = new Artyom();
    voice_commands.push({
        indexes: ["Stop", "Shut up"],
        action: function(i){ 
            saySomething(local_artyom, "Okay, sorry.");
        }
    });
    local_artyom.addCommands(voice_commands);
    local_artyom.fatality();
    setTimeout(function(){
        local_artyom.initialize({
            lang: "en-GB",
            continuous: true,
            listen: true,
            debug: true,
            speed: 1,
            soundex: true
        })
    }, 250);
    return local_artyom
}

function saySomething(local_artyom, something){
    local_artyom.shutUp();
    local_artyom.dontObey();
    local_artyom.say();
    local_artyom.say(something,{
        onEnd:function(){
            local_artyom.obey();
        }
    });
}

if (window.hasOwnProperty('webkitSpeechRecognition')) {

    var voice_commands = [];
    window.artyom = null;
    if(window.location.href.indexOf("search") === -1){
        
        var intro_said = false; 
        $(document).click(function(){
            if(!intro_said && getCookie('voice_commands') == 'true'){
                saySomething(artyom, "Hello to Xcessible for people with disabilities. Say next to navigate. Or search to go the search page.");
                intro_said = true;
            }
        });

        voice_commands = [ // INDEX
            {
                indexes: ["Next", "Follow", "Previous", "Back"],
                action: function(i){ 
                    if(i > 1){
                        $("#back-button").click();
                    }else{
                        $("#back-to-top").click();
                    }
                    var text = $("section:nth-child(" + (current_screen + 1) + ") div.section-title").text().split("\n").map(s => s.trim()).filter(n => n);
                    setTimeout(function(){
                        var output = "";
                        for(var i in text){
                            output += text[i].replace(/XCESSIBLE/g, "Xcessible").replace(/PWDS/g, "PwDs") + " ";
                        }
                        saySomething(artyom, output.trim());
                        if(window.current_screen == window.screen_lists.length - 1){
                            saySomething(artyom, "You reached the end of the page. Say back to go back or follow to start again.");
                        }
                    }, 750);
                }
            },
            {
                indexes: ["Search"],
                action: function(i){
                    saySomething(artyom, "Going to the search page now.");
                    window.location.href = "search";
                }
            }
        ];

    }else{
        voice_commands = [ // SEARCH
            {
                smart: true,
                indexes: ["Search for *"],
                action: function(i, wildcard){
                    $("#search-input").val(wildcard);
                    saySomething(artyom, "Searching for " + wildcard + ".");
                    $("form.log-in").submit();
                }
            }
        ];
    }
    $("#sound-button").click(function(){
        $("#sound-button").toggleClass("icofont-mic-mute");
        $("#sound-button").toggleClass("icofont-mic");
        if($("#sound-button").hasClass("icofont-mic")){
            window.artyom = initArtyom(voice_commands);
            setCookie('voice_commands', 'true', 365);
        }else{
            window.artyom.shutUp();
            window.artyom.fatality();
            setCookie('voice_commands', 'false', 365);
        }
    });

    if (getCookie('voice_commands') == 'true'){
        $("#sound-button").click();
    }

}else{
    $("#sound-button").hide();
}
