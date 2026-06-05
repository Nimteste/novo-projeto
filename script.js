// Animações e interações para o portfólio
// - Smooth scroll para links internos
// - Links do cabeçalho com data-external abrem em nova aba
// - Header encolhe ao rolar
// - Reveal de seções com IntersectionObserver
// - Efeito tilt em cartões de projetos/produtos

(function(){
  // Injeta estilos dinâmicos necessários
  const style = document.createElement('style');
  style.textContent = `
    .reveal{opacity:0;transform:translateY(20px);transition:opacity .7s ease,transform .7s ease}
    .revealed{opacity:1;transform:none}
    header.scrolled{backdrop-filter:blur(6px);background:rgba(255,255,255,0.02);padding:0.6rem 1rem;border-radius:10px}
    .tilt{transform-style:preserve-3d;transition:transform .12s ease}
  `;
  document.head.appendChild(style);

  // Smooth scrolling for internal anchors and external handler
  document.addEventListener('click', function(e){
    const a = e.target.closest('a');
    if(!a) return;
    const href = a.getAttribute('href')||'';
    const external = a.dataset.external;
    if(external){
      e.preventDefault();
      window.open(external, '_blank');
      return;
    }
    if(href.startsWith('#')){
      const target = document.querySelector(href);
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
      }
    }
  });

  // Header shrink on scroll
  const header = document.querySelector('header');
  function onScroll(){
    if(window.scrollY>60) header.classList.add('scrolled'); else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Reveal sections
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) entry.target.classList.add('revealed');
    });
  },{threshold:0.15});

  document.querySelectorAll('section').forEach(sec=>{
    sec.classList.add('reveal');
    observer.observe(sec);
  });

  // Tilt effect for project/product cards
  function bindTilt(selector){
    document.querySelectorAll(selector).forEach(card=>{
      card.classList.add('tilt');
      card.addEventListener('mousemove', function(e){
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width/2; // center
        const y = e.clientY - rect.top - rect.height/2;
        const rx = (y/rect.height)*8; // tilt intensity
        const ry = -(x/rect.width)*8;
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
      });
      card.addEventListener('mouseleave', function(){
        card.style.transform = '';
      });
    });
  }
  bindTilt('#projetos li');
  bindTilt('#produtos li');

  // Small entrance animation for header links
  document.querySelectorAll('nav a').forEach((a,i)=>{
    a.style.transition = 'transform .28s ease, opacity .28s ease';
    a.style.opacity = '0';
    setTimeout(()=>{ a.style.opacity='1'; a.style.transform='translateY(0)'; }, 180 + i*80);
  });

})();
