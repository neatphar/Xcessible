if (window.hasOwnProperty('webkitSpeechRecognition')) {

    window.artyom = new Artyom();

    $("#sound-button").click(function(){
        $("#sound-button").toggleClass("icofont-mic-mute");
        $("#sound-button").toggleClass("icofont-mic");
        if($("#sound-button").hasClass("icofont-mic")){
            artyom.obey();
        }else{
            artyom.dontObey();
        }
    });

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
