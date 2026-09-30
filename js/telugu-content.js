const state={
 data:null,allQuestions:[],filteredQuestions:[],index:0,selectedIndex:null,
 revealed:false,answered:new Set(),selectedSubject:"all",questionNumber:""
};
const $=id=>document.getElementById(id);
const bankPath=document.body.dataset.bank||"data/paper2a-official-question-bank.json";

async function loadBank(){
  try{
    const response=await fetch(bankPath,{cache:"force-cache"});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    state.data=await response.json();
    state.allQuestions=[];
    for(const section of state.data.sections){
      section.questions.forEach((question,index)=>{
        state.allQuestions.push({
          ...question,
          questionNumber:question.questionNumber||index+1,
          sectionId:section.id,
          sectionTitle:section.title,
          sectionTotal:section.questions.length
        });
      });
    }
    buildSubjectSelect();
    applyFilters();
  }catch(error){
    $("questionCard").innerHTML=
      `<div class="error-box"><strong>Question bank load కాలేదు.</strong><p>${escapeHtml(error.message)}</p><p><code>${escapeHtml(bankPath)}</code> file సరైన locationలో ఉందో చూడండి.</p></div>`;
  }
}
function buildSubjectSelect(){
  const select=$("subjectSelect");
  select.innerHTML="";
  for(const section of state.data.sections){
    const option=document.createElement("option");
    option.value=section.id;
    option.textContent=`${section.title} (${section.questions.length})`;
    select.appendChild(option);
  }
}
function applyFilters(){
  state.selectedSubject=$("subjectSelect").value;
  state.questionNumber=$("questionNumberInput").value.trim();
  state.filteredQuestions=state.allQuestions.filter(q=>{
    const subjectOk=!state.selectedSubject||state.selectedSubject==="all"||q.sectionId===state.selectedSubject;
    const numberOk=!state.questionNumber||String(q.questionNumber)===state.questionNumber;
    return subjectOk&&numberOk;
  });
  state.index=Math.min(state.index,Math.max(0,state.filteredQuestions.length-1));
  state.revealed=false;state.selectedIndex=null;
  state.filteredQuestions.length?render():renderEmpty();
}
function currentQuestion(){return state.filteredQuestions[state.index]}
function render(){
  const q=currentQuestion();if(!q)return renderEmpty();
  const total=state.filteredQuestions.length;
  $("questionNumber").textContent=state.selectedSubject==="all"?`QUESTION ${q.questionNumber} · ${q.sectionTitle}`:`QUESTION ${q.questionNumber} OF ${q.sectionTotal}`;
  $("questionSubject").textContent=q.sectionTitle;
  $("positionLabel").textContent=state.questionNumber?`Question ${state.index+1} / ${total} match${total===1?"":"es"}`:`Question ${q.questionNumber} / ${q.sectionTotal}`;
  $("subjectLabel").textContent=q.sectionTitle;
  $("questionTopic").textContent=q.topic?`📌 అంశం: ${q.topic}`:"";
  $("questionText").innerHTML=formatText(q.question);
  const options=$("options");options.innerHTML="";
  q.options.forEach((option,i)=>{
    const button=document.createElement("button");
    button.className="option";button.dataset.index=i;
    button.innerHTML=`<span class="option-letter">${String.fromCharCode(65+i)}</span><span>${formatText(option)}</span>`;
    button.addEventListener("click",()=>selectOption(i));options.appendChild(button);
  });
  $("answerPanel").classList.add("hidden");$("answerStatus").textContent="";
  $("correctAnswer").textContent="";$("explanationText").textContent="";
  $("revealBtn").disabled=false;
  if(state.revealed)showReveal();
  $("prevBtn").disabled=state.index===0;
  $("nextBtn").disabled=state.index===total-1;
  const pct=Math.round(((state.index+1)/total)*100);
  $("progressBar").style.width=`${pct}%`;$("progressPct").textContent=`${pct}%`;
  $("totalCount").textContent=total;$("answeredCount").textContent=state.answered.size;
}
function selectOption(index){
  if(state.revealed)return;
  state.selectedIndex=index;
  document.querySelectorAll(".option").forEach((b,i)=>b.classList.toggle("selected",i===index));
  state.answered.add(currentQuestion().id);$("answeredCount").textContent=state.answered.size;
}
function showReveal(){
  const q=currentQuestion();state.revealed=true;
  document.querySelectorAll(".option").forEach((button,i)=>{
    button.classList.remove("selected","correct","wrong");
    if(i===q.correctIndex)button.classList.add("correct");
    if(state.selectedIndex!==null&&i===state.selectedIndex&&i!==q.correctIndex)button.classList.add("wrong");
  });
  const chosen=state.selectedIndex;
  $("answerStatus").textContent=chosen===null?"సమాధానం చూపబడింది":chosen===q.correctIndex?"సరైన సమాధానం ✓":"తప్పు సమాధానం ✗";
  $("correctAnswer").textContent=`${String.fromCharCode(65+q.correctIndex)}. ${q.options[q.correctIndex]}`;
  $("explanationText").textContent=q.explanation;
  $("answerPanel").classList.remove("hidden");$("revealBtn").disabled=true;
}
function scrollToQuestion(){
  const card=$("questionCard");if(!card)return;
  requestAnimationFrame(()=>{
    const header=document.querySelector(".topbar");
    const offset=(header?.getBoundingClientRect().height||0)+10;
    const top=Math.max(0,card.getBoundingClientRect().top+window.scrollY-offset);
    window.scrollTo({top,behavior:"smooth"});
  });
}
function go(delta){
  const next=state.index+delta;
  if(next<0||next>=state.filteredQuestions.length)return;
  state.index=next;state.selectedIndex=null;state.revealed=false;render();scrollToQuestion();
}
function goToQuestion(){
  const value=Number($("questionNumberInput").value);
  if(!Number.isInteger(value)||value<1){$("questionNumberInput").focus();return;}
  const subject=state.selectedSubject;
  const matches=state.allQuestions.filter(q=>(subject==="all"||q.sectionId===subject)&&q.questionNumber===value);
  if(!matches.length){state.filteredQuestions=[];renderEmpty(`Question ${value} not found for the selected subject.`);return}
  state.questionNumber=String(value);state.filteredQuestions=matches;state.index=0;
  state.selectedIndex=null;state.revealed=false;render();scrollToQuestion();
}
function renderEmpty(message="ఈ subject/question numberకు ప్రశ్నలు కనబడలేదు."){
  $("questionNumber").textContent="";$("questionSubject").textContent="";$("questionTopic").textContent="";
  $("positionLabel").textContent="No questions found";$("subjectLabel").textContent="";
  $("questionText").innerHTML=`<div class="empty-state">${escapeHtml(message)}</div>`;
  $("options").innerHTML="";$("answerPanel").classList.add("hidden");
  $("totalCount").textContent="0";$("progressPct").textContent="0%";$("progressBar").style.width="0%";
  $("prevBtn").disabled=true;$("nextBtn").disabled=true;$("revealBtn").disabled=true;
}
function formatText(value){return escapeHtml(value).replace(/\n/g,"<br>")}
function escapeHtml(value){return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
$("subjectSelect").addEventListener("change",()=>{state.index=0;state.questionNumber="";$("questionNumberInput").value="";applyFilters();scrollToQuestion()});
$("goToQuestionBtn").addEventListener("click",goToQuestion);
$("questionNumberInput").addEventListener("keydown",e=>{if(e.key==="Enter")goToQuestion()});
$("clearNumberBtn").addEventListener("click",()=>{$("questionNumberInput").value="";state.index=0;state.questionNumber="";applyFilters();scrollToQuestion()});
$("revealBtn").addEventListener("click",showReveal);
$("prevBtn").addEventListener("click",()=>go(-1));
$("nextBtn").addEventListener("click",()=>go(1));
$("randomBtn").addEventListener("click",()=>{
  $("questionNumberInput").value="";state.questionNumber="";
  state.filteredQuestions=state.allQuestions.filter(q=>state.selectedSubject==="all"||q.sectionId===state.selectedSubject);
  if(!state.filteredQuestions.length)return renderEmpty();
  state.index=Math.floor(Math.random()*state.filteredQuestions.length);state.selectedIndex=null;state.revealed=false;
  render();scrollToQuestion();
});
loadBank();
