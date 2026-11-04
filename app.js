const $ = id => document.getElementById(id);
const KEY = "wifiInspectorDataV1";
let data = {router:{},devices:[],scans:[]};
function load(){try{const v=JSON.parse(localStorage.getItem(KEY)||"{}");data={...data,...v};data.router=data.router||{};data.devices=data.devices||[];data.scans=data.scans||[]}catch(e){}; $("ssid").value=data.router.ssid||"";$("routerIp").value=data.router.ip||"";$("routerModel").value=data.router.model||"";render()}
function save(){localStorage.setItem(KEY,JSON.stringify(data));}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function render(){
 const dl=$("devicesList");dl.innerHTML=data.devices.length?data.devices.map((d,i)=>`<div class="item"><b>${esc(d.name||"جهاز بدون اسم")}</b><br>النوع: ${esc(d.type||"-")} · IP: ${esc(d.ip||"-")} · MAC: ${esc(d.mac||"-")}<br>${esc(d.notes||"")}<br><button class="secondary" data-del="${i}">حذف</button></div>`).join(""):"لا توجد أجهزة مسجلة بعد.";
 const sl=$("scansList");sl.innerHTML=data.scans.length?data.scans.slice().reverse().map(s=>`<div class="item"><b>${esc(s.date)}</b><br>عدد الأجهزة: ${esc(s.count)}<br>${esc(s.notes||"")}</div>`).join(""):"لا توجد فحوصات محفوظة بعد.";
}
$("saveRouter").onclick=()=>{data.router={ssid:$("ssid").value.trim(),ip:$("routerIp").value.trim(),model:$("routerModel").value.trim()};save();alert("تم حفظ بيانات الراوتر على هذا الجهاز.")};
$("openRouter").onclick=()=>{let ip=$("routerIp").value.trim();if(!ip){alert("أدخل عنوان IP للراوتر أولًا.");return}if(!/^https?:\/\//i.test(ip))ip="http://"+ip;window.open(ip,"_blank","noopener")};
$("saveScan").onclick=()=>{data.scans.push({date:new Date().toLocaleString("ar"),count:$("deviceCount").value||"0",notes:$("scanNotes").value.trim()});save();$("deviceCount").value="";$("scanNotes").value="";render();alert("تم حفظ نتيجة الفحص.")};
$("addDevice").onclick=()=>{data.devices.push({name:$("deviceName").value.trim(),type:$("deviceType").value.trim(),ip:$("deviceIp").value.trim(),mac:$("deviceMac").value.trim(),notes:$("deviceNotes").value.trim()});save();["deviceName","deviceType","deviceIp","deviceMac","deviceNotes"].forEach(id=>$(id).value="");render()};
$("devicesList").onclick=e=>{const i=e.target.dataset.del;if(i!==undefined){data.devices.splice(Number(i),1);save();render()}};
function download(name,content,type){const a=document.createElement("a"),u=URL.createObjectURL(new Blob([content],{type}));a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
$("exportJson").onclick=()=>download("wifi-inspector-backup.json",JSON.stringify(data,null,2),"application/json");
$("exportCsv").onclick=()=>{const rows=[["القسم","التاريخ/الاسم","النوع/العدد","IP","MAC","ملاحظات"],...data.devices.map(d=>["جهاز",d.name,d.type,d.ip,d.mac,d.notes]),...data.scans.map(s=>["فحص",s.date,s.count,"","",s.notes])];const csv="\uFEFF"+rows.map(r=>r.map(x=>'"'+String(x??"").replace(/"/g,'""')+'"').join(",")).join("\n");download("wifi-inspector-report.csv",csv,"text/csv;charset=utf-8")};
load();
