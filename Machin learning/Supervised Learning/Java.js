

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

/* secion3-animate  */

function reveal_4() {
  var reveal_4 = document.querySelectorAll(".Four");

  for (var i = 0; i < reveal_4.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveal_4[i].getBoundingClientRect().top;
    var elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveal_4[i].classList.add("active");
    } else {
      reveal_4[i].classList.remove("active");
    }
  }
}

window.addEventListener("scroll", reveal_4);




/* text-animate  */

var typed = new Typed(".animated_text",{
  strings: [ ,"an Industrial Engineer.", "a Data Scientist.",],
  typeSpeed: 50,
  backSpead: 75,
  loop:true
  });



  /* Third Section (Professional Certifications) */
const elms = document.querySelectorAll("#Third .our_solution_category");
let delay = 100;
for (var i = 0; i < elms.length; i++) {
    console.log(elms[i]);
    elms[i].setAttribute('data-aos', 'zoom-in-down');
    elms[i].setAttribute('data-aos-delay', delay);
    delay += 200; 
}

AOS.init({
    easing: 'ease-in-out-sine',
    disable: 'mobile',
});




src="vanilla-tilt.min.js"
VanillaTilt.init(document.querySelectorAll(".card"),{
  glare: true,
  reverse: true,
  "max-glare": 0.15
});




  /* Tab */
function openCity(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}
