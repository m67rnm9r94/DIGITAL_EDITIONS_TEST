const TEI_NS = "http://www.tei-c.org/ns/1.0";
const EATS_NS = "https://example.org/eats";

const recordsRoot = document.getElementById("recordsRoot");
const personFilter = document.getElementById("personFilter");
const placeFilter = document.getElementById("placeFilter");
const dateFilter = document.getElementById("dateFilter");

const state = {
  entities: new Map(),
  records: [],
};

async function getXml(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load ${path}: ${response.status}`);
  const text = await response.text();
  return new DOMParser().parseFromString(text, "application/xml");
}

function getPreferredName(entityNode) {
  const nameNodes = [...entityNode.getElementsByTagNameNS(EATS_NS, "name")];
  return (
    nameNodes.find((n) => n.getAttribute("preferred") === "true")?.textContent?.trim() ||
    nameNodes[0]?.textContent?.trim() ||
    "Unnamed entity"
  );
}

function loadEntities(eatsDoc) {
  const entities = [...eatsDoc.getElementsByTagNameNS(EATS_NS, "entity")];
  entities.forEach((entity) => {
    const id = entity.getAttribute("xml:id") || "";
    const type = entity.getElementsByTagNameNS(EATS_NS, "type")[0]?.textContent?.trim();
    const label = getPreferredName(entity);
    state.entities.set(id, { id, type, label });
  });
}

function fillFilterOptions() {
  const people = [...state.entities.values()].filter((e) => e.type === "person");
  const places = [...state.entities.values()].filter((e) => e.type === "place");

  for (const p of people) {
    personFilter.add(new Option(p.label, p.id));
  }
  for (const p of places) {
    placeFilter.add(new Option(p.label, p.id));
  }
}

function transformRecords(teiDoc, xsltDoc) {
  const proc = new XSLTProcessor();
  proc.importStylesheet(xsltDoc);
  const fragment = proc.transformToFragment(teiDoc, document);
  recordsRoot.textContent = "";
  recordsRoot.appendChild(fragment);

  state.records = [...recordsRoot.querySelectorAll(".record")].map((el) => {
    const mentions = [...el.querySelectorAll(".mention")].map((m) => m.dataset.ref);
    return {
      el,
      when: el.dataset.when || "",
      place: el.dataset.place || "",
      mentions,
    };
  });

  annotateMentions();
}

function annotateMentions() {
  const mentionNodes = [...recordsRoot.querySelectorAll(".mention")];
  mentionNodes.forEach((node) => {
    const ref = node.dataset.ref;
    const entity = state.entities.get(ref);
    if (entity) node.title = `${entity.type}: ${entity.label}`;
  });
}

function applyFilters() {
  const person = personFilter.value;
  const place = placeFilter.value;
  const date = dateFilter.value.trim();

  for (const record of state.records) {
    const personMatch = !person || record.mentions.includes(person);
    const placeMatch = !place || record.place === place;
    const dateMatch = !date || record.when.includes(date);

    record.el.style.display = personMatch && placeMatch && dateMatch ? "block" : "none";
  }
}

async function init() {
  try {
    const [teiDoc, eatsDoc, xsltDoc] = await Promise.all([
      getXml("data/records.xml"),
      getXml("data/eats.xml"),
      getXml("xslt/tei-to-html.xsl"),
    ]);

    if (teiDoc.querySelector("parsererror") || eatsDoc.querySelector("parsererror")) {
      throw new Error("XML parse error in TEI or EATS data file.");
    }

    loadEntities(eatsDoc);
    fillFilterOptions();
    transformRecords(teiDoc, xsltDoc);

    personFilter.addEventListener("change", applyFilters);
    placeFilter.addEventListener("change", applyFilters);
    dateFilter.addEventListener("input", applyFilters);
  } catch (error) {
    recordsRoot.textContent = `Error loading edition data: ${error.message}`;
  }
}

init();
