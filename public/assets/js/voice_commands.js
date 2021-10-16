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

    var current_states = getCookie('voice_commands');
    if (current_states) {
        if (current_states == 'true'){
            $("#sound-button").click();
        }
    }

    var voice_commands = [
        {
            smart: true,
            indexes: ["Search for *"],
            action: function(i, wildcard){
                artyom.say("I don't know who is " + wildcard + " and i cannot say if is a good person");
            }
        },
        {
            indexes:["What time is it",],
            action:function(i){ 
                artyom.say("Never is too late to do something my friend !");
            }
        }
    ];
    
    artyom.addCommands(voice_commands);
    artyom.fatality();
    setTimeout(function(){
            artyom.initialize({
            lang: "en-GB",
            continuous: true,
            listen: true,
            debug: true,
            speed: 1
        }).then(function(){
            console.log("Ready to work !");
        });
    },250);

}else{
    $("#sound-button").hide();
}
