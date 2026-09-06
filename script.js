
let data=null, modalItems=[], modalIndex=0;
const $=s=>document.querySelector(s);
fetch("products.json").then(r=>r.json()).then(d=>{
 data=d;
 const hero=d.looks[0]?.images?.[0]||d.editorial[0];
 if(hero) $("#heroImage").innerHTML=`<img src="${hero}" alt="ADEN STUDIO editorial">`;
 $("#metaCount").textContent=`${d.looks.length} looks · ${d.editorial.length} archive images`;
 render("all");
 d.editorial.forEach((src,i)=>{
   const im=document.createElement("img"); im.src=src; im.loading="lazy"; im.alt=`ADEN Studio visual ${i+1}`;
   im.onclick=()=>openModal(d.editorial,i,"Visual Journal"); $("#journalGrid").appendChild(im);
 });
}).catch(()=>$("#collectionGrid").innerHTML="<p>Unable to load collection.</p>");

function render(mode){
 const grid=$("#collectionGrid"); grid.innerHTML="";
 if(mode==="journal"){const src=data.editorial[0]; if(src)addCard(src,"Visual Journal",`${data.editorial.length} images`,()=>openModal(data.editorial,0,"Visual Journal")); return;}
 data.looks.forEach((look)=>addCard(look.images[0],look.name,`${look.images.length} images`,()=>openModal(look.images,0,look.name)));
}
function addCard(src,title,count,fn){
 const a=document.createElement("article");a.className="look";
 a.innerHTML=`<div class="look-img"><img src="${src}" loading="lazy" alt="${title}"></div><div class="look-info"><span>${title}</span><span>${count}</span></div>`;
 a.onclick=fn;$("#collectionGrid").appendChild(a);
}
document.querySelectorAll(".filters button").forEach(b=>b.onclick=()=>{
 document.querySelectorAll(".filters button").forEach(x=>x.classList.remove("active"));b.classList.add("active");render(b.dataset.filter);
});
function openModal(items,i,title){modalItems=items;modalIndex=i;$("#viewerTitle").textContent=title;update();$("#modal").classList.add("open");$("#modal").setAttribute("aria-hidden","false")}
function update(){$("#viewerImg").src=modalItems[modalIndex];$("#viewerIndex").textContent=`${modalIndex+1} / ${modalItems.length}`}
function close(){ $("#modal").classList.remove("open");$("#viewerImg").src=""; }
$(".close").onclick=close;
$(".prev").onclick=()=>{modalIndex=(modalIndex-1+modalItems.length)%modalItems.length;update()};
$(".next").onclick=()=>{modalIndex=(modalIndex+1)%modalItems.length;update()};
$("#modal").onclick=e=>{if(e.target.id==="modal")close()};
document.onkeydown=e=>{if(!$("#modal").classList.contains("open"))return;if(e.key==="Escape")close();if(e.key==="ArrowLeft")$(".prev").click();if(e.key==="ArrowRight")$(".next").click()};
