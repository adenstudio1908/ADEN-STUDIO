
(() => {
  const hero = window.ADEN_HERO || [];
  const products = window.ADEN_PRODUCTS || [];
  const fallback = products[0] || "assets/images/editorial/editorial-001.webp";

  // Hero slider
  const slides = document.getElementById("heroSlides");
  const heroCount = document.querySelector(".hero-count");
  const heroFiles = hero.length ? hero : [fallback];
 heroFiles.forEach((src,i) => {
  const s = document.createElement("div");
  s.className = "hero-slide" + (i===0 ? " active" : "");

  const img = document.createElement("img");
  img.src = src;
  img.alt = "ADEN Menswear";
  img.loading = i === 0 ? "eager" : "lazy";

  s.appendChild(img);
  slides.appendChild(s);
});
 
  let hi=0;
  if(heroFiles.length>1){
    setInterval(()=>{
      const els=[...document.querySelectorAll(".hero-slide")];
      els[hi].classList.remove("active");
      hi=(hi+1)%els.length;
      els[hi].classList.add("active");
      const nums=heroCount?.querySelectorAll("span");
      const b=heroCount?.querySelector("b");
      if(b) b.textContent=String(hi+1).padStart(2,"0");
      if(nums) nums.forEach((n,j)=>n.style.opacity=j===hi ? .65 : .65);
    },5000);
  }

  // Product grid
  const names=[
    "STRUCTURE WOOL JACKET","TAILORED WIDE LEG TROUSERS","TEXTURED KNIT POLO","SIGNATURE OVERSIZED SHIRT",
    "ARCHIVE ZIP JACKET","RELAXED WOOL TROUSER","COTTON MODERN SHIRT","ESSENTIAL KNIT TOP"
  ];
  const prices=["$129.00","$89.00","$79.00","$75.00","$139.00","$95.00","$82.00","$69.00"];
  const grid=document.getElementById("productGrid");
  const shown=(products.length?products:heroFiles).slice(0,8);
  const productItems=[];
  shown.forEach((src,i)=>{
    const article=document.createElement("article");
    article.className="product-card";
    article.innerHTML=`<div class="product-image"><span class="new-tag">NEW</span><img src="${src}" alt="${names[i]||"ADEN look"}" loading="${i<4?"eager":"lazy"}"><span class="product-plus">+</span></div><div class="product-meta"><div class="product-name">${names[i]||"ADEN LOOK"}</div><div class="product-price">${prices[i]||"$89.00"}</div></div>`;
    article.addEventListener("click",()=>openLightbox(shown,i,names[i]||"ADEN LOOK"));
    grid.appendChild(article);
  });

  // Journal
  const journal=document.getElementById("journalGrid");
  const all=[...shown,...heroFiles];
  const journalItems=[...new Set(all)].slice(0,10);
  journalItems.forEach((src,i)=>{
    const im=document.createElement("img");
    im.src=src; im.alt=`ADEN Journal ${i+1}`; im.loading="lazy";
    im.onclick=()=>openLightbox(journalItems,i,"ADEN JOURNAL");
    journal.appendChild(im);
  });

  // Editorial image
  const ep=document.getElementById("editorialPhoto");
  if(heroFiles[1]||heroFiles[0]) ep.style.backgroundImage=`url("${heroFiles[1]||heroFiles[0]}")`;

  // Lightbox
  const lb=document.getElementById("lightbox"), lbImg=document.getElementById("lbImage"), cap=document.getElementById("lbCaption");
  let lbItems=[], lbIndex=0;
  function openLightbox(items,index,title){lbItems=items;lbIndex=index;cap.textContent=`${title}  /  ${index+1} OF ${items.length}`;lbImg.src=items[index];lb.classList.add("open");lb.setAttribute("aria-hidden","false")}
  function update(){lbImg.src=lbItems[lbIndex];cap.textContent=`ADEN  /  ${lbIndex+1} OF ${lbItems.length}`}
  function close(){lb.classList.remove("open");lb.setAttribute("aria-hidden","true")}
  document.querySelector(".lb-close").onclick=close;
  document.querySelector(".lb-prev").onclick=()=>{lbIndex=(lbIndex-1+lbItems.length)%lbItems.length;update()};
  document.querySelector(".lb-next").onclick=()=>{lbIndex=(lbIndex+1)%lbItems.length;update()};
  lb.addEventListener("click",e=>{if(e.target===lb)close()});
  document.addEventListener("keydown",e=>{if(!lb.classList.contains("open"))return;if(e.key==="Escape")close();if(e.key==="ArrowLeft")document.querySelector(".lb-prev").click();if(e.key==="ArrowRight")document.querySelector(".lb-next").click()});

  // Search
  const sp=document.getElementById("searchPanel");
  document.getElementById("searchBtn").onclick=()=>{sp.classList.add("open");setTimeout(()=>document.getElementById("searchInput").focus(),50)};
  document.getElementById("searchClose").onclick=()=>sp.classList.remove("open");

  // Mobile menu
  const mm=document.getElementById("mobileMenu");
  document.getElementById("menuToggle").onclick=()=>mm.classList.add("open");
  document.getElementById("mobileClose").onclick=()=>mm.classList.remove("open");
  mm.querySelectorAll("a").forEach(a=>a.onclick=()=>mm.classList.remove("open"));

  // Newsletter
  document.getElementById("subscribeForm").addEventListener("submit",e=>{
    e.preventDefault();
    const btn=e.currentTarget.querySelector("button");
    btn.innerHTML="THANK YOU ✓";
  });
})();
