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
	const modalClose = document.querySelector('.modal-close');
	const scrollLinks = document.querySelectorAll('.scroll-link');
	const more = document.querySelector('.more');
	const navigationLinks = document.querySelectorAll('.navigation-link');
	const longGoodsList = document.querySelector('.long-goods-list');
	const btnGetGoods = document.querySelectorAll('[data-field-value]');	



	const openModal = function(){
		modalCart.classList.add('show')
		cart.renderCart()
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



(function(){for(const scrollLink of scrollLinks){
	scrollLink.addEventListener('click', event => {
		event.preventDefault();
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



const getGoods = async () => {
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
		.then(data => data.filter(good => good[field] === value))
		.then(renderCards);
}


btnGetGoods.forEach(function(btn){
	btn.addEventListener('click', e => {
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

// cart table goods 

const cartTableGoods = document.querySelector('.cart-table__goods');
const cartTableTotal = document.querySelector('.card-table__total');

const cart = {
	cartGoods: [],

	renderCart(){
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({id,name,price,count}) => {
			const trGood = document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;
			trGood.innerHTML = `
				<td>${name}</td>
				<td>${price}$</td>
				<td><button class="cart-btn-minus">-</button></td>
				<td>${count}</td>
				<td><button class="cart-btn-plus">+</button></td>
				<td>${price * count}$</td>
				<td><button class="cart-btn-delete">x</button></td>
			`;
			cartTableGoods.append(trGood)
		});

		const totalPrice = this.cartGoods.reduce((sum,item)=>{
			return sum + ( item.price * item.count )
		} , 0);

		cartTableTotal.textContent = totalPrice + '$'

	},

	deleteGood(id){
		this.cartGoods = this.cartGoods.filter(item=> id !== item.id);
		this.renderCart();
	},

	minusGood(id){
		for (const item of this.cartGoods) {
			if(item.id === id){
				if(item.count - 1 === 0){
					this.deleteGood(id);
				} else {
					item.count--;
					
				}
				break;
			}
		}
		this.renderCart()
	},

	plusGood(id){
		for (const item of this.cartGoods) {
			if(item.id === id){
				item.count++;
				break;
			}
		}
		this.renderCart()
	},

	addCartGoods(id){
		const goodItem = this.cartGoods.find(item=>item.id === id);
		if(goodItem){
			this.plusGood(id);
		} else {
			getGoods()
				.then(data=> data.find(item => item.id === id))
				.then(({id, name ,price}) => {
					this.cartGoods.push({
						id,
						name,
						price,
						count: 1,
					})
				})
		}
	},
}
cart.addCartGoods('001')
cart.addCartGoods('021')

document.body.addEventListener('click', e =>{
	const addToCart = e.target.closest('.add-to-cart');

	if(addToCart){
		cart.addCartGoods(addToCart.dataset.id)
	}
})

cartTableGoods.addEventListener('click', e => {
	
	if(e.target.tagName === 'BUTTON'){
		if(e.target.classList.contains('cart-btn-delete')){
			cart.deleteGood(e.target.closest('.cart-item').dataset.id)
		}
		if(e.target.classList.contains('cart-btn-minus')){
			cart.minusGood(e.target.closest('.cart-item').dataset.id)
		}
		if(e.target.classList.contains('cart-btn-plus')){
			cart.plusGood(e.target.closest('.cart-item').dataset.id)
		}
	}

})
cart.renderCart()
