const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

// cart 

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const modalClose = document.querySelector('.modal-close')

const openModal = function(){
	modalCart.classList.add('show')
}
const closeModal = function(e){

	if( e.target.classList.contains('modal-close') ||
		(e.target.id === 'modal-cart' && 
		e.target.classList.contains('overlay')) ){
			modalCart.classList.remove('show')
	}
}

buttonCart.addEventListener('click', openModal);
modalCart.addEventListener('click', closeModal);

// scroll smooth 

const scrollLinks = document.querySelectorAll('a.scroll-link');

(function(){for(let i = 0; i < scrollLinks.length; i++){
	scrollLinks[i].addEventListener('click', function(e){
		e.preventDefault();
		const id = scrollLinks[i].getAttribute('href');
		document.querySelector(id).scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		})
	})
}})()