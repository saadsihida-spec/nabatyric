/* NabatyRIC — menu mobile (v2) */
(function(){
  var nav=document.querySelector('nav');
  var btn=document.querySelector('.nav-toggle');
  if(!nav||!btn) return;
  function close(){nav.classList.remove('open');btn.setAttribute('aria-expanded','false');}
  btn.addEventListener('click',function(e){
    e.stopPropagation();
    var open=nav.classList.toggle('open');
    btn.setAttribute('aria-expanded',open?'true':'false');
  });
  nav.querySelectorAll('.nav-links a').forEach(function(a){a.addEventListener('click',close);});
  document.addEventListener('click',function(e){if(!nav.contains(e.target))close();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
  window.addEventListener('resize',function(){if(window.innerWidth>880)close();});
})();
