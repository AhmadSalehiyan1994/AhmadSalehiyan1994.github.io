type="text/javascript">
    $(document).ready(function(){
    $(window).on("scroll",function(){
    var wn = $(window).scrollTop();
    if(wn > 20){
       
        $(".navbar").css("background","rgba(27, 27, 27, 0.9)");
        $(".navbar").css("tshadow","10px");
        $(".navbar").css("transition-duration","1s");
    }
    else{
        
        $(".navbar").css("background","rgba(0,0,0,0)");     
    }
  });
});

/* popover  */
$(document).ready(function(){
  $('[data-toggle="popover"]').popover({
         //trigger: 'focus',
     trigger: 'hover',
         html: true,
         content: function () {
       return '<img class="img-fluid" src="'+$(this).data('img') + '" />';
         },
         title: 'Toolbox'
   }) 
});




/* secion2-animate  */
function reveal_2() {
  var reveal_2 = document.querySelectorAll(".Second");

  for (var i = 0; i < reveal_2.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveal_2[i].getBoundingClientRect().top;
    var elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveal_2[i].classList.add("active");
    } else {
      reveal_2[i].classList.remove("active");
    }
  }
}

window.addEventListener("scroll", reveal_2);

/* secion3-animate  */

function reveal_3() {
  var reveal_3 = document.querySelectorAll(".Third");

  for (var i = 0; i < reveal_3.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveal_3[i].getBoundingClientRect().top;
    var elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveal_3[i].classList.add("active");
    } else {
      reveal_3[i].classList.remove("active");
    }
  }
}
window.addEventListener("scroll", reveal_3);

/* Function to reveal elements within the section with class 'Four' as the user scrolls */
function revealSectionFour() {
    requestAnimationFrame(() => {
        var elements = document.querySelectorAll(".Four");
        var windowHeight = window.innerHeight;
        var elementVisible = -200; // Adjust for better timing on all screens

        for (var i = 0; i < elements.length; i++) {
            var elementTop = elements[i].getBoundingClientRect().top;

            if (elementTop < windowHeight - elementVisible) {
                elements[i].classList.add("active");
            } else {
                elements[i].classList.remove("active");
            }
        }
    });
}

window.addEventListener("scroll", revealSectionFour);





/* text-animate  */

var typed = new Typed(".animated_text",{
  strings: [ ,"an Industrial Engineer.", "a Data Scientist.",],
  typeSpeed: 50,
  backSpead: 75,
  loop:true
  });






/* Third Section (Professional Certifications) */

document.addEventListener("DOMContentLoaded", function() {
  const elms = document.querySelectorAll(".our_solution_category");
  let delay = 150;
  for (var i = 0; i < elms.length; i++) {
    elms[i].setAttribute('data-aos', 'zoom-in-down');
    elms[i].setAttribute('data-aos-offset', window.innerWidth > 768 ? '-900' : '-1200'); // Different offsets for mobile
    elms[i].setAttribute('data-aos-delay', delay);
    delay += 100; // Increment delay for staggered effect
  }

  AOS.init({
    easing: 'ease-in-out-sine',
    disable: function() {
      // Disable animations on smaller devices
      return window.innerWidth < 768;
    }
  });
});




