(function(){
  function close(){document.querySelector('#drawer')?.classList.add('hidden')}
  function scrollTo(id){close();setTimeout(()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'}),80)}
  function setup(){
    const drawer=document.querySelector('#drawer .drawerBox');if(!drawer||document.querySelector('#lumenCategories'))return;
    const box=document.createElement('div');box.id='lumenCategories';box.innerHTML=`<div class="categoryTitle">الأقسام</div><div class="categoryGroup"><button class="categoryBtn" data-cat="pc">🎮 <span>PC Games</span><small>ألعاب الكمبيوتر</small></button><button class="categoryBtn" data-cat="steam">🟣 Steam</button><button class="categoryBtn" data-cat="epic">⚫ Epic Games</button><button class="categoryBtn" data-cat="software">💻 Software & Apps</button><button class="categoryBtn" data-cat="ai">🤖 AI Tools</button><button class="categoryBtn" data-cat="creative">🎨 Creative</button><button class="categoryBtn" data-cat="productivity">📋 Productivity</button><button class="categoryBtn" data-cat="developer">👨‍💻 Developer</button><button class="categoryBtn" data-cat="os">🪟 Operating Systems</button></div>`;
    drawer.querySelector('.drawerBrand')?.after(box);
    document.addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(!b)return;const c=b.dataset.cat;if(c==='pc')return scrollTo('popularSection');if(c==='software')return scrollTo('softwareSection');if(c==='steam'){scrollTo('deals');setTimeout(()=>document.querySelector('#lumenFilters [data-store="1"]')?.click(),150);return}if(c==='epic'){close();alert('Epic Games موجودة في الأقسام، لكن مصدر الأسعار الحالي CheapShark لا يقدّم Epic في الـfeed الحالي؛ لذلك مش هنعرض أسعار وهمية.');return}const map={ai:0,creative:1,productivity:2,developer:3,os:4};if(map[c]!==undefined){scrollTo('softwareSection');setTimeout(()=>document.querySelector(`[data-softcat="${map[c]}"]`)?.click(),180)}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
