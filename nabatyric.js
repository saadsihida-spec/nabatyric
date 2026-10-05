/* Nabaty Care — scripts du site */
(function(){
  var root=document.documentElement;

  /* ---------- Langue (mémorisée d'une page à l'autre) ---------- */
  function setLang(l){
    root.classList.remove('l-fr','l-ar'); root.classList.add('l-'+l);
    root.lang=l; root.dir=(l==='ar')?'rtl':'ltr';
    document.querySelectorAll('.lang button').forEach(function(b){b.classList.toggle('on',b.dataset.lang===l);});
    document.querySelectorAll('option[data-fr]').forEach(function(o){o.textContent=o.getAttribute('data-'+l);});
    document.querySelectorAll('[data-ph-fr]').forEach(function(el){el.placeholder=el.getAttribute('data-ph-'+l)||el.placeholder;});
    try{localStorage.setItem('nabaty-lang',l);}catch(e){}
  }
  var cur='fr'; try{cur=localStorage.getItem('nabaty-lang')||'fr';}catch(e){}
  setLang(cur);
  document.querySelectorAll('.lang button').forEach(function(b){b.addEventListener('click',function(){setLang(b.dataset.lang);});});

  /* ---------- Menu mobile ---------- */
  var nav=document.querySelector('nav.top'), tog=document.querySelector('.nav-toggle');
  if(nav&&tog){
    var close=function(){nav.classList.remove('open');tog.setAttribute('aria-expanded','false');};
    tog.addEventListener('click',function(e){e.stopPropagation();var o=nav.classList.toggle('open');tog.setAttribute('aria-expanded',o?'true':'false');});
    nav.querySelectorAll('.nav-links a').forEach(function(a){a.addEventListener('click',close);});
    document.addEventListener('click',function(e){if(!nav.contains(e.target))close();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
  }

  /* ---------- Recherche (cartes grand public / liste pro) ---------- */
  var norm=function(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();};
  document.querySelectorAll('[data-filter]').forEach(function(inp){
    var items=document.querySelectorAll(inp.getAttribute('data-filter'));
    var empty=document.querySelector(inp.getAttribute('data-empty'));
    inp.addEventListener('input',function(){
      var q=norm(inp.value), n=0;
      items.forEach(function(it){var ok=!q||norm(it.getAttribute('data-search')).indexOf(q)>-1; it.style.display=ok?'':'none'; if(ok)n++;});
      if(empty) empty.style.display=n?'none':'block';
    });
  });

  /* ---------- Vérificateur d'interactions (données des monographies) ---------- */
  var PLANTS={
    'curcuma':{name:'Curcuma',page:'curcuma-pro.html',alias:['curcuma','curcuma longa','kherqoum','kurkum','turmeric','curcumine','الكركم','خرقوم'],
      inter:[
        {row:'int-saignement',label:'Anticoagulants et antiagrégants plaquettaires',
         terms:['anticoagulant','anticoagulants','avk','antivitamine k','anti-vitamine k','warfarine','coumadine','acenocoumarol','sintrom','fluindione','previscan','aod','apixaban','eliquis','rivaroxaban','xarelto','dabigatran','pradaxa','heparine','hbpm','enoxaparine','lovenox','antiagregant','antiagregants','anti-agregant','antiplaquettaire','aspirine','acide acetylsalicylique','kardegic','clopidogrel','plavix','ticagrelor','brilique','prasugrel','efient']},
        {row:'int-foie',label:'Méthotrexate, léflunomide (hépatotoxicité)',
         terms:['methotrexate','mtx','metoject','novatrex','imeth','leflunomide','arava']}
      ]},
    'gingembre':{name:'Gingembre',alias:['gingembre','zingiber','الزنجبيل','skinjbir']},
    'fenugrec':{name:'Fenugrec',alias:['fenugrec','trigonella','helba','الحلبة']},
    'romarin':{name:'Romarin',alias:['romarin','rosmarinus','azir','إكليل الجبل','ازير']},
    'thym':{name:'Thym',alias:['thym','thymus','zaatar','الزعتر']},
    'argan':{name:'Argan',alias:['argan','argania','الأركان','اركان']},
    'ortie':{name:'Ortie',alias:['ortie','urtica','القراص']},
    'aloes':{name:'Aloès',alias:['aloes','aloe','aloe vera','الصبار','الصبر']},
    'henne':{name:'Henné',alias:['henne','lawsonia','الحناء']},
    'lavande':{name:'Lavande',alias:['lavande','lavandula','الخزامى']},
    'figuier':{name:'Figuier de Barbarie',alias:['figuier de barbarie','figuier','opuntia','hendia','الهندية']}
  };
  var form=document.getElementById('checker');
  if(form){
    var dlP=document.getElementById('dl-plants'), dlM=document.getElementById('dl-meds');
    Object.keys(PLANTS).forEach(function(k){var o=document.createElement('option');o.value=PLANTS[k].name;dlP.appendChild(o);});
    var meds=['Warfarine','Acénocoumarol (Sintrom)','Fluindione (Previscan)','Apixaban (Eliquis)','Rivaroxaban (Xarelto)','Dabigatran (Pradaxa)','Héparine','Énoxaparine (Lovenox)','Aspirine','Clopidogrel (Plavix)','Ticagrelor (Brilique)','Prasugrel (Efient)','Anticoagulants','Antiagrégants plaquettaires','Méthotrexate','Léflunomide (Arava)'];
    meds.forEach(function(m){var o=document.createElement('option');o.value=m;dlM.appendChild(o);});
    var out=document.getElementById('result');
    var show=function(cls,html){out.className='result show '+cls;out.innerHTML=html;};
    var findPlant=function(q){q=norm(q);if(!q)return null;
      for(var k in PLANTS){var p=PLANTS[k];if(norm(p.name)===q||p.alias.some(function(a){return norm(a)===q;}))return p;}
      for(var k2 in PLANTS){var p2=PLANTS[k2];if(q.length>=3&&(norm(p2.name).indexOf(q)===0||p2.alias.some(function(a){return norm(a).indexOf(q)===0;})))return p2;}
      return null;};
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var pq=document.getElementById('in-plant').value, mq=document.getElementById('in-med').value;
      var p=findPlant(pq);
      if(!p){show('none','Plante non reconnue. Choisissez une plante dans la liste proposée.');return;}
      if(!p.page){show('none','<strong>'+p.name+'</strong> : monographie en préparation. Les interactions seront disponibles à sa publication.');return;}
      var m=norm(mq.replace(/\(.*?\)/g,' ')).replace(/\s+/g,' ');
      if(!m){show('none','Indiquez un médicament (DCI, nom commercial ou classe).');return;}
      var hit=null;
      p.inter.forEach(function(it){ if(hit) return;
        if(it.terms.some(function(t){return m===t||(m.length>=4&&(t.indexOf(m)===0||m.indexOf(t)===0));})) hit=it;});
      var link=p.page+'?med='+encodeURIComponent(mq.trim());
      if(hit){
        show('hit','<strong>Interaction documentée</strong><br>'+p.name+' + '+mq.trim()+' : '+hit.label+'.<br><a href="'+link+'#'+hit.row+'">Voir le détail dans la monographie</a>');
      }else{
        show('none','<strong>Aucune interaction documentée</strong> dans notre monographie pour '+p.name+' + '+mq.trim()+'.<br>L\u2019absence de donnée ne signifie pas l\u2019absence d\u2019interaction.<br><a href="'+p.page+'#interactions">Voir toutes les interactions du '+p.name.toLowerCase()+'</a>');
      }
    });
  }


  /* ---------- Panneaux : tout déplier / replier ---------- */
  document.querySelectorAll('[data-panels]').forEach(function(b){
    b.addEventListener('click',function(){var o=b.dataset.panels==='open';document.querySelectorAll('details.panel').forEach(function(d){d.open=o;});});
  });
  /* Ouvrir le panneau visé par un lien interne (sommaire, référence, interaction) */
  var openTarget=function(){
    if(!location.hash) return; var t=document.querySelector(location.hash); if(!t) return;
    var d=t.closest('details'); while(d){d.open=true; d=d.parentElement.closest('details');}
  };
  window.addEventListener('hashchange',openTarget); openTarget();

  /* ---------- Monographie : surligner l'interaction demandée ---------- */
  var params=new URLSearchParams(location.search), med=params.get('med');
  var box=document.getElementById('found');
  if(box&&med&&location.hash){
    var row=document.querySelector(location.hash);
    if(row&&row.classList.contains('inter')){
      row.classList.add('hl');
      box.textContent='Résultat de votre recherche : « '+med+' » correspond à la ligne surlignée ci-dessous.';
      box.classList.add('show');
      var go=function(){row.scrollIntoView({block:'center'});};
      if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){setTimeout(go,60);});}
      window.addEventListener('load',function(){setTimeout(go,60);});
    }
  }

  /* ---------- Formulaire de contact : ouvre la messagerie ---------- */
  var cf=document.getElementById('contact-form');
  if(cf){
    cf.addEventListener('submit',function(e){
      e.preventDefault();
      var g=function(id){return document.getElementById(id).value.trim();};
      var sel=document.getElementById('c-profil'); var prof=sel.options[sel.selectedIndex].text;
      var subject='[Nabaty Care] Message de '+(g('c-nom')||'visiteur')+' ('+prof+')';
      var body=g('c-msg')+'\n\n— '+g('c-nom')+(g('c-mail')?' · '+g('c-mail'):'')+'\nProfil : '+prof;
      location.href='mailto:nabatycare@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    });
  }
})();
