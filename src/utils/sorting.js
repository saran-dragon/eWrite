function sizeValue(value="") {
  const s = String(value).trim();
  const match = s.match(/^([\d.]+)\s*(½|¾|¼|⅛)?/);
  if (!match) return Number.MAX_SAFE_INTEGER;
  let n = Number(match[1]);
  if (match[2] === "½") n += .5;
  if (match[2] === "¾") n += .75;
  if (match[2] === "¼") n += .25;
  if (match[2] === "⅛") n += .125;
  return n;
}
export function sortItems(items) {
  return [...items].sort((a,b) =>
    (a.materialType || a.name || "").localeCompare(b.materialType || b.name || "") ||
    sizeValue(a.size) - sizeValue(b.size) ||
    (a.name || "").localeCompare(b.name || "")
  );
}
