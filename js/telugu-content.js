(function(){
"use strict";
const state={
 data:null,allQuestions:[],filteredQuestions:[],index:0,selectedIndex:null,
 revealed:false,answered:new Set(),selectedAnswers:new Map(),revealedQuestions:new Set(),
 selectedSubject:"",questionNumber:"",hasStoredProgress:false
};
const $=id=>document.getElementById(id);
const bankPath=document.body.dataset.bank||"data/paper2a-official-question-bank.json";
const storageKey=document.body.dataset.storageKey||"aptet-v4-official-2700";
const isAllResource=storageKey.includes("official-2700");

function safeLoad(){
  try{return JSON.parse(localStorage.getItem(storageKey)||"null")}catch(e){return null}
}
function safeSave(){
  try{
    const payload={
      version:4,selectedSubject:state.selectedSubject,index:state.index,
      questionId:currentQuestion()?.id||null,questionNumber:currentQuestion()?.questionNumber||null,
      answered:[...state.answered],selectedAnswers:[...state.selectedAnswers.entries()],
      revealedQuestions:[...state.revealedQuestions],savedAt:new Date().toISOString()
    };
    localStorage.setItem(storageKey,JSON.stringify(payload));
  }catch(e){}
}
function restoreProgress(){
  const p=safeLoad();
  if(!p||p.version!==4)return null;
  state.answered=new Set(Array.isArray(p.answered)?p.answered:[]);
  state.selectedAnswers=new Map(Array.isArray(p.selectedAnswers)?p.selectedAnswers:[]);
  state.revealedQuestions=new Set(Array.isArray(p.revealedQuestions)?p.revealedQuestions:[]);
  state.selectedSubject=p.selectedSubject||state.data.sections[0]?.id||"";
  return p;
}
function clearStoredProgress(){
  try{localStorage.removeItem(storageKey)}catch(e){}
  state.answered.clear();state.selectedAnswers.clear();state.revealedQuestions.clear();
  state.selectedIndex=null;state.revealed=false;state.index=0;
}
function sectionQuestions(sectionId){
  return state.allQuestions.filter(q=>q.sectionId===sectionId);
}
function currentQuestion(){return state.filteredQuestions[state.index]}
function scopeAnsweredCount(){
  const ids=new Set((state.selectedSubject==="all"?state.allQuestions:sectionQuestions(state.selectedSubject)).map(q=>q.id));
  let n=0; for(const id of state.answered) if(ids.has(id)) n++; return n;
}

async function loadBank(){
  try{
    const response=await fetch(bankPath,{cache:"force-cache"});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    state.data=await response.json();
    state.allQuestions=[];
    for(const section of state.data.sections){
      section.questions.forEach((question,index)=>{
        state.allQuestions.push({...question,questionNumber:question.questionNumber||index+1,sectionId:section.id,sectionTitle:section.title,sectionTotal:section.questions.length});
      });
    }
    buildSubjectSelect();
    const saved=restoreProgress();
    if(saved){
      state.hasStoredProgress=true;
      if($('subjectSelect').querySelector(`option[value="${CSS.escape(state.selectedSubject)}"]`)) $('subjectSelect').value=state.selectedSubject;
      setSectionView(state.selectedSubject||state.data.sections[0].id,false);
      if(saved.questionId){
        const idx=state.filteredQuestions.findIndex(q=>q.id===saved.questionId);
        if(idx>=0)state.index=idx;
        else if(Number.isInteger(saved.index))state.index=Math.min(saved.index,state.filteredQuestions.length-1);
      }else if(Number.isInteger(saved.index))state.index=Math.min(saved.index,state.filteredQuestions.length-1);
      state.selectedIndex=null;state.revealed=false;
      render();
      showResumeModal();
    }else{
      setSectionView(state.data.sections[0]?.id||"",false);
      render();
    }
  }catch(error){
    $("questionCard").innerHTML=`<div class="error-box"><strong>Question bank load కాలేదు.</strong><p>${escapeHtml(error.message)}</p><p><code>${escapeHtml(bankPath)}</code> file సరైన locationలో ఉందో చూడండి.</p></div>`;
  }
}
function buildSubjectSelect(){
  const select=$("subjectSelect");select.innerHTML="";
  if(isAllResource){
    const all=document.createElement("option");all.value="all";all.textContent=`అన్ని విభాగాలు (${state.allQuestions.length})`;select.appendChild(all);
  }
  for(const section of state.data.sections){
    const option=document.createElement("option");option.value=section.id;option.textContent=`${section.title} (${section.questions.length})`;select.appendChild(option);
  }
}
function setSectionView(subject,resetIndex=true){
  state.selectedSubject=subject||state.data.sections[0]?.id||"";
  state.filteredQuestions=state.selectedSubject==="all"?state.allQuestions.slice():sectionQuestions(state.selectedSubject);
  if(resetIndex)state.index=0;
  state.questionNumber="";$("questionNumberInput").value="";
  state.selectedIndex=null;state.revealed=false;
}
function render(){
  const q=currentQuestion();if(!q)return renderEmpty();
  const total=state.filteredQuestions.length;
  $("questionNumber").textContent=state.selectedSubject==="all"?`QUESTION ${q.questionNumber} · ${q.sectionTitle}`:`QUESTION ${q.questionNumber} OF ${q.sectionTotal}`;
  $("questionSubject").textContent=q.sectionTitle;
  $("positionLabel").textContent=state.selectedSubject==="all"?`Question ${state.index+1} / ${total}`:`Question ${q.questionNumber} / ${q.sectionTotal}`;
  $("subjectLabel").textContent=q.sectionTitle;
  $("questionTopic").textContent=q.topic?`📌 అంశం: ${q.topic}`:"";
  $("questionText").innerHTML=formatText(q.question);
  const options=$("options");options.innerHTML="";
  const savedChoice=state.selectedAnswers.get(q.id);
  state.selectedIndex=savedChoice===undefined?null:savedChoice;
  state.revealed=state.revealedQuestions.has(q.id);
  q.options.forEach((option,i)=>{
    const button=document.createElement("button");button.className="option";button.dataset.index=i;
    button.innerHTML=`<span class="option-letter">${String.fromCharCode(65+i)}</span><span>${formatText(option)}</span>`;
    button.addEventListener("click",()=>selectOption(i));options.appendChild(button);
  });
  $("answerPanel").classList.add("hidden");$("answerStatus").textContent="";$("correctAnswer").textContent="";$("explanationText").textContent="";
  $("revealBtn").disabled=false;
  if(state.revealed)showReveal();
  $("prevBtn").disabled=state.index===0;$("nextBtn").disabled=state.index===total-1;
  const pct=Math.round(((state.index+1)/total)*100);
  $("progressBar").style.width=`${pct}%`;$("progressPct").textContent=`${pct}%`;
  $("totalCount").textContent=total;$("answeredCount").textContent=scopeAnsweredCount();
}
function selectOption(index){
  if(state.revealed)return;
  const q=currentQuestion();if(!q)return;
  state.selectedIndex=index;state.selectedAnswers.set(q.id,index);state.answered.add(q.id);
  document.querySelectorAll(".option").forEach((b,i)=>b.classList.toggle("selected",i===index));
  $("answeredCount").textContent=scopeAnsweredCount();safeSave();
}
function showReveal(){
  const q=currentQuestion();if(!q)return;
  state.revealed=true;state.revealedQuestions.add(q.id);
  document.querySelectorAll(".option").forEach((button,i)=>{
    button.classList.remove("selected","correct","wrong");
    if(i===q.correctIndex)button.classList.add("correct");
    if(state.selectedIndex!==null&&i===state.selectedIndex&&i!==q.correctIndex)button.classList.add("wrong");
  });
  const chosen=state.selectedIndex;
  $("answerStatus").textContent=chosen===null?"సమాధానం చూపబడింది":chosen===q.correctIndex?"సరైన సమాధానం ✓":"తప్పు సమాధానం ✗";
  $("correctAnswer").textContent=`${String.fromCharCode(65+q.correctIndex)}. ${q.options[q.correctIndex]}`;
  $("explanationText").textContent=q.explanation||"వివరణ అందుబాటులో లేదు.";
  $("answerPanel").classList.remove("hidden");$("revealBtn").disabled=true;safeSave();
}
function scrollToQuestion(instant=false){
  const card=$("questionCard");if(!card)return;
  requestAnimationFrame(()=>{
    const header=document.querySelector(".topbar");const offset=(header?.getBoundingClientRect().height||0)+10;
    const top=Math.max(0,card.getBoundingClientRect().top+window.scrollY-offset);
    window.scrollTo({top,behavior:instant?"auto":"smooth"});
  });
}
function go(delta){
  const next=state.index+delta;if(next<0||next>=state.filteredQuestions.length)return;
  state.index=next;state.questionNumber="";$("questionNumberInput").value="";state.selectedIndex=null;state.revealed=false;safeSave();render();scrollToQuestion();
}
function goToQuestion(){
  const value=Number($("questionNumberInput").value);
  if(!Number.isInteger(value)||value<1){$("questionNumberInput").focus();return;}
  const pool=state.selectedSubject==="all"?state.allQuestions:sectionQuestions(state.selectedSubject);
  const idx=pool.findIndex(q=>Number(q.questionNumber)===value);
  if(idx<0){renderEmpty(`Question ${value} not found for the selected subject.`);return;}
  state.filteredQuestions=pool;state.index=idx;state.questionNumber=String(value);state.selectedIndex=null;state.revealed=false;safeSave();render();scrollToQuestion();
}
function renderEmpty(message="ఈ subject/question numberకు ప్రశ్నలు కనబడలేదు."){
  $("questionNumber").textContent="";$("questionSubject").textContent="";$("questionTopic").textContent="";$("positionLabel").textContent="No questions found";$("subjectLabel").textContent="";
  $("questionText").innerHTML=`<div class="empty-state">${escapeHtml(message)}</div>`;$("options").innerHTML="";$("answerPanel").classList.add("hidden");$("totalCount").textContent="0";$("progressPct").textContent="0%";$("progressBar").style.width="0%";$("prevBtn").disabled=true;$("nextBtn").disabled=true;$("revealBtn").disabled=true;
}
function formatText(value){return escapeHtml(value).replace(/\n/g,"<br>")}
function escapeHtml(value){return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
function showResumeModal(){
  const p=safeLoad();if(!p||!$("resumeModal"))return;
  const q=state.allQuestions.find(x=>x.id===p.questionId);const answered=state.answered.size;
  $("resumeMessage").textContent=q?`మీరు ${q.sectionTitle}లో Question ${q.questionNumber} దగ్గర practice ఆపారు. ${answered} ప్రశ్నలు attempt చేశారు.`:`మీరు ఇంతకుముందు practice చేశారు. ${answered} ప్రశ్నలు attempt చేశారు.`;
  $("resumeModal").classList.remove("hidden");
}
function closeResume(){ $("resumeModal")?.classList.add("hidden") }
function startFresh(){
  clearStoredProgress();state.hasStoredProgress=false;
  state.selectedSubject=isAllResource?state.data.sections[0]?.id||"":state.data.sections[0]?.id||"";
  $("subjectSelect").value=state.selectedSubject;setSectionView(state.selectedSubject,true);safeSave();render();closeResume();scrollToQuestion(true);
}
function resetCurrentScope(){
  const scopeQuestions=state.selectedSubject==="all"?state.allQuestions:sectionQuestions(state.selectedSubject);
  if(!scopeQuestions.length)return;
  const ids=new Set(scopeQuestions.map(q=>q.id));
  for(const id of ids){state.answered.delete(id);state.selectedAnswers.delete(id);state.revealedQuestions.delete(id)}
  const remaining=state.filteredQuestions.filter(q=>ids.has(q.id));
  const currentId=currentQuestion()?.id;state.index=Math.max(0,remaining.findIndex(q=>q.id===currentId));
  safeSave();render();scrollToQuestion(true);
  closeResume();
}
function confirmReset(){
  const label=isAllResource?(state.selectedSubject==="all"?"అన్ని విభాగాల":"ఈ విభాగం"):(state.data?.sections[0]?.title||"180 ప్రశ్నలు");
  $("resetMessage").textContent=`${label}లో మీ saved practice progress, selected answers మరియు revealed answers reset అవుతాయి. ఇది తిరిగి undo చేయలేరు.`;
  $("resetModal").classList.remove("hidden");
}
function closeReset(){ $("resetModal")?.classList.add("hidden") }

$("subjectSelect").addEventListener("change",()=>{setSectionView($("subjectSelect").value,true);safeSave();render();scrollToQuestion();});
$("goToQuestionBtn").addEventListener("click",goToQuestion);
$("questionNumberInput").addEventListener("keydown",e=>{if(e.key==="Enter")goToQuestion()});
$("clearNumberBtn").addEventListener("click",()=>{$("questionNumberInput").value="";state.questionNumber="";state.filteredQuestions=state.selectedSubject==="all"?state.allQuestions.slice():sectionQuestions(state.selectedSubject);state.index=0;state.selectedIndex=null;state.revealed=false;safeSave();render();scrollToQuestion();});
$("revealBtn").addEventListener("click",showReveal);$("prevBtn").addEventListener("click",()=>go(-1));$("nextBtn").addEventListener("click",()=>go(1));
$("randomBtn").addEventListener("click",()=>{state.filteredQuestions=state.selectedSubject==="all"?state.allQuestions.slice():sectionQuestions(state.selectedSubject);if(!state.filteredQuestions.length)return renderEmpty();state.index=Math.floor(Math.random()*state.filteredQuestions.length);state.questionNumber="";$("questionNumberInput").value="";state.selectedIndex=null;state.revealed=false;safeSave();render();scrollToQuestion();});
$("resetBtn").addEventListener("click",confirmReset);$("confirmResetBtn").addEventListener("click",()=>{resetCurrentScope();closeReset()});$("cancelResetBtn").addEventListener("click",closeReset);
$("resumeContinueBtn").addEventListener("click",closeResume);$("resumeFreshBtn").addEventListener("click",startFresh);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")safeSave()});window.addEventListener("pagehide",safeSave);window.addEventListener("beforeunload",safeSave);
loadBank();
})();
