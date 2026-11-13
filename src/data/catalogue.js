const electricalSizes = ['¾"', '1"', '1¼"'];
const wireSizes = ["0.75 sq.mm", "1.0 sq.mm", "1.5 sq.mm", "2.5 sq.mm", "4 sq.mm", "6 sq.mm"];
const inchSizes = ['½"', '¾"', '1"', '1¼"', '1½"', '2"', '2½"', '3"', '4"'];

const rows = (names, sizes = [], unit = "Nos", types = ["Standard"]) =>
  names.map((name, i) => ({ id: `${name.toLowerCase().replace(/[^a-z0-9]+/g,"-")}-${i}`, name, types, sizes, unit }));

export const WORKS = [
  { id: "ceiling-electric", name: "Ceiling Electric", count: 12, category: "Electrical", description: "Ceiling wiring and accessories" },
  { id: "electric-wall-concealed", name: "Electric Wall Concealed", count: 18, category: "Electrical", description: "Concealed wiring and conduits" },
  { id: "plumbing-wall-concealed", name: "Plumbing Wall Concealed", count: 15, category: "Plumbing", description: "Pipes and concealed fittings" },
  { id: "electric-fitting", name: "Electric Fitting", count: 20, category: "Electrical", description: "Switches, lights and electrical fittings" },
  { id: "plumbing-fitting", name: "Plumbing Fitting", count: 16, category: "Plumbing", description: "Sanitaryware and plumbing fixtures" }
];

export const CATALOGUE = {
  "ceiling-electric": [
    ...rows(["PVC Conduit Pipe"], electricalSizes, "Length", ["Light", "Heavy"]),
    ...rows(["Flexible Conduit Pipe"], ['¾"','1"'], "Length"),
    ...rows(["PVC Bend","PVC Coupler"], electricalSizes),
    ...rows(["Junction Box"], ['¾"','1"','1¼"'], "Nos", ["2-way","3-way","4-way"]),
    ...rows(["Fan Box","Fan Hook","Ceiling Rose","Ceiling Connector"]),
    ...rows(["Electrical Wire"], wireSizes, "Metre", ["Copper"]),
    ...rows(["Insulation Tape"], [], "Roll"),
    ...rows(["Cable Clip"], electricalSizes, "Packet"),
    ...rows(["LED Panel Light"], [], "Nos", ["6W","12W","18W","24W"]),
    ...rows(["LED Downlight"], [], "Nos", ["3W","6W","9W","12W"]),
    ...rows(["Ceiling Light","Exhaust Fan"])
  ],
  "electric-wall-concealed": [
    ...rows(["PVC Conduit Pipe","Heavy PVC Conduit"], electricalSizes, "Length"),
    ...rows(["Flexible Conduit"], ['¾"','1"'], "Length"),
    ...rows(["PVC Bend","PVC Coupler","PVC Tee"], electricalSizes),
    ...rows(["PVC Junction Box"], ['¾"','1"','1¼"'], "Nos", ["2-way","3-way","4-way"]),
    ...rows(["Modular Switch Box"], [], "Nos", ["1M","2M","3M","4M","6M","8M","12M"]),
    ...rows(["Concealed Fan Box","Switch Board Box","Modular Box Cover"]),
    ...rows(["Electrical Wire","Earth Wire"], wireSizes, "Metre"),
    ...rows(["Electrical Cable"], [], "Metre", ["2-core","3-core","4-core"]),
    ...rows(["Saddles / Clamps"], electricalSizes, "Packet"),
    ...rows(["Insulation Tape"], [], "Roll"),
    ...rows(["Binding Wire"], [], "Kg"),
    ...rows(["Wall Plugs"], ["6mm","8mm","10mm"], "Packet"),
    ...rows(["Screws"], [], "Packet"),
    ...rows(["PVC Solvent"], [], "Bottle")
  ],
  "plumbing-wall-concealed": [
    ...rows(["CPVC Pipe"], inchSizes, "Length", ["Standard","Heavy"]),
    ...rows(["UPVC Pipe"], inchSizes, "Length", ["Standard","Pressure"]),
    ...rows(["PVC Pipe"], inchSizes, "Length", ["Standard","Heavy","SWR"]),
    ...rows(["PPR Pipe"], inchSizes, "Length", ["PN10","PN16","PN20"]),
    ...rows(["SWR Pipe"], ['2"','3"','4"'], "Length"),
    ...rows(["Elbow","Tee","Coupler / Socket","Union","End Cap"], inchSizes),
    ...rows(["Reducer"], ['¾" × ½"','1" × ½"','1" × ¾"','1½" × 1"','2" × 1"']),
    ...rows(["Brass Elbow","Brass Tee","Brass Socket"], ['½"','¾"','1"']),
    ...rows(["Wall Mixer Bend"], ['½"','¾"']),
    ...rows(["Shower Arm Elbow"], ['½"']),
    ...rows(["Angle Valve","Stop Valve","Ball Valve"], inchSizes),
    ...rows(["Pipe Clamp"], inchSizes),
    ...rows(["PTFE Tape"], [], "Roll"),
    ...rows(["Solvent Cement"], [], "Bottle", ["CPVC","UPVC","PVC"]),
    ...rows(["Pipe Insulation"], [], "Metre"),
    ...rows(["GI Nipple","GI Socket"], inchSizes)
  ],
  "electric-fitting": [
    ...rows(["Modular Switch"], [], "Nos", ["6A","16A","20A","25A"]),
    ...rows(["One-Way Switch","Two-Way Switch"], [], "Nos", ["6A","16A"]),
    ...rows(["Bell Push Switch","Socket"], [], "Nos", ["6A","16A","20A"]),
    ...rows(["Combined Switch Socket"], [], "Nos", ["6A","16A"]),
    ...rows(["Fan Regulator"], [], "Nos", ["Electronic","Step Type"]),
    ...rows(["Modular Plate","Blank Plate"], [], "Nos", ["1M","2M","3M","4M","6M","8M","12M"]),
    ...rows(["Indicator"], [], "Nos", ["Red","Green"]),
    ...rows(["Door Bell"], [], "Nos", ["Wired","Wireless"]),
    ...rows(["MCB"], [], "Nos", ["6A","10A","16A","20A","32A","40A"]),
    ...rows(["RCCB"], [], "Nos", ["25A","40A","63A"]),
    ...rows(["RCBO"], [], "Nos", ["6A","10A","16A","20A","32A"]),
    ...rows(["Distribution Board"], [], "Nos", ["4-way","6-way","8-way","12-way"]),
    ...rows(["Main Switch"], [], "Nos", ["DP","TPN"]),
    ...rows(["Isolator"], [], "Nos", ["DP","4P"]),
    ...rows(["LED Bulb"], [], "Nos", ["5W","7W","9W","12W","15W"]),
    ...rows(["LED Tube Light"], [], "Nos", ["10W","20W","22W"]),
    ...rows(["Panel Light"], [], "Nos", ["6W","12W","18W","24W"]),
    ...rows(["Ceiling Fan"], [], "Nos", ["900mm","1200mm","1400mm"]),
    ...rows(["Exhaust Fan","Decorative Light","Earthing Accessories"])
  ],
  "plumbing-fitting": [
    ...rows(["Wash Basin"], [], "Nos", ["Wall Hung","Table Top","Pedestal"]),
    ...rows(["Wash Basin Tap"], [], "Nos", ["Pillar","Wall Mounted"]),
    ...rows(["Bib Cock"], inchSizes),
    ...rows(["Angle Valve","Stop Cock"], ['½"','¾"']),
    ...rows(["Wall Mixer"], [], "Nos", ["2-in-1","3-in-1"]),
    ...rows(["Shower"], [], "Nos", ["Overhead","Hand Shower"]),
    ...rows(["Shower Arm"], [], "Nos", ['6"','9"','12"']),
    ...rows(["Health Faucet","Health Faucet Set"]),
    ...rows(["WC / Commode"], [], "Nos", ["Indian","Western"]),
    ...rows(["Flush Tank"], [], "Nos", ["Concealed","Exposed"]),
    ...rows(["Flush Valve","Jet Spray"]),
    ...rows(["Waste Coupling"], ['1¼"','1½"']),
    ...rows(["Bottle Trap"], ['1¼"','1½"']),
    ...rows(["P-Trap","S-Trap"], ['4"']),
    ...rows(["Floor Trap","Floor Grating"], ['2"','3"','4"']),
    ...rows(["Sink Cock"], [], "Nos", ["Wall Mounted","Deck Mounted"]),
    ...rows(["Kitchen Sink"], [], "Nos", ["Single Bowl","Double Bowl"]),
    ...rows(["Sink Waste Pipe","Flexible Connection","PVC Connection Pipe"]),
    ...rows(["Towel Rod","Soap Dish","Toilet Paper Holder","Mirror"])
  ]
};

export const DEFAULT_UNITS = ["Nos", "Length", "Metre", "Feet", "Roll", "Packet", "Kg", "Bottle", "Set", "Pair", "Coil"];
