import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { seedPatients } from "./src/seed-patients.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const host = "127.0.0.1";
const port = Number(process.env.PORT || 5174);
const dataDir = path.join(root, ".data");
const entriesFile = path.join(dataDir, "entries.json");
const configFile = path.join(dataDir, "config.json");
const patientsFile = path.join(dataDir, "patients.json");
const ordersFile = path.join(dataDir, "orders.json");
const orderStatusesFile = path.join(dataDir, "order-statuses.json");
const clinicalRecordsFile = path.join(dataDir, "clinical-records.json");
const sseClients = new Map();
const presence = new Map();
const defaultDateKey = dateToKey(new Date());
let entries = await loadEntries();
let config = await loadConfig();
let patients = await loadPatients();
let orders = await loadOrders();
let orderStatuses = await loadOrderStatuses();
let clinicalRecords = await loadClinicalRecords();

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function resolveAsset(rawUrl) {
  const url = new URL(rawUrl || "/", "http://localhost");
  const pathname = decodeURIComponent(url.pathname);
  const requested = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.join(root, requested);
  if (!filePath.startsWith(root)) return path.join(root, "index.html");
  if (existsSync(filePath) && statSync(filePath).isFile()) return filePath;
  return path.join(root, pathname.startsWith("/app") ? "app.html" : "index.html");
}

async function loadEntries() {
  try {
    const body = await readFile(entriesFile, "utf8");
    const parsed = JSON.parse(body);
    if (!Array.isArray(parsed)) return [];
    const refreshed = refreshSeedEntryDates(parsed);
    if (JSON.stringify(refreshed) !== JSON.stringify(parsed)) {
      await writeFile(entriesFile, JSON.stringify(refreshed, null, 2));
    }
    return refreshed;
  } catch {
    return [];
  }
}

async function loadConfig() {
  try {
    const body = await readFile(configFile, "utf8");
    const parsed = JSON.parse(body);
    return {
      wardLocations: Array.isArray(parsed.wardLocations) ? parsed.wardLocations : [],
      patientWards: parsed.patientWards && typeof parsed.patientWards === "object" ? parsed.patientWards : {},
      patientStatuses: parsed.patientStatuses && typeof parsed.patientStatuses === "object" ? parsed.patientStatuses : {}
    };
  } catch {
    return { wardLocations: [], patientWards: {}, patientStatuses: {} };
  }
}

async function loadPatients() {
  try {
    const body = await readFile(patientsFile, "utf8");
    const parsed = JSON.parse(body);
    if (Array.isArray(parsed) && parsed.length) {
      const refreshed = refreshSeedPatientDates(parsed);
      if (JSON.stringify(refreshed) !== JSON.stringify(parsed)) {
        await writeFile(patientsFile, JSON.stringify(refreshed, null, 2));
      }
      return refreshed;
    }
  } catch {
    // Seed demo patients when the local sync store is absent or not initialized yet.
  }
  await mkdir(dataDir, { recursive: true });
  await writeFile(patientsFile, JSON.stringify(seedPatients, null, 2));
  return [...seedPatients];
}

async function loadOrders() {
  try {
    const body = await readFile(ordersFile, "utf8");
    const parsed = JSON.parse(body);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function loadOrderStatuses() {
  try {
    const body = await readFile(orderStatusesFile, "utf8");
    const parsed = JSON.parse(body);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function loadClinicalRecords() {
  try {
    const body = await readFile(clinicalRecordsFile, "utf8");
    const parsed = JSON.parse(body);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function persistEntries() {
  await mkdir(dataDir, { recursive: true });
  await writeFile(entriesFile, JSON.stringify(entries, null, 2));
}

async function persistPatients() {
  await mkdir(dataDir, { recursive: true });
  await writeFile(patientsFile, JSON.stringify(patients, null, 2));
}

async function persistOrders() {
  await mkdir(dataDir, { recursive: true });
  await writeFile(ordersFile, JSON.stringify(orders, null, 2));
}

async function persistOrderStatuses() {
  await mkdir(dataDir, { recursive: true });
  await writeFile(orderStatusesFile, JSON.stringify(orderStatuses, null, 2));
}

async function persistClinicalRecords() {
  await mkdir(dataDir, { recursive: true });
  await writeFile(clinicalRecordsFile, JSON.stringify(clinicalRecords, null, 2));
}

async function persistConfig() {
  await mkdir(dataDir, { recursive: true });
  await writeFile(configFile, JSON.stringify(config, null, 2));
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function entryDateKey(entry) {
  return entry.dateKey || defaultDateKey;
}

function dateToKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function refreshSeedPatientDates(patientList) {
  return patientList.map((patient) => {
    const seedPatient = seedPatients.find((item) => item.id === patient.id && item.chartNo === patient.chartNo);
    if (!seedPatient) return patient;
    return {
      ...patient,
      date: seedPatient.date,
      admitDate: seedPatient.admitDate,
      surgeryDate: seedPatient.surgeryDate
    };
  });
}

function refreshSeedEntryDates(entryList) {
  return entryList.map((entry) => {
    if (!isSeedDemoEntry(entry)) return entry;
    return { ...entry, dateKey: defaultDateKey };
  });
}

function isSeedDemoEntry(entry) {
  return (
    ["2026-09-03", "2026-09-09"].includes(entry?.dateKey) &&
    ["p7770", "p2161", "p5947"].includes(entry.patientId) &&
    typeof entry.id === "string" &&
    !entry.id.startsWith("e_")
  );
}

function sameEntry(a, b) {
  return (
    a.patientId === b.patientId &&
    a.rowId === b.rowId &&
    Number(a.hour) === Number(b.hour) &&
    entryDateKey(a) === entryDateKey(b)
  );
}

function upsertEntry(entry) {
  entries = entries.filter((item) => !sameEntry(item, entry));
  entries.push(entry);
}

function deleteEntry(target) {
  entries = entries.filter((item) => !sameEntry(item, target));
}

function upsertPatient(patient) {
  patients = patients.filter((item) => item.id !== patient.id && item.chartNo !== patient.chartNo);
  patients.push(patient);
}

function upsertOrder(order) {
  orders = orders.filter((item) => item.id !== order.id);
  orders.push(order);
}

function deleteOrder(orderId) {
  orders = orders.filter((item) => item.id !== orderId);
  delete orderStatuses[orderId];
}

function upsertClinicalRecord(record) {
  clinicalRecords = clinicalRecords.filter((item) => item.id !== record.id);
  clinicalRecords.push(record);
}

function deleteClinicalRecord(recordId) {
  clinicalRecords = clinicalRecords.filter((item) => item.id !== recordId);
}

function currentUsers() {
  const cutoff = Date.now() - 45_000;
  return Array.from(presence.values())
    .filter((user) => user.lastSeen >= cutoff)
    .map(({ lastSeen, ...user }) => user);
}

function broadcast(type, payload = {}) {
  const data = JSON.stringify({ type, ...payload, realtimeUsers: currentUsers() });
  sseClients.forEach((res) => {
    res.write(`event: ${type}\n`);
    res.write(`data: ${data}\n\n`);
  });
}

function touchPresence(clientId, update = {}) {
  if (!clientId) return;
  const current = presence.get(clientId) || {};
  presence.set(clientId, {
    id: clientId,
    name: update.name || current.name || "스태프",
    role: update.role || current.role || "스태프",
    section: update.section || current.section || "차트",
    lastSeen: Date.now()
  });
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/state") {
    sendJson(res, 200, { entries, config, patients, orders, orderStatuses, clinicalRecords, realtimeUsers: currentUsers() });
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/events") {
    const clientId = url.searchParams.get("clientId") || randomUUID();
    touchPresence(clientId, {
      name: url.searchParams.get("name"),
      role: url.searchParams.get("role"),
      section: url.searchParams.get("section")
    });
    res.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store",
      Connection: "keep-alive"
    });
    res.write(`event: state\n`);
    res.write(`data: ${JSON.stringify({ type: "state", entries, config, patients, orders, orderStatuses, clinicalRecords, realtimeUsers: currentUsers() })}\n\n`);
    sseClients.set(clientId, res);
    broadcast("presence", {});
    req.on("close", () => {
      sseClients.delete(clientId);
      presence.delete(clientId);
      broadcast("presence", {});
    });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/presence") {
    const body = await readJson(req);
    touchPresence(body.clientId, body);
    broadcast("presence", {});
    sendJson(res, 200, { realtimeUsers: currentUsers() });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/entries") {
    const body = await readJson(req);
    if (!body.entry) {
      sendJson(res, 400, { error: "entry is required" });
      return true;
    }
    upsertEntry(body.entry);
    await persistEntries();
    broadcast("entries:upsert", { entry: body.entry, clientId: body.clientId || "" });
    sendJson(res, 200, { ok: true, entry: body.entry });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/patients") {
    const body = await readJson(req);
    if (!body.patient) {
      sendJson(res, 400, { error: "patient is required" });
      return true;
    }
    upsertPatient(body.patient);
    await persistPatients();
    broadcast("patients:upsert", { patient: body.patient, clientId: body.clientId || "" });
    sendJson(res, 200, { ok: true, patient: body.patient });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/orders") {
    const body = await readJson(req);
    if (!body.order) {
      sendJson(res, 400, { error: "order is required" });
      return true;
    }
    upsertOrder(body.order);
    await persistOrders();
    broadcast("orders:upsert", { order: body.order, clientId: body.clientId || "" });
    sendJson(res, 200, { ok: true, order: body.order });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/orders/status") {
    const body = await readJson(req);
    if (!body.orderId) {
      sendJson(res, 400, { error: "orderId is required" });
      return true;
    }
    orderStatuses = {
      ...orderStatuses,
      [body.orderId]: {
        done: Boolean(body.done),
        staff: body.staff || "스태프",
        updatedAt: new Date().toISOString()
      }
    };
    await persistOrderStatuses();
    broadcast("orders:status", { orderId: body.orderId, status: orderStatuses[body.orderId], clientId: body.clientId || "" });
    sendJson(res, 200, { ok: true, orderId: body.orderId, status: orderStatuses[body.orderId] });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/orders/delete") {
    const body = await readJson(req);
    if (!body.orderId) {
      sendJson(res, 400, { error: "orderId is required" });
      return true;
    }
    deleteOrder(body.orderId);
    await persistOrders();
    await persistOrderStatuses();
    broadcast("orders:delete", { orderId: body.orderId, clientId: body.clientId || "" });
    sendJson(res, 200, { ok: true, orderId: body.orderId });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/clinical-records") {
    const body = await readJson(req);
    if (!body.record) {
      sendJson(res, 400, { error: "record is required" });
      return true;
    }
    upsertClinicalRecord(body.record);
    await persistClinicalRecords();
    broadcast("clinical-records:upsert", { record: body.record, clientId: body.clientId || "" });
    sendJson(res, 200, { ok: true, record: body.record });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/clinical-records/delete") {
    const body = await readJson(req);
    if (!body.recordId) {
      sendJson(res, 400, { error: "recordId is required" });
      return true;
    }
    deleteClinicalRecord(body.recordId);
    await persistClinicalRecords();
    broadcast("clinical-records:delete", { recordId: body.recordId, clientId: body.clientId || "" });
    sendJson(res, 200, { ok: true, recordId: body.recordId });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/entries/delete") {
    const body = await readJson(req);
    if (!body.target) {
      sendJson(res, 400, { error: "target is required" });
      return true;
    }
    deleteEntry(body.target);
    await persistEntries();
    broadcast("entries:delete", { target: body.target, clientId: body.clientId || "" });
    sendJson(res, 200, { ok: true });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/entries/batch") {
    const body = await readJson(req);
    const deletes = Array.isArray(body.deletes) ? body.deletes : [];
    const nextEntries = Array.isArray(body.entries) ? body.entries : [];
    deletes.forEach(deleteEntry);
    nextEntries.forEach(upsertEntry);
    await persistEntries();
    broadcast("entries:batch", { deletes, entries: nextEntries, clientId: body.clientId || "" });
    sendJson(res, 200, { ok: true, count: nextEntries.length });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/config") {
    const body = await readJson(req);
    config = {
      wardLocations: Array.isArray(body.config?.wardLocations) ? body.config.wardLocations : config.wardLocations,
      patientWards:
        body.config?.patientWards && typeof body.config.patientWards === "object"
          ? body.config.patientWards
          : config.patientWards,
      patientStatuses:
        body.config?.patientStatuses && typeof body.config.patientStatuses === "object"
          ? body.config.patientStatuses
          : config.patientStatuses
    };
    await persistConfig();
    broadcast("config:update", { config, clientId: body.clientId || "" });
    sendJson(res, 200, { ok: true, config });
    return true;
  }

  return false;
}

setInterval(() => {
  const before = presence.size;
  const cutoff = Date.now() - 45_000;
  presence.forEach((user, clientId) => {
    if (user.lastSeen < cutoff) presence.delete(clientId);
  });
  if (presence.size !== before) broadcast("presence", {});
}, 15_000);

createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${host}:${port}`);
    if (url.pathname.startsWith("/api/") && (await handleApi(req, res, url))) return;

    const filePath = resolveAsset(req.url);
    const ext = path.extname(filePath).toLowerCase();
    const body = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": types[ext] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(body);
  } catch {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("서버 오류가 발생했습니다.");
  }
}).listen(port, host, () => {
  console.log(`VetCrew Staff is running at http://${host}:${port}`);
});
