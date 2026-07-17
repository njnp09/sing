
"use strict";
const DEFAULT_SONGS=[{"title": "XUXA", "lyrics": "[Afegeix aquí la lletra o les indicacions de Xuxa]"}, {"title": "EVA MARÍA", "lyrics": "[Afegeix aquí la lletra o les indicacions d’Eva María]"}, {"title": "CUÉNTAME", "lyrics": "[Afegeix aquí la lletra o les indicacions de Cuéntame]"}, {"title": "LIBRE", "lyrics": "[Afegeix aquí la lletra o les indicacions de Libre]"}, {"title": "ABANIBÍ ABOEBÉ", "lyrics": "[Afegeix aquí la lletra o les indicacions d’Abanibí Aboebé]"}, {"title": "MIX MAMMA MIA", "lyrics": "MAMMA MIA\n\n[lletra]\n\nGLORIA\n\n[lletra]\n\nTENGO EL CORAZÓN CONTENTO\n\n[lletra]"}, {"title": "MIX RAINING", "lyrics": "IT’S RAINING MEN\n\n[lletra]\n\nMIDNIGHT\n\n[lletra]\n\nYO NO SOY ESA\n\n[lletra]"}, {"title": "MIX VIVO CANTANDO", "lyrics": "VIVO CANTANDO\n\n[lletra]\n\nLA FELICIDAD\n\n[lletra]\n\nCAMISA NEGRA\n\n[lletra]\n\nPORQUE TE VAS\n\n[lletra]\n\nCOULD YOU BE LOVED\n\n[lletra]\n\nME GUSTAS TÚ\n\n[lletra]\n\nEVERYBODY\n\n[lletra]\n\nSPICE GIRLS\n\n[lletra]\n\nDRAGOSTEA DIN TEI\n\n[lletra]"}, {"title": "VIVIR ASÍ ES MORIR DE AMOR", "lyrics": "[Afegeix aquí la lletra]"}, {"title": "HELP", "lyrics": "[Afegeix aquí la lletra]"}, {"title": "LA PUERTA DE ALCALÁ", "lyrics": "[Afegeix aquí la lletra]"}, {"title": "MIX LATINO", "lyrics": "SOLAMENTE BÉSAME\n\n[lletra]\n\nLA MORDIDITA\n\n[lletra]\n\nFELICES LOS 4\n\n[lletra]\n\nQUE LEVANTE LA MANO\n\n[lletra]\n\nLA MOROCHA\n\n[lletra]"}, {"title": "MIX OREJA", "lyrics": "20 DE ENERO\n\n[lletra]\n\nEL 28\n\n[lletra]\n\nPUEDES CONTAR CONMIGO\n\n[lletra]"}, {"title": "MIX MECANO", "lyrics": "CHICA YEYÉ\n\n[lletra]\n\nME COLÉ EN UNA FIESTA\n\n[lletra]\n\nMAQUILLAJE\n\n[lletra]\n\nBAILANDO\n\n[lletra]"}, {"title": "EL SOL NO REGRESA", "lyrics": "[Afegeix aquí la lletra]"}, {"title": "BOIG PER TU", "lyrics": "[Afegeix aquí la lletra]"}];
const STORAGE_KEY="clicksing_4l_data_v1";
const THEME_KEY="clicksing_theme";
let songs=[];
let current=0;
let concertFont=42;

const $=id=>document.getElementById(id);
function load(){
  try{songs=JSON.parse(localStorage.getItem(STORAGE_KEY))||structuredClone(DEFAULT_SONGS)}
  catch{songs=structuredClone(DEFAULT_SONGS)}
  if(!Array.isArray(songs)||!songs.length)songs=structuredClone(DEFAULT_SONGS);
}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(songs))}
function renderList(filter=""){
  const q=filter.trim().toLowerCase();
  const list=$("songList"); list.innerHTML="";
  songs.forEach((song,i)=>{
    if(q&&!song.title.toLowerCase().includes(q))return;
    const el=document.createElement("div");
    el.className="song-item"+(i===current?" active":"");
    el.textContent=song.title;
    el.onclick=()=>{current=i;render()};
    list.appendChild(el);
  });
}
function render(){
  const song=songs[current];
  $("songTitle").textContent=song?.title||"Sense cançons";
  $("lyricsView").textContent=song?.lyrics||"";
  $("concertTitle").textContent=song?.title||"";
  $("concertLyrics").textContent=song?.lyrics||"";
  renderList($("searchInput").value);
}
function move(delta){
  if(!songs.length)return;
  current=(current+delta+songs.length)%songs.length;
  render();
  $("lyricsView").scrollTop=0;
  $("concertLyrics").scrollTop=0;
}
function openEditor(){
  const song=songs[current]; if(!song)return;
  $("editTitle").value=song.title;
  $("editLyrics").value=song.lyrics;
  $("editorModal").classList.remove("hidden");
}
function closeEditor(){$("editorModal").classList.add("hidden")}
function addSong(){
  songs.push({title:"NOVA CANÇÓ",lyrics:"[Escriu aquí la lletra o les indicacions]"});
  current=songs.length-1; save(); render(); openEditor();
}
function deleteSong(){
  if(!songs.length)return;
  if(!confirm(`Eliminar “${songs[current].title}”?`))return;
  songs.splice(current,1);
  if(!songs.length)songs.push({title:"NOVA CANÇÓ",lyrics:""});
  current=Math.min(current,songs.length-1); save(); render();
}
function enterConcert(){
  $("concertView").classList.remove("hidden");
  document.documentElement.requestFullscreen?.().catch(()=>{});
  render();
}
function exitConcert(){
  $("concertView").classList.add("hidden");
  document.exitFullscreen?.().catch(()=>{});
}
function applyTheme(){
  const light=localStorage.getItem(THEME_KEY)==="light";
  document.body.classList.toggle("light",light);
  $("themeBtn").textContent=light?"☀️":"🌙";
}
load();
applyTheme();
render();

$("searchInput").addEventListener("input",e=>renderList(e.target.value));
$("prevBtn").onclick=()=>move(-1);
$("nextBtn").onclick=()=>move(1);
$("concertPrev").onclick=()=>move(-1);
$("concertNext").onclick=()=>move(1);
$("editBtn").onclick=openEditor;
$("closeEditor").onclick=closeEditor;
$("cancelEdit").onclick=closeEditor;
$("saveEdit").onclick=()=>{
  const title=$("editTitle").value.trim();
  if(!title){alert("El títol no pot quedar buit.");return}
  songs[current]={title,lyrics:$("editLyrics").value};
  save();render();closeEditor();
};
$("addSongBtn").onclick=addSong;
$("deleteBtn").onclick=deleteSong;
$("concertBtn").onclick=enterConcert;
$("exitConcert").onclick=exitConcert;
$("fontUp").onclick=()=>{concertFont=Math.min(80,concertFont+4);$("concertLyrics").style.fontSize=concertFont+"px"};
$("fontDown").onclick=()=>{concertFont=Math.max(22,concertFont-4);$("concertLyrics").style.fontSize=concertFont+"px"};
$("themeBtn").onclick=()=>{
  localStorage.setItem(THEME_KEY,document.body.classList.contains("light")?"dark":"light");
  applyTheme();
};
document.addEventListener("keydown",e=>{
  if(!$("concertView").classList.contains("hidden")){
    if(e.key==="ArrowRight")move(1);
    if(e.key==="ArrowLeft")move(-1);
    if(e.key==="Escape")exitConcert();
  }
});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(console.warn));
