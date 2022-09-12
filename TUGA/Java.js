/* second Section (Articles Certifications) */

const elms = document.querySelectorAll(".our_solution_category");
let delay = 500;
for (var i = 0; i < elms.length; i++) {
elms[i].setAttribute('data-aos', 'zoom-in-down');
elms[i].setAttribute('data-aos-delay', delay);
elms[i].setAttribute('data-aos-offset', -500);
delay += 200; 


}

AOS.init({
easing: 'ease-in-out-sine',
disable: 'mobile',
});


