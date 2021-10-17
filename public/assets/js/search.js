!(function($) {
  "use strict";


  
  window.current_screen = 0;
  window.screen_lists = [];
  $('main section').each(function () {window.screen_lists.push("#" + this.id);});

  window.screen_text_list = [
    "assets/img/quotes/quote7.png",
    "assets/img/quotes/quote8.png"
  ];
  for(var i in window.screen_text_list){
    $('#header nav').append('<img src="' + window.screen_text_list[i] + '">')
  }

  
  $('#header img').animate({'opacity': 0}, 750, function () {
    $('#header img:nth-child(' + (window.current_screen + 1) + ')').animate({'opacity': 1}, 750);
  });

  $('#back-to-top').click(function() {

    $('html, body').animate({
      scrollTop: ++window.current_screen != window.screen_lists.length ? $(window.screen_lists[window.current_screen]).offset().top : "0px"
    }, 1500, 'easeInOutExpo');

    
    

    $('#back-to-top a').animate({'opacity': 0}, 750, function () {
    
      if(window.current_screen == window.screen_lists.length){
        $("#back-to-top").fadeOut(750);
        window.current_screen = 0;
      }else{
        $("#back-to-top").fadeIn(750);
      }

    }).animate({'opacity': 1}, 750);

    $('#header img').animate({'opacity': 0}, 750, function () {
      $('#header img:nth-child(' + (window.current_screen + 1) + ')').animate({'opacity': 1}, 750);
    });

    return false;
  });


  $('form').submit(function() {
    if($("#search-input").val().length < 5 || $(".location-select option:selected").val() == "-1"){
      return false;
    }
    $.LoadingOverlay("show");
    $.ajax({
      type: "POST",
      url: "search",
      data: {
        keyword: $("#search-input").val(),
        location: $(".location-select option:selected").val(),
        disabilities: $(".disability-select option:selected").map(function(){return this.value}).toArray()
      },
      success: function(data){
        $.LoadingOverlay("hide");
        $(".search-result").html(data);
        $(".widget-26-job-category").each(function(){
          const choices = ["bg-soft-warning", "bg-soft-success", "bg-soft-danger", "bg-soft-info"];
          const randomElement = choices[Math.floor(Math.random() * choices.length)];
          $(this).addClass(randomElement);
          $("i", this).addClass(randomElement.replace("-soft", ""));
        });
        $('#back-to-top').click();
      }
    });
    return false;
  });
  

  AOS.init({
    duration: 1000,
    easing: "ease-in-out-back"
  });
  

  $(".disability-select").multiselect({
    enableClickableOptGroups: true,
    enableFiltering: true,
    nonSelectedText: "Select disablities"
  });

  $(".location-select").multiselect({
    enableFiltering: true,
    nonSelectedText: "Select locations"
  });
})(jQuery);