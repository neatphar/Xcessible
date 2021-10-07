!(function($) {
  "use strict";


  
  window.current_screen = 0;
  window.screen_lists = [];
  $('main section').each(function () {window.screen_lists.push("#" + this.id);});

  window.screen_text_list = [
    "../../assets/img/quotes/quote5.png",
    "../../assets/img/quotes/quote6.png"
  ];
  for(var i in window.screen_text_list){
    $('#header nav').append('<img src="' + window.screen_text_list[i] + '">')
  }

  $("#back-to-top").fadeIn(1000);

  $('#header img').animate({'opacity': 0}, 750, function () {
    $('#header img:nth-child(' + (window.current_screen + 1) + ')').animate({'opacity': 1}, 750);
  });
  
  $('#back-to-top').click(function() {

    $('html, body').animate({
      scrollTop: ++window.current_screen != window.screen_lists.length ? $(window.screen_lists[window.current_screen]).offset().top : "0px"
    }, 1500, 'easeInOutExpo');

    $('#back-to-top a').animate({'opacity': 0}, 750, function () {
    
      if(window.current_screen == window.screen_lists.length){
        $(this).text("REGISTER INSTEAD");
        window.current_screen = 0;
      }else{
        $(this).text(window.current_screen == window.screen_lists.length - 1 ? "LOGIN INSTEAD" : "REGISTER INSTEAD");
      }

    }).animate({'opacity': 1}, 750);

    $('#header img').animate({'opacity': 0}, 750, function () {
      $('#header img:nth-child(' + (window.current_screen + 1) + ')').animate({'opacity': 1}, 750);
    });

    return false;
  });


  

  AOS.init({
    duration: 1000,
    easing: "ease-in-out-back"
  });
  

})(jQuery);