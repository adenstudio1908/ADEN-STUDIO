const products=[
['ARCHITECT WOOL JACKET','$189'],
['OVERSIZED SIGNATURE SHIRT','$95'],
['TAILORED WIDE TROUSER','$119'],
['TEXTURED KNIT POLO','$89'],
['ESSENTIAL BOX TEE','$55'],
['STRUCTURE ZIP JACKET','$159'],
['RELAXED DAILY TROUSER','$105'],
['ADEN LEATHER BAG','$149']
];
let count=0;
const grid=document.querySelector('#products');
grid.innerHTML=products.map((p,i)=>`<article class="card"><div class="card-img"><img src="assets/aden-logo-reference.png" alt="${p[0]}"></div><div class="info"><div class="name">${p[0]}</div><div class="price">${p[1]}</div><button class="add" onclick="add(${i})">+</button></div></article>`).join('');
function add(){count++;document.querySelector('#bagCount').textContent=count;alert('Added to bag — connect checkout/payment when ready.')}
function subscribe(e){e.preventDefault();alert('Thank you for joining ADEN STUDIO.')}
