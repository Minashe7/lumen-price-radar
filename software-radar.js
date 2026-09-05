const LUMEN_SOFTWARE=[
 {cat:'AI Tools',items:[
  ['ChatGPT','AI assistant','https://chatgpt.com/'],['Claude','AI assistant','https://claude.ai/'],['Gemini','AI assistant','https://gemini.google.com/'],['Perplexity','AI search','https://www.perplexity.ai/'],['Midjourney','AI image generation','https://www.midjourney.com/']
 ]},
 {cat:'Creative',items:[
  ['Adobe Photoshop','Photo editing','https://www.adobe.com/products/photoshop.html'],['Adobe Premiere Pro','Video editing','https://www.adobe.com/products/premiere.html'],['Canva','Design & content','https://www.canva.com/'],['Figma','UI/UX design','https://www.figma.com/']
 ]},
 {cat:'Productivity',items:[
  ['Microsoft 365','Office + cloud','https://www.microsoft.com/microsoft-365'],['Notion','Workspace','https://www.notion.com/'],['Canva Pro','Premium design','https://www.canva.com/pro/']
 ]},
 {cat:'Developer',items:[
  ['JetBrains','Developer tools','https://www.jetbrains.com/'],['GitHub Copilot','AI coding assistant','https://github.com/features/copilot'],['Cursor','AI code editor','https://www.cursor.com/']
 ]},
 {cat:'Operating Systems',items:[
  ['Windows 11','Operating system','https://www.microsoft.com/software-download/windows11']
 ]}
];
function renderSoftwareRadar(){const root=document.querySelector('#software');if(!root)return;root.innerHTML=`<div class="softwareRadar"><div class="softwareCats">${LUMEN_SOFTWARE.map((g,i)=>`<button class="softCat ${i===0?'active':''}" data-softcat="${i}">${g.cat}</button>`).join('')}</div><div class="softwareGrid" id="softwareGrid"></div><p class="muted softwareNote">Lumen يعرض الروابط الرسمية حاليًا. أسعار البرامج والـAI ستدخل كـ live feeds عندما تتوفر مصادر/واجهات مسموح بها، بدون أسعار وهمية.</p></div>`;const grid=document.querySelector('#softwareGrid');const draw=i=>{const g=LUMEN_SOFTWARE[i];grid.innerHTML=g.items.map(x=>`<article class="soft"><b>${x[0]}</b><small>${x[1]}</small><a href="${x[2]}" target="_blank" rel="noopener">فتح الموقع الرسمي ↗</a></article>`).join('')};document.querySelectorAll('[data-softcat]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-softcat]').forEach(x=>x.classList.remove('active'));b.classList.add('active');draw(Number(b.dataset.softcat))});draw(0)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',renderSoftwareRadar);else renderSoftwareRadar();
