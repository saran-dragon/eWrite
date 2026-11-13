import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutDashboard, NotebookPen, Package, ShoppingCart, Settings, Plus, Search, Download,
  Eye, Pencil, Trash2, ArrowLeft, Zap, Droplets, Menu, X, Upload, FileDown, Printer,
  Share2, CheckCircle2, Circle, Boxes, Filter, RotateCcw
} from "lucide-react";
import { WORKS, CATALOGUE, DEFAULT_UNITS } from "./data/catalogue";
import { read, write, exportBackup, importBackup } from "./utils/storage";
import { sortItems } from "./utils/sorting";
import { makeNotePdf } from "./utils/pdf";

const emptyForm = { name:"", materialType:"", size:"", unit:"Nos", quantity:"", remarks:"" };
const initialNotes = () => Object.fromEntries(WORKS.map(w=>[w.id,[]]));
const initialPurchases = () => Object.fromEntries(WORKS.map(w=>[w.id,[]]));
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;

export default function App() {
  const [page,setPage] = useState("dashboard");
  const [activeWork,setActiveWork] = useState(WORKS[0].id);
  const [notes,setNotes] = useState(()=>read("notes",initialNotes()));
  const [custom,setCustom] = useState(()=>read("custom",Object.fromEntries(WORKS.map(w=>[w.id,[]]))));
  const [purchases,setPurchases] = useState(()=>read("purchases",initialPurchases()));
  const [form,setForm] = useState(emptyForm);
  const [editing,setEditing] = useState(null);
  const [search,setSearch] = useState("");
  const [typeFilter,setTypeFilter] = useState("");
  const [sizeFilter,setSizeFilter] = useState("");
  const [modal,setModal] = useState(false);
  const [mobileNav,setMobileNav] = useState(false);
  const [purchaseForm,setPurchaseForm] = useState({name:"",size:"",unit:"Nos",required:"",purchased:"0",type:""});
  const [customMode,setCustomMode] = useState(false);
  const [saveCustom,setSaveCustom] = useState(true);
  const importRef = useRef(null);
  useEffect(()=>{write("notes",notes);},[notes]);
  useEffect(()=>{write("custom",custom);},[custom]);
  useEffect(()=>{write("purchases",purchases);},[purchases]);

  const work = WORKS.find(w=>w.id===activeWork);
  const catalogue = [...(CATALOGUE[activeWork]||[]),...(custom[activeWork]||[])];
  const currentNotes = notes[activeWork]||[];
  const currentPurchases = purchases[activeWork]||[];
  const types = [...new Set(catalogue.flatMap(m=>m.types||[]))];
  const filtered = useMemo(()=>sortItems(currentNotes).filter(m=>
    `${m.name} ${m.materialType} ${m.size}`.toLowerCase().includes(search.toLowerCase()) &&
    (!typeFilter || m.materialType===typeFilter) && (!sizeFilter || m.size===sizeFilter)
  ),[currentNotes,search,typeFilter]);
  const updateNotes = fn => setNotes(prev=>({...prev,[activeWork]:fn(prev[activeWork]||[])}));
  const updatePurchases = fn => setPurchases(prev=>({...prev,[activeWork]:fn(prev[activeWork]||[])}));
  const openWork = id => { setActiveWork(id); setSearch(""); setTypeFilter(""); setSizeFilter(""); setPage("workspace"); };
  const startAdd = () => { setEditing(null); setForm(emptyForm); setCustomMode(false); setSaveCustom(true); setModal(true); };
  const startEdit = item => { setEditing(item.id); setForm({...item,quantity:String(item.quantity)}); setCustomMode(!(catalogue.some(m=>m.name===item.name))); setSaveCustom(false); setModal(true); };
  const selectedMaterial = catalogue.find(m=>m.name===form.name);
  const availableTypes = selectedMaterial?.types || [];
  const availableSizes = selectedMaterial?.sizes || [];
  const saveMaterial = e => {
    e.preventDefault();
    if(!form.name.trim() || !form.quantity || Number(form.quantity)<0) return alert("Enter a material name and valid quantity.");
    const item={...form,id:editing||uid(),quantity:Number(form.quantity),name:form.name.trim(),materialType:form.materialType||"Standard",size:form.size||"—",unit:form.unit||"Nos"};
    updateNotes(prev=>editing?prev.map(x=>x.id===editing?item:x):[...prev,item]);
    if(customMode && saveCustom && !catalogue.some(m=>m.name.toLowerCase()===item.name.toLowerCase())) {
      const entry={id:uid(),name:item.name,types:[item.materialType],sizes:item.size==="—"?[]:[item.size],unit:item.unit};
      setCustom(prev=>({...prev,[activeWork]:[...(prev[activeWork]||[]),entry]}));
    }
    setModal(false);
  };
  const deleteMaterial = id => { if(confirm("Delete this material entry?")) updateNotes(prev=>prev.filter(x=>x.id!==id)); };
  const addPurchase = e => {
    e.preventDefault();
    if(!purchaseForm.name.trim() || !purchaseForm.required || Number(purchaseForm.required)<0) return alert("Enter material and required quantity.");
    updatePurchases(prev=>[...prev,{...purchaseForm,id:uid(),required:Number(purchaseForm.required),purchased:Number(purchaseForm.purchased||0)}]);
    setPurchaseForm({name:"",size:"",unit:"Nos",required:"",purchased:"0",type:""});
  };
  const updatePurchase = (id,patch) => updatePurchases(prev=>prev.map(x=>x.id===id?{...x,...patch}:x));
  const removePurchase = id => { if(confirm("Delete purchase item?")) updatePurchases(prev=>prev.filter(x=>x.id!==id)); };
  const go = p => {setPage(p);setMobileNav(false);};
  const nav = [
    ["dashboard","Dashboard",LayoutDashboard],["workspace","Material Notes",NotebookPen],
    ["catalogue","Material Catalogue",Package],["shop","Shop Purchase",ShoppingCart],["settings","Settings",Settings]
  ];
  const title = page==="dashboard"?"Dashboard":page==="workspace"?work.name:page==="catalogue"?"Material Catalogue":page==="shop"?"Shop Purchase":"Settings";

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav?"show":""}`}>
      <div className="brand"><div className="brand-mark"><Zap size={22}/></div><div><b>e write</b><small>Electrical & Plumbing</small></div><button className="mobile-close" onClick={()=>setMobileNav(false)}><X/></button></div>
      <div className="nav-label">WORKSPACE</div>
      {nav.map(([id,label,Icon])=><button key={id} className={`nav-item ${page===id?"active":""}`} onClick={()=>go(id)}><Icon size={18}/><span>{label}</span></button>)}
      <div className="side-note"><div className="side-note-icon"><Boxes size={18}/></div><b>Work-wise management</b><p>Each work keeps its own materials, notes and purchase list.</p></div>
      <div className="sidebar-foot">e write · Version 1.0</div>
    </aside>
    {mobileNav&&<div className="scrim" onClick={()=>setMobileNav(false)}/>}
    <main className="main">
      <header className="topbar"><button className="menu-btn" onClick={()=>setMobileNav(true)}><Menu/></button><div><span className="eyebrow">ELECTRICAL & PLUMBING MATERIAL MANAGER</span><h1>{title}</h1></div><div className="top-actions"><span className="storage-pill"><span/> Saved on this device</span></div></header>
      {page==="dashboard"&&<Dashboard notes={notes} purchases={purchases} openWork={openWork} setPage={go}/>}
      {page==="workspace"&&<section className="content">
        <div className="backline"><button className="text-btn" onClick={()=>go("dashboard")}><ArrowLeft size={16}/> All works</button><span className={`category-tag ${work.category.toLowerCase()}`}>{work.category==="Electrical"?<Zap size={13}/>:<Droplets size={13}/>} {work.category}</span></div>
        <div className="section-head"><div><h2>{work.name}</h2><p>{work.description}. Manage this work's material note independently.</p></div><button className="btn primary" onClick={startAdd}><Plus size={17}/> Add material</button></div>
        <div className="stats-row"><div className="stat"><span>Catalogue materials</span><b>{catalogue.length}</b></div><div className="stat"><span>Note entries</span><b>{currentNotes.length}</b></div><div className="stat"><span>Purchase items</span><b>{currentPurchases.length}</b></div></div>
        <div className="toolbar"><div className="searchbox"><Search size={17}/><input placeholder="Search material, type or size..." value={search} onChange={e=>setSearch(e.target.value)}/></div><select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}><option value="">All types</option>{[...new Set(currentNotes.map(x=>x.materialType))].map(x=><option key={x}>{x}</option>)}</select><select value={sizeFilter} onChange={e=>setSizeFilter(e.target.value)}><option value="">All sizes</option>{[...new Set(currentNotes.map(x=>x.size))].map(x=><option key={x}>{x}</option>)}</select><button className="btn outline" onClick={()=>makeNotePdf(work,currentNotes,"save")}><Download size={16}/> Download PDF</button><button className="btn soft" onClick={()=>makeNotePdf(work,currentNotes,"print")}><Printer size={16}/> Print</button></div>
        <MaterialTable items={filtered} onEdit={startEdit} onDelete={deleteMaterial}/>
        <div className="table-foot"><span>{filtered.length} entries shown</span><button className="text-btn" onClick={()=>{setSearch("");setTypeFilter("");setSizeFilter("");}}><RotateCcw size={14}/> Clear filters</button></div>
      </section>}
      {page==="catalogue"&&<section className="content"><div className="section-head"><div><h2>Material Catalogue</h2><p>Browse default and custom dropdown materials, separated by work.</p></div></div><div className="work-grid">{WORKS.map(w=><div className="catalogue-card" key={w.id}><div className="catalogue-card-head"><div className={`work-icon ${w.category.toLowerCase()}`}>{w.category==="Electrical"?<Zap/>:<Droplets/>}</div><div><b>{w.name}</b><small>{(CATALOGUE[w.id]||[]).length+(custom[w.id]||[]).length} catalogue materials</small></div></div><div className="catalogue-list">{[...(CATALOGUE[w.id]||[]),...(custom[w.id]||[])].map(m=><div key={m.id}><span>{m.name}</span><small>{(m.types||[]).join(", ")}</small></div>)}</div><button className="text-btn" onClick={()=>openWork(w.id)}>Open material notes <ArrowLeft className="rotate" size={14}/></button></div>)}</div></section>}
      {page==="shop"&&<ShopPage works={WORKS} purchases={purchases} activeWork={activeWork} setActiveWork={setActiveWork} current={currentPurchases} add={addPurchase} form={purchaseForm} setForm={setPurchaseForm} update={updatePurchase} remove={removePurchase} />}
      {page==="settings"&&<section className="content"><div className="section-head"><div><h2>Settings & Backup</h2><p>Export or restore your e write data stored in this browser.</p></div></div><div className="settings-grid"><div className="setting-card"><div className="setting-icon"><FileDown/></div><h3>Export backup</h3><p>Download your custom materials, material notes and shop purchase lists as a JSON backup.</p><button className="btn primary" onClick={exportBackup}><Download size={16}/> Export backup</button></div><div className="setting-card"><div className="setting-icon"><Upload/></div><h3>Restore backup</h3><p>Restore a previously exported e write JSON backup on this device. Existing saved data with matching keys will be replaced.</p><input ref={importRef} type="file" accept=".json,application/json" hidden onChange={e=>e.target.files[0]&&importBackup(e.target.files[0],()=>location.reload())}/><button className="btn outline" onClick={()=>importRef.current.click()}><Upload size={16}/> Choose backup file</button></div><div className="setting-card warning"><h3>About local storage</h3><p>Your data is saved only in this browser and device. It does not sync to other devices. Clearing browser site data may delete your saved notes. Export backups regularly.</p></div></div></section>}
    </main>
    {modal&&<div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setModal(false)}><form className="modal" onSubmit={saveMaterial}><div className="modal-head"><div><span className="eyebrow">MATERIAL NOTE · {work.name.toUpperCase()}</span><h2>{editing?"Edit material":"Add material"}</h2></div><button type="button" className="icon-btn" onClick={()=>setModal(false)}><X/></button></div>
      <div className="form-grid"><label className="full">Material name<select value={catalogue.some(m=>m.name===form.name)?form.name:(customMode?"__custom":form.name)} onChange={e=>{if(e.target.value==="__custom"){setCustomMode(true);setSaveCustom(true);setForm({...form,name:"",materialType:"",size:""});}else{const m=catalogue.find(x=>x.name===e.target.value);setCustomMode(false);setForm({...form,name:m.name,materialType:m.types?.[0]||"Standard",size:m.sizes?.[0]||"",unit:m.unit||"Nos"});}}}><option value="">Select material</option>{catalogue.map(m=><option key={m.id} value={m.name}>{m.name}</option>)}<option value="__custom">+ Enter a new material</option></select></label>
      {(customMode||(!selectedMaterial&&form.name))&&<label className="full">Custom material name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Enter material name"/></label>}
      <label>Material type{availableTypes.length&&!customMode?<select value={form.materialType} onChange={e=>setForm({...form,materialType:e.target.value})}>{availableTypes.map(t=><option key={t}>{t}</option>)}</select>:<input value={form.materialType} onChange={e=>setForm({...form,materialType:e.target.value})} placeholder="e.g. Standard"/>}</label>
      <label>Size{availableSizes.length&&!customMode?<select value={form.size} onChange={e=>setForm({...form,size:e.target.value})}>{availableSizes.map(s=><option key={s}>{s}</option>)}</select>:<input value={form.size} onChange={e=>setForm({...form,size:e.target.value})} placeholder='e.g. ¾" or 20mm'/>}</label>
      <label>Unit<select value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})}>{DEFAULT_UNITS.map(u=><option key={u}>{u}</option>)}</select></label>
      <label>Quantity<input required type="number" min="0" step="any" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} placeholder="Enter quantity"/></label>
      <label className="full">Remarks (optional)<input value={form.remarks} onChange={e=>setForm({...form,remarks:e.target.value})} placeholder="Additional details"/></label>
      {customMode&&<label className="checkline full"><input type="checkbox" checked={saveCustom} onChange={e=>setSaveCustom(e.target.checked)} id="save-custom"/> Save to this work's catalogue</label>}
      </div><div className="modal-actions"><button type="button" className="btn outline" onClick={()=>setModal(false)}>Cancel</button><button className="btn primary" type="submit"><CheckCircle2 size={16}/> Save material</button></div>
    </form></div>}
  </div>;
}

function Dashboard({notes,purchases,openWork,setPage}) {
  const totalNotes=Object.values(notes).reduce((n,a)=>n+a.length,0);
  const totalPurchases=Object.values(purchases).reduce((n,a)=>n+a.length,0);
  return <section className="content">
    <div className="welcome"><div><span className="eyebrow light">WELCOME TO E WRITE</span><h2>Material management, made simple.</h2><p>Manage electrical and plumbing material notes, catalogues and shop purchases in one place.</p></div><div className="welcome-art"><div className="art-circle"><Zap size={38}/><Droplets size={34}/></div></div></div>
    <div className="overview-grid"><div className="overview-card"><span>Work categories</span><b>05</b><small>Independent workspaces</small></div><div className="overview-card"><span>Material note entries</span><b>{totalNotes}</b><small>Across all work categories</small></div><div className="overview-card"><span>Shop purchase items</span><b>{totalPurchases}</b><small>Across all work categories</small></div></div>
    <div className="section-title"><div><h2>Work categories</h2><p>Select a work to manage its material notes.</p></div><button className="text-btn" onClick={()=>setPage("catalogue")}>View catalogues <ArrowLeft className="rotate" size={14}/></button></div>
    <div className="work-grid">{WORKS.map((w,i)=><button className="work-card" key={w.id} onClick={()=>openWork(w.id)}><div className={`work-icon ${w.category.toLowerCase()}`}>{w.category==="Electrical"?<Zap size={21}/>:<Droplets size={21}/>}</div><div className="work-card-copy"><b>{w.name}</b><span>{w.description}</span></div><div className="work-card-foot"><span>{notes[w.id]?.length||0} note entries</span><span className="arrow-circle"><ArrowLeft className="rotate" size={15}/></span></div></button>)}</div>
    <div className="quick-row"><div className="quick-card"><div className="quick-icon"><ShoppingCart/></div><div><b>Shop Purchase</b><p>Track required, purchased and pending materials by work.</p></div><button className="btn outline" onClick={()=>setPage("shop")}>Open shop purchase</button></div><div className="quick-card"><div className="quick-icon"><Package/></div><div><b>Material Catalogue</b><p>Browse the default and custom material dropdown lists.</p></div><button className="btn outline" onClick={()=>setPage("catalogue")}>View catalogue</button></div></div>
  </section>;
}
function MaterialTable({items,onEdit,onDelete}) {
  return <div className="table-wrap"><table><thead><tr><th>S.No</th><th>Size</th><th>Material</th><th>Type</th><th>Quantity</th><th>Actions</th></tr></thead><tbody>{items.length?items.map((m,i)=><tr key={m.id}><td>{i+1}</td><td><span className="size-chip">{m.size||"—"}</span></td><td className="material-name">{m.name}</td><td>{m.materialType}</td><td><b>{m.quantity}</b> <span className="muted">{m.unit}</span></td><td><div className="row-actions"><button title="Edit" onClick={()=>onEdit(m)}><Pencil size={15}/></button><button title="Delete" className="danger" onClick={()=>onDelete(m.id)}><Trash2 size={15}/></button></div></td></tr>):<tr><td colSpan="6"><div className="empty"><Package size={30}/><b>No materials added yet</b><span>Add materials to create this work's note.</span></div></td></tr>}</tbody></table></div>;
}
function ShopPage({works,purchases,activeWork,setActiveWork,current,add,form,setForm,update,remove}) {
  const w=works.find(x=>x.id===activeWork);
  return <section className="content"><div className="section-head"><div><h2>Shop Purchase</h2><p>Manage purchase requirements independently for each work.</p></div></div><div className="shop-select"><label>Select work category<select value={activeWork} onChange={e=>setActiveWork(e.target.value)}>{works.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label><span className="category-tag">{w.name}</span></div>
    <form className="purchase-form" onSubmit={add}><h3><Plus size={17}/> Add purchase material</h3><div className="purchase-fields"><label>Material<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Material name" required/></label><label>Type<input value={form.type} onChange={e=>setForm({...form,type:e.target.value})} placeholder="Type"/></label><label>Size<input value={form.size} onChange={e=>setForm({...form,size:e.target.value})} placeholder='e.g. ¾"'/></label><label>Unit<select value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})}>{DEFAULT_UNITS.map(u=><option key={u}>{u}</option>)}</select></label><label>Required<input type="number" min="0" step="any" value={form.required} onChange={e=>setForm({...form,required:e.target.value})} required/></label><label>Purchased<input type="number" min="0" step="any" value={form.purchased} onChange={e=>setForm({...form,purchased:e.target.value})}/></label><button className="btn primary"><Plus size={16}/> Add</button></div></form>
    <div className="toolbar"><div><h3 className="inline-title">{w.name} · Purchase list</h3><span className="muted"> {current.length} items</span></div><button className="btn outline" onClick={()=>makeNotePdf(w,current.map(x=>({...x,name:x.name,quantity:x.required,unit:x.unit})),"save")}><Download size={16}/> Purchase PDF</button></div>
    <div className="table-wrap"><table><thead><tr><th>S.No</th><th>Size</th><th>Material</th><th>Required</th><th>Purchased</th><th>Pending</th><th>Status</th><th></th></tr></thead><tbody>{current.length?sortItems(current).map((x,i)=>{const pending=Math.max(0,Number(x.required)-Number(x.purchased));return <tr key={x.id}><td>{i+1}</td><td><span className="size-chip">{x.size||"—"}</span></td><td className="material-name">{x.name}</td><td>{x.required} {x.unit}</td><td><input className="qty-edit" type="number" min="0" step="any" value={x.purchased} onChange={e=>update(x.id,{purchased:Number(e.target.value)})}/></td><td><b>{pending}</b> {x.unit}</td><td><span className={`status ${pending===0?"done":"pending"}`}>{pending===0?"Purchased":"Pending"}</span></td><td><button className="icon-btn danger" onClick={()=>remove(x.id)}><Trash2 size={15}/></button></td></tr>}) : <tr><td colSpan="8"><div className="empty"><ShoppingCart size={30}/><b>No purchase items</b><span>Add materials required from the shop.</span></div></td></tr>}</tbody></table></div>
  </section>;
}
