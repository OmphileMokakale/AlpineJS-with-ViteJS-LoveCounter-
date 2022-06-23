import './style.css'
import LoveCounter from './love-counter';
import Quotes from './quotes';
import './quote.css'


//import Alpine
import Alpine from 'alpinejs';
window.Alpine = Alpine
Alpine.data('loveCounter', LoveCounter);
Alpine.data('quoteApp', Quotes)

// Alpine.data('quoteApp', function(){
// 	return {
// 		init(){
// 			this.quote = fun.getRandomQuote()
// 		},
// 		quote : {}
// 	}
// })
Alpine.start()

document.querySelector('#app').innerHTML = "I 💚 Alpine JS!"
