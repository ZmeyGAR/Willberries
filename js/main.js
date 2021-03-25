const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

// cart 

{

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

}
// scroll smooth 


const scrollLinks = document.querySelectorAll('.scroll-link');

(function(){for(const scrollLink of scrollLinks){
	scrollLink.addEventListener('click', function(e){
		e.preventDefault();
		const id = scrollLink.getAttribute('href');

		if(id){
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		} else{
			document.body.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		}

		
	})
}})()

// goods 

const more = document.querySelector('.more');
const navigationLinks = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');

const getGoods = async function(){
	const res = await fetch('db/db.json');
	if(!res.ok){
		throw 'Ошибочка вышла: ' + res.status;
	}
	return res.json();
}

const createCard = function({ label, img, name, description, id, price}){
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';

	card.innerHTML = `
	<div class="goods-card">
		${label ? `<span class="label">${label}</span>` : ``}
		<img src="./db/${img}" alt="image: ${name}" class="goods-image">
		<h3 class="goods-title">${name}</h3>
		<p class="goods-description">${description}</p>
		<button class="button goods-card-btn add-to-cart" data-id="${id}">
			<span class="button-price">$${price}</span>
		</button>
	</div>
	`;

	return card;
}

const renderCards = function(data){
	longGoodsList.textContent = '';
	const cards = data.map(createCard);
	longGoodsList.append(...cards);
	document.body.classList.add('show-goods');
}


const filterCards = function( field, value) {
	getGoods()
		.then(function(data){
			const filteredGoods = data.filter(function(good){
				return good[field] === value;
			})
			return filteredGoods;
		})
		.then(renderCards);
}

const btnGetGoods = document.querySelectorAll('[data-field-value]');

btnGetGoods.forEach(function(btn){
	btn.addEventListener('click', function(e){
		e.preventDefault();

		if(btn.dataset.fieldValue.trim()){
			filterCards(
				btn.dataset.fieldValue.split(':')[0], // field
				btn.dataset.fieldValue.split(':')[1]) // value
		} else {
			getGoods()
				.then(renderCards);
		}

	})
})
