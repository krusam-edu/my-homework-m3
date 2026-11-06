'use strict';
window.addEventListener('load',async()=>{
 const results=[];const check=(name,ok)=>{if(!ok)throw new Error(name);results.push(name)};
 try{
 check('7 navigation entries',document.querySelectorAll('[data-nav]').length===7);
 for(let i=0;i<7;i++){document.querySelector('[data-nav="'+i+'"]').click();check('module '+(i+1)+' renders',!!document.querySelector('[data-finish="'+i+'"]'));}
 document.querySelector('[data-nav="2"]').click();
 check('6 SVG diagrams',document.querySelectorAll('.blocks-image').length===6);
 await Promise.all([...document.querySelectorAll('.blocks-image')].map(img=>img.complete?Promise.resolve():new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject})));
 check('6 images load',[...document.querySelectorAll('.blocks-image')].every(img=>img.naturalWidth>0));
 check('no pseudocode',!document.querySelector('.block-code')&&!document.querySelector('[data-copy-block]'));
 check('no page overflow',document.documentElement.scrollWidth<=window.innerWidth);
 check('6 drag guides',document.querySelectorAll('#moduleArea ol.steps').length===6);
 if(!state.done[2])document.querySelector('[data-finish="2"]').click();
 check('progress saved',JSON.parse(localStorage.getItem('my_homework_m3_course_v1')).done[2]===true);
 document.querySelector('[data-nav="4"]').click();
 let input=document.querySelector('[data-answer="0"]');input.value='QA answer';input.dispatchEvent(new Event('input'));
 check('worksheet saved',JSON.parse(localStorage.getItem('my_homework_m3_course_v1')).answers[0]==='QA answer');
 document.querySelector('input[name="quiz0"][value="1"]').click();document.getElementById('gradeQuiz').click();
 check('quiz grades',document.getElementById('quizResult').textContent.length>0);
 document.querySelector('[data-nav="5"]').click();document.querySelector('input[name="test0"][value="pass"]').click();
 check('test results saved',JSON.parse(localStorage.getItem('my_homework_m3_course_v1')).tests[0]==='pass');
 document.querySelector('[data-nav="6"]').click();check('export and print buttons',!!document.getElementById('finalExport')&&!!document.getElementById('finalPrint'));
 if(sessionStorage.getItem('qa-reloaded')!=='yes'){sessionStorage.setItem('qa-reloaded','yes');location.reload();return;}
 check('state restored after reload',state.answers[0]==='QA answer'&&state.done[2]===true&&state.tests[0]==='pass');
 document.querySelector('[data-nav="2"]').click();
 const report=document.createElement('pre');report.id='qa-result';report.textContent='PASS: '+results.join('\nPASS: ');document.body.prepend(report);
 }catch(e){document.body.innerHTML='<pre id="qa-result">FAIL: '+e.message+'</pre>';}
});
