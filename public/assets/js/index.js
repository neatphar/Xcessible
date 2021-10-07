!(function($) {
  "use strict";

  // Hero typed
  var typed_settings = {
    strings: ["The ultimate <b>job-hunting</b> platform.", "We support the <b>PwD</b> cause!^750, click <i>START</i>."],
    loop: false,
    typeSpeed: 75,
    backSpeed: 75,
    backDelay: 1250,
    onComplete: function(){
      $("#back-to-top").fadeIn(1000);
    }
  };

  var typedObj = new Typed('.typed', typed_settings);
  window.current_screen = -1;
  window.screen_lists = [];
  $('main section').each(function () {window.screen_lists.push("#" + this.id);});
  window.screen_lists.push("#myHero");
  window.screen_text_list = [
    "assets/img/quotes/quote1.png",
    "assets/img/quotes/quote2.png",
    "assets/img/quotes/quote3.png",
    "assets/img/quotes/quote4.png"
  ];
  for(var i in window.screen_text_list){
    $('#header nav').append('<img src="' + window.screen_text_list[i] + '">')
  }

  $('#back-to-top').click(function() {
    $('html, body').animate({
      scrollTop: ++window.current_screen != window.screen_lists.length ? $(window.screen_lists[window.current_screen]).offset().top : "0px"
    }, 1500, 'easeInOutExpo');

    $('#back-to-top a').animate({'opacity': 0}, 750, function () {
      if(window.current_screen == window.screen_lists.length){
        $(this).text("START");
        window.current_screen = -1;
        typedObj.reset()
      }else{
        $(this).text(window.current_screen == window.screen_lists.length - 1 ? "TOP" : "NEXT");
      }
    }).animate({'opacity': 1}, 750);
    if(window.current_screen == 0){
      $('#header').animate({'opacity': 1}, 750);
      $("#back-to-top").animate({
        marginLeft: '+=100px'
      }, 750);
    }else if(window.current_screen == window.screen_lists.length - 1){
      $('#header').animate({'opacity': 0}, 750);
      $("#back-to-top").animate({
        marginLeft: '-=100px'
      }, 750);
    }
    
    $('#header img').animate({'opacity': 0}, 750, function () {
      $('#header img:nth-child(' + (window.current_screen + 1) + ')').animate({'opacity': 1}, 750);
    });
    
    return false;
  });


  
  $('.skills-content').waypoint(function() {
    $('.progress .progress-bar').each(function() {
      $(this).css("width", $(this).attr("aria-valuenow") + '%');
    });
  }, {
    offset: '80%'
  });

  $(window).on('load', function() {
    var portfolioIsotope = $('.portfolio-container').isotope({
      itemSelector: '.portfolio-item',
      layoutMode: 'fitRows',
      filter: '.filter-page1'
    });

    $('#portfolio-flters li').on('click', function() {
      $("#portfolio-flters li").removeClass('filter-active');
      $(this).addClass('filter-active');

      portfolioIsotope.isotope({
        filter: $(this).data('filter')
      });
    });

  });

  AOS.init({
    duration: 1000,
    easing: "ease-in-out-back"
  });
  
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      900: {
        items: 3
      }
    }
  });


})(jQuery);