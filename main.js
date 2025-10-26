
const products = [
  {id:1, category:'Lips', name:'Lip Kit - Cherry Red', price:24.00, img:'product1.jpg', desc:'Iconic Lip Kit with long-lasting color.'},
  {id:2, category:'Lips', name:'Cherry Lip Gloss', price:18.00, img:'product6.jpg', desc:'High-shine cherry gloss.'},
  {id:3, category:'Lips', name:'Liquid Lipstick - Velvet', price:22.00, img:'product4.jpg', desc:'Velvety matte liquid lipstick.'},
  {id:4, category:'Eyes', name:'Black Cherry Eyeliner', price:19.00, img:'product3.jpg', desc:'Deep rich eyeliner for sultry looks.'},
  {id:5, category:'Eyes', name:'Cherry Eyeshadow Palette', price:45.00, img:'product7.jpg', desc:'12-color palette of cherry tones.'},
  {id:6, category:'Eyes', name:'Precision Pencil Liner', price:14.00, img:'product9.jpg', desc:'Smooth pencil liner for precise lines.'},
  {id:7, category:'Face', name:'Cherry Blush', price:28.00, img:'product2.jpg', desc:'Cream blush for a natural glow.'},
  {id:8, category:'Face', name:'Radiant Highlighter', price:30.00, img:'product5.jpg', desc:'Luminous highlighter for sparkle.'},
  {id:9, category:'Face', name:'Soft Bronzer', price:26.00, img:'product8.jpg', desc:'Warm bronzer for sun-kissed skin.'}
];

let cart = JSON.parse(localStorage.getItem('kylie_cart') || '[]');

function saveCart(){ localStorage.setItem('kylie_cart', JSON.stringify(cart)); updateCartCount(); }

function formatPrice(p){ return p.toFixed(2); }

function addToCartById(id){
  const prod = products.find(p=>p.id===id);
  if(!prod) return;
  const found = cart.find(i=>i.id===id);
  if(found) found.qty += 1;
  else cart.push({id:prod.id, name:prod.name, price:prod.price, qty:1});
  saveCart();
  showToast(prod.name + ' added to cart');
  renderCartIfOnPage();
}

function removeFromCart(id){
  cart = cart.filter(i=>i.id!==id);
  saveCart();
  renderCartIfOnPage();
}

function updateQty(id, newQty){
  const item = cart.find(i=>i.id===id);
  if(!item) return;
  item.qty = newQty;
  if(item.qty <= 0) removeFromCart(id);
  else saveCart();
  renderCartIfOnPage();
}

function updateCartCount(){
  const count = cart.reduce((s,i)=>s+i.qty,0);
  const els = document.querySelectorAll('#cart-count');
  els.forEach(el=> el.textContent = count);
}

function createProductCard(prod){
  const card = document.createElement('article');
  card.className = 'product';
  card.innerHTML = `
    <div>
      <div class="img-placeholder">
        <img src="${prod.img}" alt="${prod.name}">
      </div>
      <h4>${prod.name}</h4>
      <div class="price">$${formatPrice(prod.price)}</div>
    </div>
    <div>
      <div class="controls">
        <button class="btn small view-btn" data-id="${prod.id}">View</button>
        <button class="btn small add-btn" data-id="${prod.id}">Add to Cart</button>
      </div>
      <div class="details" id="details-${prod.id}">${prod.desc}</div>
    </div>
  `;
  return card;
}

function renderProductsOn(selectorMap){
  // If selectorMap provided, render into categories on Home; otherwise render all into shop-products
  if(selectorMap){
    products.forEach(prod=>{
      const card = createProductCard(prod);
      if(prod.category === 'Lips') document.querySelector(selectorMap.Lips).appendChild(card);
      if(prod.category === 'Eyes') document.querySelector(selectorMap.Eyes).appendChild(card);
      if(prod.category === 'Face') document.querySelector(selectorMap.Face).appendChild(card);
    });
  } else {
    const container = document.getElementById('shop-products');
    if(!container) return;
    products.forEach(prod=>{
      container.appendChild(createProductCard(prod));
    });
  }

  document.querySelectorAll('.view-btn').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = e.currentTarget.dataset.id;
      const details = document.getElementById('details-'+id);
      if(details.style.display === 'block') details.style.display = 'none';
      else details.style.display = 'block';
    });
  });

  document.querySelectorAll('.add-btn').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = Number(e.currentTarget.dataset.id);
      addToCartById(id);
    });
  });
}

function renderCartIfOnPage(){
  const container = document.getElementById && document.getElementById('cart-items');
  if(!container) return;
  container.innerHTML = '';
  let total = 0;
  cart.forEach(item=>{
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div>${item.name} x <input type="number" min="1" value="${item.qty}" data-id="${item.id}" class="qty-input" style="width:55px"></div>
      <div>$${formatPrice(item.price * item.qty)} <button class="btn small remove-btn" data-id="${item.id}">Remove</button></div>
    `;
    container.appendChild(div);
  });
  const totalEl = document.getElementById('cart-total');
  if(totalEl) totalEl.textContent = formatPrice(total);
  updateCartCount();

  document.querySelectorAll('.remove-btn').forEach(btn=>{
    btn.addEventListener('click', e=> removeFromCart(Number(e.currentTarget.dataset.id)) );
  });
  document.querySelectorAll('.qty-input').forEach(input=>{
    input.addEventListener('change', e=>{
      const id = Number(e.currentTarget.dataset.id);
      const q = Number(e.currentTarget.value) || 1;
      updateQty(id, q);
    });
  });
}

function showToast(msg){
  let t = document.getElementById('site-toast');
  if(!t){
    t = document.createElement('div');
    t.id = 'site-toast';
    t.style.position = 'fixed';
    t.style.right = '20px';
    t.style.bottom = '20px';
    t.style.background = 'rgba(0,0,0,0.8)';
    t.style.color = '#fff';
    t.style.padding = '10px 14px';
    t.style.borderRadius = '8px';
    t.style.zIndex = 9999;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(()=> t.style.opacity = '0', 1800);
}

function handleContactForm(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const name = form.querySelector('[name=name]').value.trim();
    const email = form.querySelector('[name=email]').value.trim();
    const msg = form.querySelector('[name=message]').value.trim();
    if(!name || !email || !msg){ alert('Please fill all fields.'); return; }
    form.reset();
    showToast('Message sent successfully!');
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  updateCartCount();
  if(document.getElementById('lips-list')){
    renderProductsOn({Lips:'#lips-list', Eyes:'#eyes-list', Face:'#face-list'});
  }
  if(document.getElementById('shop-products')){
    renderProductsOn(null);
  }
  renderCartIfOnPage();
  handleContactForm();
  const checkoutBtn = document.getElementById('checkout-btn');
  if(checkoutBtn){
    checkoutBtn.addEventListener('click', ()=>{
      if(cart.length===0){ alert('Your cart is empty.'); return; }
      let summary = 'Order summary:\n';
      cart.forEach(i=> summary += `${i.name} x${i.qty} — $${formatPrice(i.price*i.qty)}\n`);
      summary += `Total: $${formatPrice(cart.reduce((s,i)=>s+i.price*i.qty,0))}`;
      alert(summary + '\n\n(Checkout is a demo in this package.)');
    });
  }
});
