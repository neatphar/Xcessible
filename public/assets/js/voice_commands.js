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

if (window.hasOwnProperty('webkitSpeechRecognition')) {

    window.artyom = new Artyom();
    function saySomething(something){
        artyom.dontObey();
        artyom.say(something);
        artyom.obey();
    }

    $("#sound-button").click(function(){
        $("#sound-button").toggleClass("icofont-mic-mute");
        $("#sound-button").toggleClass("icofont-mic");
        if($("#sound-button").hasClass("icofont-mic")){
            artyom.obey();
            setCookie('voice_commands', 'true', 365);
        }else{
            artyom.dontObey();
            setCookie('voice_commands', 'false', 365);
        }
    });

    var currentStates = getCookie('voice_commands');
    if (currentStates) {
        if (currentStates == 'true'){
            $("#sound-button").click();
        }
    }

    var voice_commands = [];

    if(window.location.href.indexOf("search") === -1){
        
        var intro_said = false;
        $(document).click(function(){
            if(!intro_said){
                saySomething("Hello to Xcessible for people with disabilities.");
                saySomething("Say next to navigate.");
                intro_said = true;
            }
        });

        voice_commands = [ // INDEX
            {
                indexes:["Next", "Follow", "Previous", "Back"],
                action:function(i){ 
                    if(i > 1){
                        $("#back-button").click();
                    }else{
                        $("#back-to-top").click();
                    }
                    var text = $("section:nth-child(" + (current_screen + 1) + ") div.section-title").text().split("\n").map(s => s.trim()).filter(n => n);
                    setTimeout(function(){
                        for(var i in text){
                            saySomething(text[i].replace(/XCESSIBLE/g, "Xcessible").replace(/PWDS/g, "PwDs"));
                        }
                    }, 750);
                }
            }
        ];

    }else{
        voice_commands = [ // SEARCH
            {
                smart: true,
                indexes: ["Search for *"],
                action: function(i, wildcard){
                    saySomething("I don't know who is " + wildcard + " and i cannot say if is a good person");
                }
            }
        ];
    }

    
    artyom.addCommands(voice_commands);
    artyom.fatality();
    setTimeout(function(){
        artyom.initialize({
            lang: "en-GB",
            continuous: true,
            listen: true,
            debug: true,
            speed: 1
        })
    },250);

}else{
    $("#sound-button").hide();
}
