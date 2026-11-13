import { jsPDF } from "jspdf";
import { sortItems } from "./sorting";

export function makeNotePdf(work, items, action="save") {
  const doc = new jsPDF({orientation:"portrait", unit:"mm", format:"a4"});
  const pageW = 210, margin = 14;
  doc.setTextColor(16,59,112);
  doc.setFont("helvetica","bold"); doc.setFontSize(17);
  doc.text("e write", margin, 17);
  doc.setFontSize(10); doc.text(work.name.toUpperCase(), pageW-margin, 16, {align:"right"});
  doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(90,105,122);
  doc.text("MATERIAL REQUIREMENT NOTE", pageW-margin, 21, {align:"right"});
  doc.setDrawColor(23,105,170); doc.setLineWidth(.45); doc.line(margin,26,pageW-margin,26);
  const columns = [margin+3, 42, 77, 157];
  let y = 34;
  const header = () => {
    doc.setFillColor(16,59,112); doc.rect(margin,y,pageW-margin*2,9,"F");
    doc.setTextColor(255,255,255); doc.setFont("helvetica","bold"); doc.setFontSize(9);
    ["S.No","Size","Material","Quantity"].forEach((v,i)=>doc.text(v,columns[i],y+6));
    y += 9;
  };
  header();
  const sorted = sortItems(items);
  sorted.forEach((item,index) => {
    if (y > 278) { doc.addPage(); y=17; header(); }
    const qty = `${item.quantity ?? ""} ${item.unit || ""}`.trim();
    doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(32,42,53);
    doc.setDrawColor(215,222,231); doc.setLineWidth(.2);
    doc.line(margin,y+7,pageW-margin,y+7);
    doc.text(String(index+1),columns[0],y+5);
    doc.text(String(item.size || "—"),columns[1],y+5);
    const name = String(item.name || item.materialName || "");
    doc.text(doc.splitTextToSize(name,76)[0],columns[2],y+5);
    doc.text(qty,columns[3],y+5);
    y += 8;
  });
  if (!sorted.length) { doc.setTextColor(100); doc.text("No materials added.",margin,y+8); }
  const pages = doc.getNumberOfPages();
  for(let p=1;p<=pages;p++){ doc.setPage(p); doc.setFontSize(8); doc.setTextColor(120); doc.text(`e write  •  ${p}/${pages}`,pageW-margin,290,{align:"right"}); }
  if (action==="print") { window.open(doc.output("bloburl"),"_blank"); }
  else if (action==="share") {
    const blob=doc.output("blob"); const file=new File([blob],`${work.name.replace(/\s+/g,"-")}-material-note.pdf`,{type:"application/pdf"});
    if(navigator.canShare?.({files:[file]})) navigator.share({files:[file],title:`${work.name} Material Note`});
    else doc.save(`${work.name.replace(/\s+/g,"-")}-material-note.pdf`);
  } else doc.save(`${work.name.replace(/\s+/g,"-")}-material-note.pdf`);
}
