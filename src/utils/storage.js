const PREFIX = "ewrite:v1:";
export function read(key, fallback) {
  try { const value = localStorage.getItem(PREFIX + key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
}
export function write(key, value) {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); return true; }
  catch { alert("Could not save data. Browser storage may be full."); return false; }
}
export function exportBackup() {
  const data = {};
  for (let i=0; i<localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(PREFIX)) data[key.slice(PREFIX.length)] = JSON.parse(localStorage.getItem(key));
  }
  const blob = new Blob([JSON.stringify({ app:"e write", version:1, exportedAt:new Date().toISOString(), data }, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob); const a = document.createElement("a");
  a.href=url; a.download="e-write-backup.json"; a.click(); URL.revokeObjectURL(url);
}
export function importBackup(file, done) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (parsed.app !== "e write" || !parsed.data) throw new Error("Invalid backup");
      Object.entries(parsed.data).forEach(([k,v]) => write(k,v));
      done();
    } catch { alert("This backup file is not valid."); }
  };
  reader.readAsText(file);
}
