const STORAGE_KEY = "vetcrew-staff-state-v1";
const CLIENT_ID_KEY = "vetcrew-staff-client-id";
const TUTORIAL_SEEN_KEY = "vetcrew-staff-tutorial-seen";
const now = new Date();
const currentHour = now.getHours();
const currentMinute = now.getMinutes();
const DEFAULT_DATE_KEY = "2026-09-03";
const chartIntervalOptions = [
  [60, "1시간"],
  [30, "30분"],
  [15, "15분"]
];

const rows = [
  { id: "weight", label: "체중", tone: "vital", quick: true, placeholder: "예: 5.5kg" },
  { id: "temp", label: "체온", tone: "vital", quick: true, placeholder: "예: 38.6" },
  { id: "bp", label: "혈압", tone: "vital", quick: true, placeholder: "예: 160" },
  { id: "pulse", label: "심박수/Murmur", tone: "vital", quick: true, placeholder: "예: 180 / G2" },
  { id: "resp", label: "호흡수", tone: "vital", quick: true, placeholder: "예: 24" },
  { id: "vomit", label: "Vomit", tone: "output", quick: true, placeholder: "예: -" },
  { id: "feces", label: "Feces", tone: "output", quick: true, placeholder: "예: 정상(소량)" },
  { id: "urine", label: "Urine", tone: "output", quick: true, placeholder: "예: 정상뇨(혼탁)" },
  { id: "diet", label: "식이 급여 샘플", tone: "feed", quick: true, placeholder: "예: 1/2" },
  { id: "water", label: "수액 처치 샘플", tone: "fluid", quick: true, placeholder: "예: FRI" },
  { id: "cerenia", label: "주사 처치 A", tone: "med", quick: true, placeholder: "예: ✓" },
  { id: "nac", label: "주사 처치 B", tone: "med", quick: false, placeholder: "예: ✓" },
  { id: "meto", label: "주사 처치 C", tone: "med", quick: false, placeholder: "예: ✓" },
  { id: "mero", label: "주사 처치 D", tone: "med", quick: false, placeholder: "예: ✓" },
  { id: "appetite", label: "내복 처치 A", tone: "care", quick: false, placeholder: "예: ✓" },
  { id: "laminase", label: "내복 처치 B", tone: "care", quick: false, placeholder: "예: ✓" },
  { id: "pain", label: "내복 처치 C", tone: "care", quick: false, placeholder: "예: ✓" },
  { id: "urinary", label: "압박배뇨", tone: "care", quick: true, placeholder: "예: ✓" },
  { id: "twitching", label: "**Twitching 확인: Y/N", tone: "check", quick: true, placeholder: "예: N" },
  { id: "guardian", label: "보호자채널전송", tone: "check", quick: true, placeholder: "예: 전송" }
];

const seedPatients = [
  {
    id: "p7770",
    chartNo: "1001",
    name: "샘플A",
    guardian: "보호자A",
    photoUrl: "",
    species: "개",
    breed: "포메라니안",
    age: "14년 8개월",
    sex: "중성화수컷",
    ward: "강아지 ICU-1",
    admitDay: 2,
    weight: "5.5kg",
    cc: "호흡기 모니터링 샘플",
    dx: "입원 경과 관찰",
    doctor: "데모수의사A",
    status: "current",
    importance: "high",
    room: "-",
    date: "2026.09.03",
    admitDate: "2026.09.02",
    surgeryDate: "2026.08.28",
    tags: ["입원 2일차", "강아지 ICU-1", "CPR"]
  },
  {
    id: "p2161",
    chartNo: "1002",
    name: "샘플B",
    guardian: "보호자B",
    photoUrl: "",
    species: "고양이",
    breed: "MIX",
    age: "15년 8개월",
    sex: "중성화암컷",
    ward: "고양이 ICU-1",
    admitDay: 3,
    weight: "3.26kg",
    cc: "식욕 및 활력 확인 샘플",
    dx: "진단 메모 샘플",
    doctor: "데모수의사B",
    status: "current",
    importance: "normal",
    room: "-",
    date: "2026.09.03",
    admitDate: "2026.09.01",
    surgeryDate: "",
    tags: ["입원 3일차", "고양이 ICU-1", "CPR"]
  },
  {
    id: "p5947",
    chartNo: "1003",
    name: "샘플C",
    guardian: "보호자C",
    photoUrl: "",
    species: "고양이",
    breed: "MIX",
    age: "7년 11개월",
    sex: "중성화수컷",
    ward: "고양이 ICU-2",
    admitDay: 3,
    weight: "4.8kg",
    cc: "수술 후 처치 확인 샘플",
    dx: "수술 후 회복 모니터링",
    doctor: "데모수의사C",
    status: "delayed",
    importance: "high",
    room: "-",
    date: "2026.09.03",
    admitDate: "2026.09.01",
    surgeryDate: "2026.09.01",
    tags: ["입원 3일차", "고양이 ICU-2", "CPR"]
  }
];

let patients = [...seedPatients];
const defaultWardLocations = Array.from(new Set(patients.map((patient) => patient.ward)));

const seedEntries = [
  entry("p7770", "weight", 1, "5.5kg", "데모수의사A"),
  entry("p7770", "bp", 3, "140", "데모수의사A"),
  entry("p7770", "resp", 3, "24", "데모수의사A"),
  entry("p7770", "feces", 1, "정상", "데모수의사A"),
  entry("p7770", "urine", 1, "정상뇨", "데모수의사A"),
  entry("p7770", "nac", 5, "✓", "데모수의사A"),
  entry("p7770", "urinary", 1, "✓", "데모수의사A"),
  entry("p7770", "twitching", 1, "N", "데모수의사A"),
  entry("p7770", "twitching", 3, "N", "데모수의사A"),
  entry("p2161", "bp", 3, "130", "데모수의사B"),
  entry("p2161", "resp", 3, "24", "데모수의사B"),
  entry("p2161", "feces", 3, "정상", "데모수의사B"),
  entry("p2161", "diet", 5, "1", "데모수의사B"),
  entry("p2161", "mero", 3, "✓", "데모수의사B"),
  entry("p2161", "appetite", 3, "✓", "데모수의사B"),
  entry("p2161", "twitching", 3, "N", "데모수의사B")
];

const navItems = [
  ["chart", "▤", "차트"],
  ["tasks", "☑", "업무"],
  ["ward", "⌁", "입원실현황"],
  ["more", "⋯", "더보기"]
];

const helpSteps = [
  {
    section: "chart",
    title: "차트",
    text: "환자 목록에서 입원 환자를 찾고, 상세 차트에서 시간대별 기록을 남깁니다.",
    tips: ["검색/필터로 환자를 찾습니다.", "환자 카드를 누르면 상세 차트가 열립니다.", "셀을 누르면 기록 입력, 측정 셀은 길게 눌러 BPM 측정으로 이동합니다."]
  },
  {
    section: "tasks",
    title: "업무",
    text: "현재 할 일, 지연 업무, 오더, 인수인계 노트를 한 화면에서 확인합니다.",
    tips: ["상단 탭에서 지연/현재/예정/완료 업무를 나눠 봅니다.", "오더 생성으로 환자, 시간, 담당자를 지정합니다.", "완료 체크를 누르면 업무가 완료 목록으로 이동합니다."]
  },
  {
    section: "ward",
    title: "입원실현황",
    text: "입원장 위치별 환자 배정과 빈 자리를 빠르게 확인합니다.",
    tips: ["전체/ICU 버튼으로 병동 범위를 바꿉니다.", "입원장 안의 환자를 누르면 해당 환자 차트로 이동합니다.", "더보기의 입원장 설정에서 병동 위치를 추가하거나 정리합니다."]
  },
  {
    section: "more",
    title: "더보기",
    text: "권한 전환, 입원장 설정, 데모 데이터 초기화 같은 관리 기능이 있습니다.",
    tips: ["수의사/테크니션 권한을 전환해 화면 동작을 확인합니다.", "입원장 이름을 추가하고 비어 있는 입원장은 삭제할 수 있습니다.", "데모 데이터 초기화로 샘플 상태를 다시 불러옵니다."]
  }
];

const realtimeUsers = [
  { name: "데모수의사A", role: "수의사", section: "차트" },
  { name: "데모수의사B", role: "수의사", section: "입원실" },
  { name: "데모테크A", role: "테크니션", section: "업무" }
];

const app = document.querySelector("#app");
const state = loadState();
const clientId = loadClientId();
let chartResize = null;
let chartPan = null;
let chartTrackDrag = null;
let bpmTicker = null;
let longPressTimer = null;
let suppressClickUntil = 0;
let realtimeSource = null;
let presenceSyncAt = 0;

applyRouteFromHash();
applyPatientConfig();
render();
hydrateRealtimeState();

function handleRouteChange() {
  applyRouteFromHash();
  save();
  render();
}

window.addEventListener("popstate", handleRouteChange);
window.addEventListener("hashchange", handleRouteChange);
window.addEventListener("pagehide", () => {
  state.quickOpen = false;
  state.entryPanelOpen = false;
  save();
  syncScrollLock();
});

document.addEventListener("click", (event) => {
  if (Date.now() < suppressClickUntil) {
    event.preventDefault();
    return;
  }
  const action = event.target.closest("[data-action]");
  if (!action) return;

  if (action.dataset.action === "clear-field") {
    const field = action.closest(".clearable-field");
    const input = field?.querySelector("input, textarea");
    if (!input) return;
    input.value = "";
    field.classList.remove("has-value");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    input.focus();
    return;
  }

  if (action.dataset.action === "login") {
    state.authed = true;
    save();
    render();
    hydrateRealtimeState();
    return;
  }

  if (action.dataset.action === "logout") {
    state.authed = false;
    closeChartRoute();
    save();
    render();
    return;
  }

  if (action.dataset.action === "select-patient") {
    openChartDetail(action.dataset.id);
    save();
    render();
    return;
  }

  if (action.dataset.action === "chart-back") {
    showChartList();
    save();
    render();
    return;
  }

  if (action.dataset.action === "select-quick-patient") {
    state.patientId = action.dataset.id;
    state.section = "chart";
    save();
    render();
    return;
  }

  if (action.dataset.action === "focus-search") {
    if (state.section !== "chart" || state.chartDetailOpen) {
      state.section = "chart";
      state.chartDetailOpen = false;
      save();
      render();
    }
    requestAnimationFrame(() => document.querySelector("[name='search']")?.focus());
    return;
  }

  if (action.dataset.action === "open-notifications") {
    setSection("tasks");
    save();
    render();
    return;
  }

  if (action.dataset.action === "set-section") {
    state.helpOpen = false;
    setSection(action.dataset.value);
    save();
    render();
    return;
  }

  if (action.dataset.action === "start-help") {
    state.helpOpen = true;
    state.helpStep = 0;
    setSection(helpSteps[0].section);
    save();
    render();
    return;
  }

  if (action.dataset.action === "next-help") {
    const nextStep = Number(state.helpStep || 0) + 1;
    if (nextStep >= helpSteps.length) {
      state.helpOpen = false;
      state.helpStep = 0;
      localStorage.setItem(TUTORIAL_SEEN_KEY, "1");
    } else {
      state.helpStep = nextStep;
      setSection(helpSteps[nextStep].section);
    }
    save();
    render();
    return;
  }

  if (action.dataset.action === "close-help") {
    state.helpOpen = false;
    state.helpStep = 0;
    localStorage.setItem(TUTORIAL_SEEN_KEY, "1");
    save();
    render();
    return;
  }

  if (action.dataset.action === "shift-date") {
    state.chartDate = shiftDateKey(selectedDateKey(), Number(action.dataset.delta || 0));
    state.calendarMonth = monthKeyFromDateKey(state.chartDate);
    state.quickOpen = false;
    save();
    render();
    return;
  }

  if (action.dataset.action === "toggle-calendar") {
    state.calendarOpen = !state.calendarOpen;
    state.calendarMonth = state.calendarMonth || monthKeyFromDateKey(selectedDateKey());
    save();
    render();
    return;
  }

  if (action.dataset.action === "close-calendar") {
    state.calendarOpen = false;
    save();
    render();
    return;
  }

  if (action.dataset.action === "shift-calendar-month") {
    state.calendarMonth = shiftMonthKey(state.calendarMonth || monthKeyFromDateKey(selectedDateKey()), Number(action.dataset.delta || 0));
    save();
    render();
    return;
  }

  if (action.dataset.action === "select-calendar-date") {
    state.chartDate = normalizeDateKey(action.dataset.date);
    state.calendarMonth = monthKeyFromDateKey(state.chartDate);
    state.calendarOpen = false;
    state.quickOpen = false;
    state.entryPanelOpen = false;
    save();
    render();
    return;
  }

  if (action.dataset.action === "select-today") {
    state.chartDate = dateToKey(new Date());
    state.calendarMonth = monthKeyFromDateKey(state.chartDate);
    state.calendarOpen = false;
    state.quickOpen = false;
    state.entryPanelOpen = false;
    save();
    render();
    return;
  }

  if (action.dataset.action === "set-status") {
    state.status = action.dataset.value;
    save();
    render();
    return;
  }

  if (action.dataset.action === "set-filter") {
    state[action.dataset.filter] = action.dataset.value;
    save();
    render();
    return;
  }

  if (action.dataset.action === "set-user-role") {
    state.userRole = action.dataset.value;
    save();
    render();
    return;
  }

  if (action.dataset.action === "set-ward-view") {
    state.wardView = action.dataset.value || "all";
    save();
    render();
    return;
  }

  if (action.dataset.action === "toggle-patient-edit") {
    if (!canManageClinical()) return;
    state.patientEditOpen = !state.patientEditOpen;
    state.patientSaveNotice = "";
    save();
    render();
    requestAnimationFrame(() => document.querySelector("[name='editName']")?.focus());
    return;
  }

  if (action.dataset.action === "toggle-order-form") {
    if (!canManageClinical()) return;
    state.orderFormOpen = !state.orderFormOpen;
    state.orderDraftPatientId = state.patientId;
    state.orderDraftRowId = state.rowId || state.orderDraftRowId || "diet";
    state.orderSaveNotice = "";
    save();
    render();
    requestAnimationFrame(() => document.querySelector("[name='orderTitle']")?.focus());
    return;
  }

  if (action.dataset.action === "open-order-settings") {
    if (!canManageClinical()) return;
    state.section = "tasks";
    state.orderFormOpen = true;
    state.orderDraftPatientId = state.patientId;
    state.orderDraftRowId = state.rowId || state.orderDraftRowId || "diet";
    state.orderSaveNotice = "";
    save();
    render();
    requestAnimationFrame(() => document.querySelector("[name='orderTitle']")?.focus());
    return;
  }

  if (action.dataset.action === "toggle-order-done") {
    const orderId = action.dataset.orderId;
    const current = orderStatus(orderId);
    state.orderStatuses = {
      ...(state.orderStatuses || {}),
      [orderId]: {
        done: !current.done,
        staff: currentPresence().name,
        updatedAt: new Date().toISOString()
      }
    };
    state.orderSaveNotice = !current.done ? "오더 완료 처리" : "오더 미완료로 복귀";
    save();
    syncOrderStatus(orderId, state.orderStatuses[orderId]);
    render();
    return;
  }

  if (action.dataset.action === "delete-order") {
    if (!canManageClinical()) return;
    const orderId = action.dataset.orderId;
    state.orders = (state.orders || []).filter((order) => order.id !== orderId);
    state.orderStatuses = { ...(state.orderStatuses || {}) };
    delete state.orderStatuses[orderId];
    state.orderSaveNotice = "오더 삭제";
    save();
    syncDeleteOrder(orderId);
    render();
    return;
  }

  if (action.dataset.action === "delete-clinical-record") {
    if (!canManageClinical()) return;
    const recordId = action.dataset.recordId;
    state.clinicalRecords = (state.clinicalRecords || []).filter((record) => record.id !== recordId);
    state.clinicalNotice = "기록 삭제";
    save();
    syncDeleteClinicalRecord(recordId);
    render();
    return;
  }

  if (action.dataset.action === "toggle-patient-form") {
    if (!canManageClinical()) return;
    state.patientFormOpen = !state.patientFormOpen;
    state.patientSaveNotice = "";
    save();
    render();
    requestAnimationFrame(() => document.querySelector("[name='newChartNo']")?.focus());
    return;
  }

  if (action.dataset.action === "copy-chart") {
    copyPreviousChart();
    save();
    render();
    return;
  }

  if (action.dataset.action === "set-view") {
    state.view = action.dataset.value;
    if (state.view === "chart") state.quickOpen = false;
    save();
    render();
    return;
  }

  if (action.dataset.action === "open-quick" || action.dataset.action === "open-entry") {
    openChartDetail(state.patientId, { replace: true });
    state.entryPanelOpen = true;
    save();
    render();
    return;
  }

  if (action.dataset.action === "close-quick" || action.dataset.action === "close-entry") {
    state.quickOpen = false;
    state.entryPanelOpen = false;
    save();
    render();
    return;
  }

  if (action.dataset.action === "resize-quick") {
    state.quickSize = clampQuickSize(Number(state.quickSize || 2) + Number(action.dataset.delta || 0));
    save();
    render();
    return;
  }

  if (action.dataset.action === "resize-label") {
    const nextSize = clampLabelSize(Number(state.labelSize || 2) + Number(action.dataset.delta || 0));
    state.labelSize = nextSize;
    state.labelWidth = getLabelSize(nextSize).width;
    save();
    render();
    return;
  }

  if (action.dataset.action === "select-cell") {
    openChartDetail(action.dataset.patientId, { replace: true });
    state.rowId = action.dataset.rowId;
    state.hour = Number(action.dataset.hour);
    state.entryPanelOpen = true;
    save();
    render();
    return;
  }

  if (action.dataset.action === "close-tutorial") {
    state.showTutorial = false;
    localStorage.setItem(TUTORIAL_SEEN_KEY, "1");
    save();
    render();
    return;
  }

  if (action.dataset.action === "discharge-patient") {
    if (!canManageClinical()) return;
    const patientId = action.dataset.patientId || state.patientId;
    state.patientStatuses = { ...(state.patientStatuses || {}), [patientId]: "discharged" };
    applyPatientConfig();
    state.dischargeNotice = "퇴원 처리 완료";
    state.entryPanelOpen = false;
    save();
    syncConfig();
    render();
    return;
  }

  if (action.dataset.action === "restore-patient") {
    if (!canManageClinical()) return;
    const patientId = action.dataset.patientId || state.patientId;
    state.patientStatuses = { ...(state.patientStatuses || {}) };
    delete state.patientStatuses[patientId];
    applyPatientConfig();
    state.dischargeNotice = "입원 상태로 복귀";
    save();
    syncConfig();
    render();
    return;
  }

  if (action.dataset.action === "scroll-top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.querySelector(".phone-app")?.scrollTo?.({ top: 0, behavior: "smooth" });
    return;
  }

  if (action.dataset.action === "append") {
    const input = document.querySelector("[name='value']");
    if (!input) return;
    input.value = `${input.value}${action.dataset.value === "dot" ? "." : action.dataset.value}`;
    syncClearableField(input);
    input.focus();
    return;
  }

  if (action.dataset.action === "entry-preset") {
    const input = document.querySelector(".quick-panel [name='value'], .quick-entry-card [name='value']");
    if (!input) return;
    const value = action.dataset.value || "";
    input.value = input.value ? `${input.value} / ${value}` : value;
    syncClearableField(input);
    input.focus();
    return;
  }

  if (action.dataset.action === "order-preset") {
    const input = document.querySelector("[name='orderTitle']");
    if (!input) return;
    const value = action.dataset.value || "";
    input.value = input.value ? `${input.value} / ${value}` : value;
    syncClearableField(input);
    input.focus();
    return;
  }

  if (action.dataset.action === "clear-cell") {
    const dateKey = selectedDateKey();
    const target = {
      patientId: state.patientId,
      rowId: state.rowId,
      hour: state.hour,
      dateKey
    };
    state.entries = state.entries.filter(
      (item) =>
        !(
          item.patientId === state.patientId &&
          item.rowId === state.rowId &&
          item.hour === state.hour &&
          entryDateKey(item) === dateKey
        )
    );
    save();
    syncDeleteEntry(target);
    render();
    return;
  }

  if (action.dataset.action === "select-quick-row") {
    state.rowId = action.dataset.rowId;
    save();
    render();
    return;
  }

  if (action.dataset.action === "set-bpm-mode") {
    state.bpmMode = action.dataset.value;
    resetBpmMeasure();
    save();
    render();
    return;
  }

  if (action.dataset.action === "tap-bpm") {
    const measure = currentBpmMeasure();
    if (!measure.active) startBpmMeasure();
    state.bpmMeasure.taps += 1;
    finishBpmMeasureIfNeeded();
    save();
    render();
    return;
  }

  if (action.dataset.action === "reset-bpm") {
    resetBpmMeasure();
    save();
    render();
    return;
  }

  if (action.dataset.action === "save-bpm-result") {
    const measure = currentBpmMeasure();
    if (measure.result === null) return;
    saveBpmResult(measure.result);
    resetBpmMeasure();
    save();
    render();
    return;
  }

  if (action.dataset.action === "reset-demo") {
    const fresh = defaultState();
    Object.keys(state).forEach((key) => delete state[key]);
    Object.assign(state, fresh, { authed: true });
    applyPatientConfig();
    syncConfig();
    save();
    syncBatchEntries([], state.entries);
    render();
    return;
  }

  if (action.dataset.action === "remove-ward-location") {
    const ward = action.dataset.value || "";
    if (patients.some((patient) => patient.ward === ward)) {
      state.wardSettingsNotice = `${ward}에 배정된 환자가 있어 삭제할 수 없습니다.`;
      save();
      render();
      return;
    }
    state.wardLocations = wardLocations().filter((item) => item !== ward);
    state.wardSettingsNotice = `${ward} 삭제`;
    applyPatientConfig();
    save();
    syncConfig();
    render();
    return;
  }
});

document.addEventListener("pointerdown", (event) => {
  const chartWrap = event.target.closest(".chart-wrap");
  if (chartWrap && !event.target.closest("[data-resize='label-width']")) {
    chartPan = {
      pointerId: event.pointerId,
      chart: chartWrap,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: chartWrap.scrollLeft,
      scrollTop: chartWrap.scrollTop,
      moved: false
    };
    chartWrap.setPointerCapture?.(event.pointerId);
  }

  const cellTarget = event.target.closest("[data-action='select-cell']");
  if (cellTarget) {
    const measureTarget = cellTarget.matches("[data-measure-row]") ? cellTarget : null;
    longPressTimer = setTimeout(() => {
      if (measureTarget) {
        openMeasureFromChart(measureTarget);
      } else {
        openEntryFromCell(cellTarget);
      }
      longPressTimer = null;
    }, measureTarget ? 520 : 420);
  }

  const measureTarget = event.target.closest("[data-measure-row]");
  if (measureTarget && !cellTarget) {
    longPressTimer = setTimeout(() => {
      openMeasureFromChart(measureTarget);
      longPressTimer = null;
    }, 520);
  }

  const scrollTrack = event.target.closest(".scroll-track");
  if (scrollTrack) {
    event.preventDefault();
    const chart = scrollTrack.closest(".chart-scroll-shell")?.querySelector(".chart-wrap");
    if (!chart) return;
    chartTrackDrag = {
      pointerId: event.pointerId,
      chart,
      track: scrollTrack,
      startX: event.clientX,
      scrollLeft: chart.scrollLeft
    };
    scrollTrack.setPointerCapture?.(event.pointerId);
  }

  const handle = event.target.closest("[data-resize='label-width']");
  if (!handle) return;
  event.preventDefault();
  const chart = handle.closest(".chart-wrap");
  const labelSize = getLabelSize();
  chartResize = {
    pointerId: event.pointerId,
    chart,
    startX: event.clientX,
    startWidth: labelSize.width
  };
  document.body.classList.add("resizing-chart");
  handle.setPointerCapture?.(event.pointerId);
});

document.addEventListener("pointermove", () => {
  if (!chartPan && !chartTrackDrag) clearLongPressTimer();
});

document.addEventListener("pointermove", (event) => {
  if (chartPan && event.pointerId === chartPan.pointerId) {
    const dx = event.clientX - chartPan.startX;
    const dy = event.clientY - chartPan.startY;
    if (chartPan.moved || Math.hypot(dx, dy) > 5) {
      chartPan.moved = true;
      clearLongPressTimer();
      event.preventDefault();
      chartPan.chart.scrollLeft = chartPan.scrollLeft - dx;
      chartPan.chart.scrollTop = chartPan.scrollTop - dy;
      syncChartScrollTrack(chartPan.chart);
    }
    return;
  }

  if (chartTrackDrag && event.pointerId === chartTrackDrag.pointerId) {
    event.preventDefault();
    const maxScroll = chartTrackDrag.chart.scrollWidth - chartTrackDrag.chart.clientWidth;
    const maxTravel = chartTrackDrag.track.clientWidth - chartTrackDrag.track.querySelector("span").clientWidth;
    if (maxScroll > 0 && maxTravel > 0) {
      chartTrackDrag.chart.scrollLeft = chartTrackDrag.scrollLeft + ((event.clientX - chartTrackDrag.startX) / maxTravel) * maxScroll;
      syncChartScrollTrack(chartTrackDrag.chart);
    }
    return;
  }

  if (!chartResize || event.pointerId !== chartResize.pointerId) return;
  const width = clampLabelWidth(chartResize.startWidth + event.clientX - chartResize.startX);
  state.labelWidth = width;
  chartResize.chart?.style.setProperty("--label-width", `${width}px`);
});

document.addEventListener("pointerup", finishChartPan);
document.addEventListener("pointercancel", finishChartPan);
document.addEventListener("pointerup", finishChartResize);
document.addEventListener("pointercancel", finishChartResize);

document.addEventListener("scroll", (event) => {
  if (event.target.matches?.(".chart-wrap")) syncChartScrollTrack(event.target);
}, true);

document.addEventListener("wheel", (event) => {
  const chart = event.target.closest?.(".chart-wrap");
  if (!chart) return;
  const canScrollX = chart.scrollWidth > chart.clientWidth;
  if (!canScrollX || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
  event.preventDefault();
  chart.scrollLeft += event.deltaY;
  syncChartScrollTrack(chart);
}, { passive: false });

document.addEventListener("change", (event) => {
  if (event.target.matches("[name='rowId']")) {
    state.rowId = event.target.value;
    save();
    render();
  }

  if (event.target.matches("[name='hour']")) {
    state.hour = Number(event.target.value);
    save();
    render();
  }

  if (event.target.matches("[name='search']")) {
    state.search = event.target.value;
    save();
    render();
  }

  if (event.target.matches("[name='chartSpecies']")) {
    state.chartSpecies = event.target.value;
    save();
    render();
  }

  if (event.target.matches("[name='chartSort']")) {
    state.chartSort = event.target.value;
    save();
    render();
  }

  if (event.target.matches("[name='chartDoctor']")) {
    state.chartDoctor = event.target.value;
    save();
    render();
  }

  if (event.target.matches("[name='patientStatusFilter']")) {
    state.patientStatusFilter = event.target.value;
    save();
    render();
  }

  if (event.target.matches("[name='patientWard']")) {
    const patientId = event.target.dataset.patientId;
    if (!patientId) return;
    state.patientWards = {
      ...(state.patientWards || {}),
      [patientId]: event.target.value
    };
    state.wardSettingsNotice = "입원장 위치 변경";
    applyPatientConfig();
    save();
    syncConfig();
    render();
  }

  if (event.target.matches("[name='patientChartInterval']")) {
    const patientId = event.target.dataset.patientId;
    if (!patientId || !canManageClinical()) return;
    const interval = chartIntervalForValue(event.target.value);
    const nextPatient = patients.find((patient) => patient.id === patientId);
    if (!nextPatient) return;
    patients = mergePatients(patients, [{ ...nextPatient, chartInterval: interval }]);
    state.patientSaveNotice = `차팅 간격을 ${chartIntervalLabel(interval)}로 변경했습니다.`;
    save();
    syncPatient(patients.find((patient) => patient.id === patientId));
    render();
  }

  if (event.target.matches("[name='orderPatientId']")) {
    state.orderDraftPatientId = event.target.value;
    save();
    render();
    requestAnimationFrame(() => document.querySelector("[name='orderTitle']")?.focus());
  }

  if (event.target.matches("[name='orderRowId']")) {
    state.orderDraftRowId = event.target.value;
    const presets = document.querySelector(".order-presets");
    if (presets) presets.innerHTML = orderPresetButtons(state.orderDraftRowId);
    save();
  }

  if (event.target.matches("[data-calc-field]")) {
    state[event.target.name] = event.target.value;
    save();
    render();
  }
});

document.addEventListener("input", (event) => {
  const clearable = event.target.closest?.(".clearable-field");
  if (clearable && event.target.matches("input, textarea")) {
    syncClearableField(event.target);
  }

  if (event.target.matches("[data-calc-field]")) {
    state[event.target.name] = event.target.value;
    save();
    render();
  }
});

document.addEventListener("focusin", (event) => {
  if (!event.target.matches(".quick-panel textarea[name='value']")) return;
  const panel = event.target.closest(".quick-panel");
  if (panel?.classList.contains("keypad-ready")) panel.classList.add("keypad-open");
});

document.addEventListener("focusout", (event) => {
  if (!event.target.matches(".quick-panel textarea[name='value']")) return;
  const panel = event.target.closest(".quick-panel");
  window.setTimeout(() => {
    if (!panel || panel.contains(document.activeElement)) return;
    panel.classList.remove("keypad-open");
  }, 0);
});

document.addEventListener("submit", (event) => {
  const wardForm = event.target.closest("form[data-form='ward-location']");
  if (wardForm) {
    event.preventDefault();
    const data = new FormData(wardForm);
    const ward = String(data.get("wardLocation") || "").trim();
    if (!ward) return;
    const locations = wardLocations();
    if (locations.includes(ward)) {
      state.wardSettingsNotice = "이미 있는 입원장입니다.";
    } else {
      state.wardLocations = [...locations, ward];
      state.wardSettingsNotice = `${ward} 추가`;
    }
    applyPatientConfig();
    save();
    syncConfig();
    render();
    return;
  }

  const patientForm = event.target.closest("form[data-form='patient']");
  if (patientForm) {
    event.preventDefault();
    if (!canManageClinical()) return;
    const data = new FormData(patientForm);
    const nextPatient = buildPatientFromForm(data);
    if (!nextPatient.ok) {
      state.patientSaveNotice = nextPatient.error;
      save();
      render();
      return;
    }
    patients = mergePatients(patients, [nextPatient.patient]);
    state.patientId = nextPatient.patient.id;
    state.chartSpecies = "all";
    state.chartDoctor = "all";
    state.patientStatusFilter = "active";
    state.patientFormOpen = false;
    state.patientSaveNotice = `#${nextPatient.patient.chartNo} ${nextPatient.patient.name} 등록 완료`;
    applyPatientConfig();
    save();
    syncPatient(nextPatient.patient);
    openChartDetail(nextPatient.patient.id, { replace: true });
    render();
    return;
  }

  const patientEditForm = event.target.closest("form[data-form='patient-edit']");
  if (patientEditForm) {
    event.preventDefault();
    if (!canManageClinical()) return;
    const data = new FormData(patientEditForm);
    const result = buildPatientFromForm(data, activePatient());
    if (!result.ok) {
      state.patientSaveNotice = result.error;
      save();
      render();
      return;
    }
    patients = mergePatients(patients, [result.patient]);
    state.patientId = result.patient.id;
    state.patientEditOpen = false;
    state.patientSaveNotice = `#${result.patient.chartNo} ${result.patient.name} 수정 완료`;
    applyPatientConfig();
    save();
    syncPatient(result.patient);
    render();
    return;
  }

  const orderForm = event.target.closest("form[data-form='order']");
  if (orderForm) {
    event.preventDefault();
    if (!canManageClinical()) return;
    const data = new FormData(orderForm);
    const result = buildOrderFromForm(data);
    if (!result.ok) {
      state.orderSaveNotice = result.error;
      save();
      render();
      return;
    }
    state.orders = mergeOrders(state.orders || [], [result.order]);
    state.orderFormOpen = false;
    state.orderSaveNotice = `${formatTimeLabel(result.order.hour)} ${result.order.title} 오더 생성`;
    save();
    syncOrder(result.order);
    render();
    return;
  }

  const clinicalForm = event.target.closest("form[data-form='clinical-record']");
  if (clinicalForm) {
    event.preventDefault();
    const result = buildClinicalRecordFromForm(new FormData(clinicalForm), clinicalForm.dataset.recordType);
    if (!result.ok) {
      state.clinicalNotice = result.error;
      save();
      render();
      return;
    }
    state.clinicalRecords = mergeClinicalRecords(state.clinicalRecords || [], [result.record]);
    state.clinicalNotice = result.notice;
    save();
    syncClinicalRecord(result.record);
    render();
    return;
  }

  const form = event.target.closest("form[data-form='entry']");
  if (!form) return;
  event.preventDefault();
  const data = new FormData(form);
  const value = String(data.get("value") || "").trim();
  if (!value) return;

  const next = {
    id: `e_${Date.now()}`,
    patientId: String(data.get("patientId")),
    rowId: String(data.get("rowId")),
    hour: Number(data.get("hour")),
    value,
    staff: String(data.get("staff") || "").trim() || activePatient().doctor,
    dateKey: selectedDateKey(),
    writtenAt: new Date().toISOString()
  };
  const dateKey = selectedDateKey();
  state.entries = state.entries.filter(
    (item) =>
      !(
        item.patientId === next.patientId &&
        item.rowId === next.rowId &&
        item.hour === next.hour &&
        entryDateKey(item) === dateKey
      )
  );
  state.entries.push(next);
  state.patientId = next.patientId;
  state.rowId = next.rowId;
  state.hour = next.hour;
  state.entrySaveNotice = `${rowLabel(next.rowId)} · ${formatTimeLabel(next.hour)} 기록 저장`;
  state.quickOpen = false;
  if (form.classList.contains("quick-panel")) {
    openChartDetail(next.patientId, { replace: true });
  }
  save();
  syncUpsertEntry(next);
  render();
});

function entry(patientId, rowId, hour, value, staff) {
  return {
    id: `${patientId}_${rowId}_${hour}`,
    patientId,
    rowId,
    hour,
    value,
    staff,
    dateKey: DEFAULT_DATE_KEY,
    writtenAt: now.toISOString()
  };
}

function defaultState() {
  return {
    authed: false,
    chartDate: DEFAULT_DATE_KEY,
    section: "chart",
    userRole: "vet",
    status: "current",
    species: "all",
    role: "vet",
    ward: "all",
    view: "chart",
    chartDetailOpen: false,
    chartSpecies: "all",
    chartDoctor: "all",
    chartSort: "importance",
    wardLocations: defaultWardLocations,
    patientWards: {},
    patientStatuses: {},
    patientStatusFilter: "active",
    wardView: "all",
    patientFormOpen: false,
    patientEditOpen: false,
    patientSaveNotice: "",
    orderFormOpen: false,
    orderDraftPatientId: "",
    orderDraftRowId: "diet",
    orderSaveNotice: "",
    orders: [],
    orderStatuses: {},
    clinicalNotice: "",
    clinicalRecords: [],
    wardSettingsNotice: "",
    dischargeNotice: "",
    calcWeight: "5.5",
    calcDoseMpk: "2",
    calcConcentration: "10",
    calcFluidHours: "24",
    patientId: "p2161",
    rowId: "bp",
    hour: currentHour,
    quickOpen: false,
    entryPanelOpen: false,
    quickSize: 2,
    labelSize: 2,
    labelWidth: 138,
    search: "",
    helpOpen: localStorage.getItem(TUTORIAL_SEEN_KEY) !== "1",
    helpStep: 0,
    calendarOpen: false,
    calendarMonth: DEFAULT_DATE_KEY.slice(0, 7),
    bpmMode: "pulse",
    bpmMeasure: null,
    realtimeUsers,
    entrySaveNotice: "",
    showTutorial: false,
    entries: seedEntries
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return {
      ...defaultState(),
      ...(saved || {}),
      section: "chart",
      chartDetailOpen: false,
      quickOpen: false,
      entryPanelOpen: false,
      bpmMeasure: null,
      bpmReturn: null,
      entrySaveNotice: "",
      wardSettingsNotice: "",
      dischargeNotice: "",
      patientFormOpen: false,
      patientEditOpen: false,
      helpOpen: localStorage.getItem(TUTORIAL_SEEN_KEY) !== "1" && saved?.helpOpen !== false,
      helpStep: Number(saved?.helpStep || 0),
      calendarOpen: false,
      calendarMonth: normalizeMonthKey(saved?.calendarMonth || saved?.chartDate || DEFAULT_DATE_KEY),
      patientSaveNotice: "",
      orderFormOpen: false,
      orderDraftPatientId: "",
      orderDraftRowId: saved?.orderDraftRowId || "diet",
      orderSaveNotice: "",
      wardLocations: Array.isArray(saved?.wardLocations) ? saved.wardLocations : defaultWardLocations,
      patientWards: saved?.patientWards && typeof saved.patientWards === "object" ? saved.patientWards : {},
      patientStatuses: saved?.patientStatuses && typeof saved.patientStatuses === "object" ? saved.patientStatuses : {},
      showTutorial: false,
      realtimeUsers: Array.isArray(saved?.realtimeUsers) ? saved.realtimeUsers : realtimeUsers,
      orders: Array.isArray(saved?.orders) ? saved.orders : [],
      orderStatuses: saved?.orderStatuses && typeof saved.orderStatuses === "object" ? saved.orderStatuses : {},
      clinicalNotice: "",
      clinicalRecords: Array.isArray(saved?.clinicalRecords) ? saved.clinicalRecords : [],
      entries: Array.isArray(saved?.entries) ? saved.entries : seedEntries
    };
  } catch {
    return defaultState();
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadClientId() {
  const saved = localStorage.getItem(CLIENT_ID_KEY);
  if (saved) return saved;
  const nextId = crypto.randomUUID ? crypto.randomUUID() : `client_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  localStorage.setItem(CLIENT_ID_KEY, nextId);
  return nextId;
}

function entryKey(item) {
  return `${item.patientId}:${item.rowId}:${Number(item.hour)}:${entryDateKey(item)}`;
}

function upsertLocalEntry(entryItem) {
  state.entries = state.entries.filter((item) => entryKey(item) !== entryKey(entryItem));
  state.entries.push(entryItem);
}

function deleteLocalEntry(target) {
  state.entries = state.entries.filter((item) => entryKey(item) !== entryKey(target));
}

async function postJson(path, payload) {
  try {
    await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch {
    // Keep localStorage as the offline fallback when the local sync server is unavailable.
  }
}

function syncUpsertEntry(entryItem) {
  postJson("/api/entries", { clientId, entry: entryItem });
}

function syncDeleteEntry(target) {
  postJson("/api/entries/delete", { clientId, target });
}

function syncBatchEntries(deletes, entries) {
  postJson("/api/entries/batch", { clientId, deletes, entries });
}

function syncConfig() {
  postJson("/api/config", {
    clientId,
    config: {
      wardLocations: wardLocations(),
      patientWards: state.patientWards || {},
      patientStatuses: state.patientStatuses || {}
    }
  });
}

function syncPatient(patient) {
  postJson("/api/patients", { clientId, patient });
}

function syncOrder(order) {
  postJson("/api/orders", { clientId, order });
}

function syncOrderStatus(orderId, status) {
  postJson("/api/orders/status", { clientId, orderId, ...status });
}

function syncDeleteOrder(orderId) {
  postJson("/api/orders/delete", { clientId, orderId });
}

function syncClinicalRecord(record) {
  postJson("/api/clinical-records", { clientId, record });
}

function syncDeleteClinicalRecord(recordId) {
  postJson("/api/clinical-records/delete", { clientId, recordId });
}

async function hydrateRealtimeState() {
  if (!state.authed) return;
  try {
    const response = await fetch("/api/state");
    if (!response.ok) return;
    const payload = await response.json();
    if (Array.isArray(payload.entries) && payload.entries.length) {
      state.entries = payload.entries;
    } else if (state.entries.length) {
      syncBatchEntries([], state.entries);
    }
    if (payload.config) {
      applyRemoteConfig(payload.config);
    }
    if (Array.isArray(payload.patients)) {
      applyRemotePatients(payload.patients);
    }
    if (Array.isArray(payload.orders)) {
      state.orders = mergeOrders(state.orders || [], payload.orders);
    }
    if (payload.orderStatuses && typeof payload.orderStatuses === "object") {
      state.orderStatuses = { ...(state.orderStatuses || {}), ...payload.orderStatuses };
    }
    if (Array.isArray(payload.clinicalRecords)) {
      state.clinicalRecords = mergeClinicalRecords(state.clinicalRecords || [], payload.clinicalRecords);
    }
    if (Array.isArray(payload.realtimeUsers) && payload.realtimeUsers.length) {
      state.realtimeUsers = payload.realtimeUsers;
    }
    save();
    render();
  } catch {
    // The UI still works as a single-browser app when the API is not reachable.
  }
}

function syncRealtimeConnection() {
  if (!state.authed || typeof EventSource === "undefined") {
    realtimeSource?.close();
    realtimeSource = null;
    return;
  }
  if (!realtimeSource) {
    const query = new URLSearchParams(currentPresence()).toString();
    realtimeSource = new EventSource(`/api/events?${query}`);
    realtimeSource.addEventListener("state", (event) => applyRealtimeEvent(event));
    realtimeSource.addEventListener("presence", (event) => applyRealtimeEvent(event));
    realtimeSource.addEventListener("entries:upsert", (event) => applyRealtimeEvent(event));
    realtimeSource.addEventListener("entries:delete", (event) => applyRealtimeEvent(event));
    realtimeSource.addEventListener("entries:batch", (event) => applyRealtimeEvent(event));
    realtimeSource.addEventListener("patients:upsert", (event) => applyRealtimeEvent(event));
    realtimeSource.addEventListener("orders:upsert", (event) => applyRealtimeEvent(event));
    realtimeSource.addEventListener("orders:status", (event) => applyRealtimeEvent(event));
    realtimeSource.addEventListener("orders:delete", (event) => applyRealtimeEvent(event));
    realtimeSource.addEventListener("clinical-records:upsert", (event) => applyRealtimeEvent(event));
    realtimeSource.addEventListener("clinical-records:delete", (event) => applyRealtimeEvent(event));
    realtimeSource.addEventListener("config:update", (event) => applyRealtimeEvent(event));
    realtimeSource.onerror = () => {
      realtimeSource?.close();
      realtimeSource = null;
    };
  }
  syncPresence();
}

function applyRealtimeEvent(event) {
  const payload = JSON.parse(event.data || "{}");
  if (Array.isArray(payload.realtimeUsers)) {
    state.realtimeUsers = payload.realtimeUsers.length ? payload.realtimeUsers : realtimeUsers;
  }
  if (payload.config) applyRemoteConfig(payload.config);
  if (Array.isArray(payload.patients)) applyRemotePatients(payload.patients);
  if (payload.patient) applyRemotePatients([payload.patient]);
  if (Array.isArray(payload.orders)) state.orders = mergeOrders(state.orders || [], payload.orders);
  if (payload.order) state.orders = mergeOrders(state.orders || [], [payload.order]);
  if (payload.orderId && payload.status) {
    state.orderStatuses = { ...(state.orderStatuses || {}), [payload.orderId]: payload.status };
  }
  if (payload.orderId && payload.type === "orders:delete") {
    state.orders = (state.orders || []).filter((order) => order.id !== payload.orderId);
    state.orderStatuses = { ...(state.orderStatuses || {}) };
    delete state.orderStatuses[payload.orderId];
  }
  if (Array.isArray(payload.clinicalRecords)) {
    state.clinicalRecords = mergeClinicalRecords(state.clinicalRecords || [], payload.clinicalRecords);
  }
  if (payload.record) {
    state.clinicalRecords = mergeClinicalRecords(state.clinicalRecords || [], [payload.record]);
  }
  if (payload.recordId && payload.type === "clinical-records:delete") {
    state.clinicalRecords = (state.clinicalRecords || []).filter((record) => record.id !== payload.recordId);
  }
  if (Array.isArray(payload.entries) && payload.type === "state" && payload.entries.length) {
    state.entries = payload.entries;
  }
  if (payload.entry) upsertLocalEntry(payload.entry);
  if (payload.target) deleteLocalEntry(payload.target);
  if (Array.isArray(payload.deletes)) payload.deletes.forEach(deleteLocalEntry);
  if (Array.isArray(payload.entries) && payload.type === "entries:batch") payload.entries.forEach(upsertLocalEntry);
  save();
  render();
}

function applyRemoteConfig(config) {
  state.wardLocations = Array.isArray(config.wardLocations) && config.wardLocations.length ? config.wardLocations : defaultWardLocations;
  state.patientWards = config.patientWards && typeof config.patientWards === "object" ? config.patientWards : {};
  state.patientStatuses = config.patientStatuses && typeof config.patientStatuses === "object" ? config.patientStatuses : {};
  applyPatientConfig();
}

function applyRemotePatients(remotePatients) {
  patients = mergePatients(patients, remotePatients);
  if (!patients.some((patient) => patient.id === state.patientId)) {
    state.patientId = patients[0]?.id || "";
  }
  applyPatientConfig();
}

function mergePatients(currentPatients, incomingPatients) {
  const merged = [...currentPatients];
  incomingPatients.filter(isPatientLike).forEach((incoming) => {
    const normalized = normalizePatient(incoming);
    const index = merged.findIndex((patient) => patient.id === normalized.id || patient.chartNo === normalized.chartNo);
    if (index >= 0) {
      merged[index] = { ...merged[index], ...normalized };
    } else {
      merged.push(normalized);
    }
  });
  return merged;
}

function mergeOrders(currentOrders, incomingOrders) {
  const merged = [...currentOrders];
  incomingOrders.filter(isOrderLike).forEach((incoming) => {
    const index = merged.findIndex((order) => order.id === incoming.id);
    if (index >= 0) {
      merged[index] = { ...merged[index], ...incoming };
    } else {
      merged.push(incoming);
    }
  });
  return merged;
}

function isPatientLike(patient) {
  return patient && typeof patient === "object" && patient.id && patient.chartNo && patient.name;
}

function isOrderLike(order) {
  return order && typeof order === "object" && order.id && order.patientId && order.title;
}

function normalizePatient(patient) {
  const status = patient.status || "current";
  const admitDate = normalizeDisplayDate(patient.admitDate || patient.date || selectedDateKey());
  const admitDay = Number(patient.admitDay) || calculateAdmitDay(admitDate);
  const ward = patient.ward || wardLocations()[0] || "-";
  const importance = patient.importance || "normal";
  const chartInterval = chartIntervalForValue(patient.chartInterval, importance);
  return {
    ...patient,
    guardian: patient.guardian || "-",
    photoUrl: patient.photoUrl || "",
    species: patient.species || "기타",
    breed: patient.breed || "-",
    age: patient.age || "-",
    sex: patient.sex || "-",
    ward,
    defaultWard: ward,
    admitDay,
    weight: patient.weight || "",
    cc: patient.cc || "-",
    dx: patient.dx || "-",
    doctor: patient.doctor || "미지정",
    status,
    defaultStatus: status,
    importance,
    chartInterval,
    room: patient.room || "-",
    date: normalizeDisplayDate(patient.date || admitDate),
    admitDate,
    surgeryDate: patient.surgeryDate ? normalizeDisplayDate(patient.surgeryDate) : "",
    tags: [`입원 ${admitDay}일차`, ward, importance === "high" ? "중요" : "일반"]
  };
}

function currentPresence() {
  return {
    clientId,
    name: activePatient().doctor,
    role: userRoleLabel(),
    section: sectionLabel(state.section)
  };
}

function syncPresence() {
  const timestamp = Date.now();
  if (timestamp - presenceSyncAt < 2000) return;
  presenceSyncAt = timestamp;
  postJson("/api/presence", currentPresence());
}

function sectionLabel(section) {
  const found = navItems.find(([id]) => id === section);
  return found?.[2] || "차트";
}

function chartHash(patientId) {
  return `#chart-${patientId}`;
}

function patientIdFromChartHash() {
  const match = window.location.hash.match(/^#chart-(.+)$/);
  if (!match) return "";
  const patientId = decodeURIComponent(match[1]);
  return patients.some((patient) => patient.id === patientId) ? patientId : "";
}

function applyRouteFromHash() {
  const patientId = patientIdFromChartHash();
  if (patientId) {
    state.section = "chart";
    state.view = "chart";
    state.patientId = patientId;
    state.chartDetailOpen = true;
    state.quickOpen = false;
    state.entryPanelOpen = false;
    return;
  }
  if (state.section === "chart") {
    state.chartDetailOpen = false;
    state.quickOpen = false;
    state.entryPanelOpen = false;
  }
}

function setSection(section) {
  if (section === "quick") section = "chart";
  state.section = section;
  state.quickOpen = false;
  state.entryPanelOpen = false;
  if (section === "chart") {
    state.view = "chart";
    state.chartDetailOpen = false;
  }
  if (section !== "chart") {
    state.chartDetailOpen = false;
  }
  closeChartRoute();
}

function openChartDetail(patientId, options = {}) {
  state.patientId = patientId;
  state.section = "chart";
  state.view = "chart";
  state.chartDetailOpen = true;
  state.quickOpen = false;
  state.entryPanelOpen = false;
  document.documentElement.classList.remove("entry-panel-locked");
  document.body.classList.remove("entry-panel-locked");
  requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
  const nextHash = chartHash(patientId);
  if (window.location.hash === nextHash) return;
  window.history.replaceState({ chartDetailOpen: true }, "", nextHash);
}

function showChartList() {
  state.section = "chart";
  state.view = "chart";
  state.chartDetailOpen = false;
  state.quickOpen = false;
  state.entryPanelOpen = false;
  closeChartRoute();
}

function closeChartRoute() {
  if (!window.location.hash.startsWith("#chart-")) return;
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
}

function render() {
  app.innerHTML = state.authed
    ? `${renderApp()}${state.calendarOpen ? renderCalendarSheet() : ""}${state.helpOpen ? renderHelpBubble() : ""}`
    : renderLogin();
  syncScrollLock();
  syncBpmTicker();
  syncRealtimeConnection();
  requestAnimationFrame(syncChartScrollTracks);
}

function syncScrollLock() {
  document.documentElement.classList.toggle("entry-panel-locked", Boolean(state.entryPanelOpen));
  document.body.classList.toggle("entry-panel-locked", Boolean(state.entryPanelOpen));
}

function renderLogin() {
  return `
    <main class="login-screen">
      <section class="brand-panel">
        <div class="logo-mark" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
        <h1>VetCrew</h1>
        <p>동물병원 입원환자 관리 시스템</p>
      </section>
      <section class="login-card">
        <label>
          <span>이메일</span>
          <input value="example@vetcrew.com" inputmode="email" />
        </label>
        <label>
          <span>비밀번호</span>
          <input type="password" placeholder="비밀번호를 입력하세요" />
        </label>
        <button class="primary-action" data-action="login">로그인</button>
      </section>
      <footer>© 2026 VetCrew</footer>
    </main>
  `;
}

function renderTutorialModal() {
  return `
    <div class="tutorial-backdrop" role="dialog" aria-modal="true" aria-label="사용 안내">
      <section class="tutorial-modal">
        <header>
          <span>Guide</span>
          <strong>입원 차트 빠른 안내</strong>
        </header>
        <ul>
          <li>환자 목록에서 환자를 선택하면 시간대별 차트를 볼 수 있습니다.</li>
          <li>차트 셀을 누르면 기록 패널이 열리고, 길게 누르면 빠른 측정으로 이동합니다.</li>
          <li>환자 등록 버튼으로 새 입원 환자를 추가할 수 있습니다.</li>
        </ul>
        <button class="primary-action" type="button" data-action="close-tutorial">확인</button>
      </section>
    </div>
  `;
}

function renderApp() {
  const patient = activePatient();
  const section = state.section || "chart";
  const headerDate = headerDateParts(selectedDateKey());
  const isChartDetail = section === "chart" && state.chartDetailOpen;
  return `
    <main class="phone-app">
      <header class="app-header">
        ${
          isChartDetail
            ? `<button class="icon-button" type="button" data-action="chart-back" aria-label="환자 목록으로 돌아가기">‹</button>`
            : `<span class="header-spacer" aria-hidden="true"></span>`
        }
        <div class="date-switcher">
          <button class="plain-icon" data-action="shift-date" data-delta="-1" aria-label="전날">‹</button>
          <button class="date-display" data-action="toggle-calendar" aria-label="날짜 선택">
            <strong>${headerDate.monthDay} <span class="${headerDate.weekend ? "weekend" : ""}">(${headerDate.weekday})</span></strong>
          </button>
          <button class="plain-icon" data-action="shift-date" data-delta="1" aria-label="다음날">›</button>
        </div>
        <div class="header-actions">
          <button class="plain-icon" data-action="focus-search" aria-label="검색">⌕</button>
          <button class="plain-icon" data-action="open-notifications" aria-label="알림">♢</button>
        </div>
      </header>

      ${renderSection(section, patient)}
      ${renderFloatingTopButton(section)}

      <nav class="bottom-nav" aria-label="하단 메뉴">
        ${navItems
          .map(
            ([id, icon, label]) => `
              <button class="${id === section ? "active" : ""} ${currentHelpStep()?.section === id ? "help-target" : ""}" data-action="set-section" data-value="${id}">
                <span>${icon}</span>
                <small>${label}</small>
                ${id === "tasks" ? `<em>${taskSummary().todo}</em>` : ""}
              </button>
            `
          )
          .join("")}
        <button class="help-nav-button" data-action="start-help" aria-label="도움말">
          <span>?</span>
          <small>도움말</small>
        </button>
      </nav>
    </main>
  `;
}

function renderFloatingTopButton(section) {
  if (!["chart", "tasks"].includes(section)) return "";
  return `
    <button class="floating-top-button" type="button" data-action="scroll-top" aria-label="맨 위로 이동">
      TOP
    </button>
  `;
}

function currentHelpStep() {
  if (!state.helpOpen) return null;
  return helpSteps[Math.min(Math.max(Number(state.helpStep || 0), 0), helpSteps.length - 1)];
}

function renderHelpBubble() {
  const step = currentHelpStep();
  if (!step) return "";
  const index = helpSteps.indexOf(step);
  const isLast = index === helpSteps.length - 1;
  return `
    <div class="help-scrim" data-action="close-help" aria-hidden="true"></div>
    <aside class="help-bubble help-${step.section}" role="dialog" aria-live="polite" aria-label="${step.title} 도움말">
      <span>${index + 1}/${helpSteps.length}</span>
      <strong>${step.title}</strong>
      <p>${step.text}</p>
      <ul>
        ${step.tips.map((tip) => `<li>${tip}</li>`).join("")}
      </ul>
      <div>
        <button type="button" data-action="close-help">닫기</button>
        <button type="button" data-action="next-help">${isLast ? "완료" : "다음"}</button>
      </div>
    </aside>
  `;
}

function renderCalendarSheet() {
  const selectedKey = selectedDateKey();
  const monthKey = normalizeMonthKey(state.calendarMonth || monthKeyFromDateKey(selectedKey));
  const monthDate = parseMonthKey(monthKey);
  const title = `${monthDate.getFullYear()}년 ${monthDate.getMonth() + 1}월`;
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const days = calendarDays(monthKey);
  return `
    <div class="calendar-backdrop" data-action="close-calendar" aria-hidden="true"></div>
    <section class="calendar-sheet" role="dialog" aria-modal="true" aria-label="날짜 선택">
      <header>
        <button class="plain-icon" data-action="shift-calendar-month" data-delta="-1" aria-label="이전 달">‹</button>
        <strong>${title}</strong>
        <button class="plain-icon" data-action="shift-calendar-month" data-delta="1" aria-label="다음 달">›</button>
      </header>
      <div class="calendar-weekdays">
        ${weekdays.map((day) => `<span>${day}</span>`).join("")}
      </div>
      <div class="calendar-grid">
        ${days
          .map(
            (day) => `
              <button
                class="${day.inMonth ? "" : "muted"} ${day.key === selectedKey ? "selected" : ""} ${day.today ? "today" : ""}"
                data-action="select-calendar-date"
                data-date="${day.key}"
                type="button"
              >
                <span>${day.date.getDate()}</span>
              </button>
            `
          )
          .join("")}
      </div>
      <footer>
        <button type="button" data-action="select-today">오늘</button>
        <button type="button" data-action="close-calendar">닫기</button>
      </footer>
    </section>
  `;
}

function renderSection(section, patient) {
  if (section === "quick") return renderQuickScreen(patient);
  if (section === "tasks") return renderTasksScreen();
  if (section === "ward") return renderWardScreen();
  if (section === "more") return renderMoreScreen();
  return renderChartScreen(patient);
}

function renderChartScreen(patient) {
  const visiblePatients = sortedChartPatients(filteredChartPatients());
  if (!state.chartDetailOpen) return renderChartListScreen(visiblePatients);
  return `
    <div class="chart-detail-shell">
      ${renderRealtimeStrip()}
      <section class="chart-surface">
        ${renderPatientHeader(patient)}
        ${renderChartVitalSummary(patient)}
        ${renderPatientClinicalPanels(patient)}
        ${state.view === "cards" ? renderTaskCards(patient) : renderChartMode(patient)}
      </section>
    </div>
  `;
}

function renderChartListScreen(visiblePatients) {
  return `
    <section class="chart-list-screen menu-screen" aria-label="입원 환자 목록">
      ${renderRealtimeStrip()}
      ${state.patientSaveNotice ? `<p class="entry-save-notice patient-save-notice">${state.patientSaveNotice}</p>` : ""}
      <div class="chart-list-toolbar">
        <strong>총 ${visiblePatients.length}건</strong>
        <div>
          <label class="chart-search-field">
            <span>검색</span>
            <input name="search" value="${state.search || ""}" placeholder="환자명 / 차트번호" autocomplete="off" />
          </label>
          <label>
            <span>종</span>
            <select name="chartSpecies">
              ${speciesOptions().map(([value, label]) => `<option value="${value}" ${(state.chartSpecies || "all") === value ? "selected" : ""}>${label}</option>`).join("")}
            </select>
          </label>
          <label>
            <span>담당</span>
            <select name="chartDoctor">
              ${doctorOptions().map(([value, label]) => `<option value="${value}" ${(state.chartDoctor || "all") === value ? "selected" : ""}>${label}</option>`).join("")}
            </select>
          </label>
          <label>
            <span>정렬</span>
            <select name="chartSort">
              ${[
                ["importance", "중요도순"],
                ["admit", "입원일순"],
                ["chartNo", "차트번호순"]
              ]
                .map(([value, label]) => `<option value="${value}" ${(state.chartSort || "importance") === value ? "selected" : ""}>${label}</option>`)
                .join("")}
            </select>
          </label>
          <label>
            <span>상태</span>
            <select name="patientStatusFilter">
              ${[
                ["active", "입원중"],
                ["all", "전체"],
                ["discharged", "퇴원"]
              ]
                .map(([value, label]) => `<option value="${value}" ${(state.patientStatusFilter || "active") === value ? "selected" : ""}>${label}</option>`)
                .join("")}
            </select>
          </label>
          <button type="button" data-action="toggle-patient-form" ${canManageClinical() ? "" : "disabled"}>${state.patientFormOpen ? "닫기" : "환자 등록"}</button>
        </div>
      </div>
      ${state.patientFormOpen ? renderPatientRegisterForm() : ""}
      <div class="chart-list-grid">${visiblePatients.map(renderPatientCard).join("")}</div>
    </section>
  `;
}

function renderPatientRegisterForm() {
  const today = selectedDateKey();
  return `
    <form class="patient-register-form" data-form="patient" aria-label="환자 등록">
      <div class="patient-register-head">
        <div>
          <span>Admission</span>
          <strong>환자 등록</strong>
        </div>
        <button type="button" data-action="toggle-patient-form" aria-label="환자 등록 닫기">×</button>
      </div>
      ${state.patientSaveNotice ? `<p class="entry-save-notice">${state.patientSaveNotice}</p>` : ""}
      <div class="patient-register-grid">
        <label>
          <span>차트번호</span>
          <input name="newChartNo" inputmode="numeric" autocomplete="off" required />
        </label>
        <label>
          <span>환자명</span>
          <input name="newName" autocomplete="off" required />
        </label>
        <label>
          <span>보호자</span>
          <input name="newGuardian" autocomplete="off" />
        </label>
        <label class="patient-register-wide">
          <span>프로필 사진 URL</span>
          ${clearableControl(`<input name="newPhotoUrl" type="url" placeholder="https://..." autocomplete="off" />`)}
        </label>
        <label>
          <span>종</span>
          <select name="newSpecies">
            <option>개</option>
            <option>고양이</option>
            <option>기타</option>
          </select>
        </label>
        <label>
          <span>품종</span>
          <input name="newBreed" autocomplete="off" />
        </label>
        <label>
          <span>나이</span>
          <input name="newAge" placeholder="예: 7년 3개월" autocomplete="off" />
        </label>
        <label>
          <span>성별</span>
          <select name="newSex">
            <option>중성화수컷</option>
            <option>중성화암컷</option>
            <option>수컷</option>
            <option>암컷</option>
            <option>미상</option>
          </select>
        </label>
        <label>
          <span>체중</span>
          <input name="newWeight" placeholder="예: 4.2kg" autocomplete="off" />
        </label>
        <label>
          <span>입원장</span>
          <select name="newWard">
            ${wardLocations().map((ward) => `<option value="${ward}">${ward}</option>`).join("")}
          </select>
        </label>
        <label>
          <span>담당의</span>
          <input name="newDoctor" placeholder="예: 홍길동" autocomplete="off" required />
        </label>
        <label>
          <span>입원일</span>
          <input name="newAdmitDate" type="date" value="${today}" />
        </label>
        <label>
          <span>수술일</span>
          <input name="newSurgeryDate" type="date" />
        </label>
        <label>
          <span>중요도</span>
          <select name="newImportance">
            <option value="normal">보통</option>
            <option value="high">중요</option>
          </select>
        </label>
        <label>
          <span>차팅 간격</span>
          <select name="newChartInterval">
            ${chartIntervalOptions.map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}
          </select>
        </label>
        <label class="patient-register-wide">
          <span>CC</span>
          ${clearableControl(`<textarea name="newCc" placeholder="주호소 또는 입원 목적"></textarea>`)}
        </label>
        <label class="patient-register-wide">
          <span>DX</span>
          ${clearableControl(`<textarea name="newDx" placeholder="진단/경과 메모"></textarea>`)}
        </label>
      </div>
      <button class="primary-action" type="submit">등록하고 차트 열기</button>
    </form>
  `;
}

function renderChartCopyTools(patient) {
  const canManage = canManageTodo();
  const prevDate = formatHeaderDate(shiftDateKey(selectedDateKey(), -1));
  return `
    <section class="copy-tools" aria-label="차트 복사">
      <div>
        <strong>차트복사</strong>
        <span>${prevDate} 기록을 ${formatHeaderDate(selectedDateKey())}로 복사</span>
      </div>
      <div>
        <button ${canManage ? "" : "disabled"} data-action="copy-chart">#${patient.chartNo} 복사</button>
      </div>
      ${state.chartCopyNotice ? `<p>${state.chartCopyNotice}</p>` : ""}
      ${canManage ? "" : `<p>To do 설정과 차트복사는 수의사 권한에서만 가능합니다.</p>`}
    </section>
  `;
}

function renderShiftSummary(patient) {
  const vitals = latestVitalSummary(patient.id);
  const doneCount = entriesFor(patient.id).length;
  const row = rows.find((item) => item.id === state.rowId) || rows[0];
  return `
    <section class="shift-summary" aria-label="선택 환자 요약">
      <div>
        <span>선택 환자</span>
        <strong>#${patient.chartNo} ${patient.name}</strong>
      </div>
      <div>
        <span>최근 활력</span>
        <strong>${vitals}</strong>
      </div>
      <div>
        <span>차트 기록</span>
        <strong>${doneCount}건</strong>
      </div>
      <div>
        <span>입력 위치</span>
        <strong>${row.label} · ${state.hour}시</strong>
      </div>
    </section>
  `;
}

function renderChartVitalSummary(patient) {
  const vitals = latestVitalSummary(patient.id);
  return `
    <section class="chart-vital-summary" aria-label="최근 활력">
      <span>최근 활력</span>
      <strong>${vitals}</strong>
    </section>
  `;
}

function renderStatusTabs() {
  const counts = statusCounts();
  return `
    <div class="status-tabs">
      ${[
        ["delayed", "지연"],
        ["current", "현재"],
        ["planned", "예정"],
        ["done", "완료"]
      ]
        .map(
          ([id, label]) => `
            <button class="${state.status === id ? "active" : ""}" data-action="set-status" data-value="${id}">
              ${label}${counts[id] ? `<span>${counts[id]}</span>` : ""}
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

function renderFilters() {
  return `
    <section class="filters">
      ${filterRow("species", speciesOptions())}
      ${filterRow("role", roleOptions())}
      ${filterRow("ward", wardOptions())}
    </section>
  `;
}

function filterRow(filter, options) {
  return `
    <div class="filter-row">
      ${options
        .map(
          ([value, label]) => `
            <button class="${state[filter] === value ? "active" : ""}" data-action="set-filter" data-filter="${filter}" data-value="${value}">
              ${label}
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

function wardLocations() {
  return Array.from(new Set([...(state.wardLocations || []), ...defaultWardLocations, ...Object.values(state.patientWards || {})].filter(Boolean)));
}

function applyPatientConfig() {
  const patientWards = state.patientWards || {};
  const patientStatuses = state.patientStatuses || {};
  patients.forEach((patient) => {
    patient.defaultWard = patient.defaultWard || patient.ward;
    patient.defaultStatus = patient.defaultStatus || patient.status;
    patient.ward = patientWards[patient.id] || patient.defaultWard;
    patient.status = patientStatuses[patient.id] || patient.defaultStatus;
  });
}

function wardOptions() {
  const wards = wardLocations();
  const activePatients = activePatientsList();
  return [["all", `전체 ${activePatients.length}`], ...wards.map((ward) => [ward, `${ward} ${activePatients.filter((patient) => patient.ward === ward).length}`])];
}

function speciesOptions() {
  const activePatients = activePatientsList();
  return [
    ["all", `전체 ${activePatients.length}`],
    ["dog", `개 ${activePatients.filter((patient) => patient.species === "개").length}`],
    ["cat", `고양이 ${activePatients.filter((patient) => patient.species === "고양이").length}`],
    ["other", `기타 ${activePatients.filter((patient) => !["고양이", "개"].includes(patient.species)).length}`]
  ];
}

function roleOptions() {
  const tasks = taskItems();
  return [
    ["all", `전체 ${tasks.length}`],
    ["vet", `수의사 ${tasks.filter((task) => task.assignee === "수의사").length}`],
    ["tech", `테크니션 ${tasks.filter((task) => task.assignee === "테크니션").length}`],
    ["diet", `식이 ${tasks.filter((task) => task.assignee === "식이").length}`]
  ];
}

function doctorOptions() {
  const doctors = Array.from(new Set(patients.map((patient) => patient.doctor)));
  return [
    ["all", `담당 전체 ${patients.length}`],
    ...doctors.map((doctor) => [doctor, `${doctor} ${patients.filter((patient) => patient.doctor === doctor).length}`])
  ];
}

function renderPatientCard(patient) {
  const active = patient.id === state.patientId;
  return `
    <article class="patient-card ${active ? "active" : ""} ${patient.status === "discharged" ? "discharged" : ""}">
      <button data-action="select-patient" data-id="${patient.id}">
        ${renderPatientAvatar(patient, "card")}
        <div>
          <span class="chart-no">#${patient.chartNo}</span>
          <h2>${patient.name} <em>(${patient.guardian})</em></h2>
          <p>${patient.species} / ${patient.breed} / ${patient.age} / ${patient.sex}</p>
          <div class="patient-date-meta">${patientStayLabel(patient, { compact: true })}</div>
          <p><span>CC:</span> ${patient.cc}</p>
        </div>
        <dl>
          <dt>${patient.status === "discharged" ? "퇴원" : patient.tags[0]}</dt>
          <dd>${patient.ward}</dd>
          <dd>${patient.doctor}</dd>
        </dl>
      </button>
    </article>
  `;
}

function renderPatientAvatar(patient, variant = "card") {
  const url = String(patient.photoUrl || "").trim();
  const defaultUrl = defaultPatientPhotoUrl(patient);
  const imageUrl = url || defaultUrl;
  const fallback = patient.species === "개" ? "Dog" : patient.species === "고양이" ? "Cat" : "Pet";
  const onError = url && defaultUrl
    ? `this.onerror=null;this.src='${escapeAttr(defaultUrl)}'`
    : "this.closest('.patient-avatar').classList.add('image-failed')";
  const image = imageUrl
    ? `<img src="${escapeAttr(imageUrl)}" alt="${escapeAttr(patient.name)} 프로필 사진" loading="lazy" onerror="${onError}" />`
    : "";
  return `
    <span class="patient-avatar avatar-${variant} ${imageUrl ? "has-image" : ""}" aria-hidden="${imageUrl ? "false" : "true"}">
      ${image}
      <span>${fallback}</span>
    </span>
  `;
}

function defaultPatientPhotoUrl(patient) {
  if (patient.species === "개") return "assets/default-dog.png";
  if (patient.species === "고양이") return "assets/default-cat.png";
  return "";
}

function renderPatientHeader(patient) {
  const discharged = patient.status === "discharged";
  return `
    <div class="patient-header">
      ${renderPatientAvatar(patient, "header")}
      <div>
        <div class="title-line">
          <span class="chart-no">#${patient.chartNo}</span>
          <h1>${patient.name} (${patient.guardian})</h1>
          <span class="tag">${discharged ? "퇴원" : patient.tags[2]}</span>
        </div>
        <p>${patient.species} / ${patient.breed} / ${patient.age} / ${patient.sex} / ${patient.ward}</p>
        <p class="patient-date-meta">${patientStayLabel(patient)}</p>
        <p>CC: ${patient.cc}</p>
        <p>DX: ${patient.dx}</p>
        <div class="patient-main-actions">
          <button class="edit-patient-button" type="button" data-action="toggle-patient-edit">
            ${state.patientEditOpen ? "수정닫기" : "정보수정"}
          </button>
          <button class="discharge-button ${discharged ? "restore" : ""}" type="button" data-action="${discharged ? "restore-patient" : "discharge-patient"}" data-patient-id="${patient.id}">
            ${discharged ? "입원복귀" : "퇴원처리"}
          </button>
        </div>
      </div>
      <div class="doctor">
        <span>담당</span>
        <strong>${patient.doctor}</strong>
        <label class="ward-select">
          <span>입원장 위치</span>
          <select name="patientWard" data-patient-id="${patient.id}">
            ${wardLocations().map((ward) => `<option value="${ward}" ${patient.ward === ward ? "selected" : ""}>${ward}</option>`).join("")}
          </select>
        </label>
        <label class="ward-select">
          <span>차팅 간격</span>
          <select name="patientChartInterval" data-patient-id="${patient.id}" ${canManageClinical() ? "" : "disabled"}>
            ${chartIntervalOptions
              .map(([value, label]) => `<option value="${value}" ${chartIntervalForPatient(patient) === value ? "selected" : ""}>${label}</option>`)
              .join("")}
          </select>
        </label>
      </div>
    </div>
    ${state.patientEditOpen ? renderPatientEditForm(patient) : ""}
    ${state.dischargeNotice ? `<p class="entry-save-notice discharge-notice">${state.dischargeNotice}</p>` : ""}
    ${state.patientSaveNotice ? `<p class="entry-save-notice discharge-notice">${state.patientSaveNotice}</p>` : ""}
  `;
}

function renderPatientClinicalPanels(patient) {
  return `
    <section class="clinical-panels" aria-label="환자 임상 기능">
      ${renderPatientHandoffPanel(patient)}
      ${renderVitalTrendPanel(patient)}
      ${renderGuardianPanel(patient)}
    </section>
  `;
}

function renderPatientHandoffPanel(patient) {
  const notes = clinicalRecords("handoff", patient.id);
  return `
    <article class="clinical-panel patient-handoff-panel">
      <header>
        <span>Handoff</span>
        <strong>인수인계 노트</strong>
      </header>
      ${renderClinicalList(notes, "인수인계 노트 없음")}
    </article>
  `;
}

function renderVitalTrendPanel(patient) {
  const points = vitalTrendPoints(patient.id);
  return `
    <article class="clinical-panel vital-trend-panel">
      <header>
        <span>Vitals</span>
        <strong>바이탈 그래프</strong>
      </header>
      <div class="vital-bars">
        ${points
          .map(
            (point) => `
              <div>
                <span style="--bar-height: ${point.percent}%"></span>
                <small>${formatTimeLabel(point.hour)}</small>
              </div>
            `
          )
          .join("")}
      </div>
      <p>${points.length ? "혈압 기준 최근 추이" : "혈압 기록을 입력하면 추이가 표시됩니다."}</p>
    </article>
  `;
}

function renderGuardianPanel(patient) {
  const updates = clinicalRecords("guardian", patient.id);
  return `
    <article class="clinical-panel">
      <header>
        <span>Guardian</span>
        <strong>보호자 업데이트</strong>
      </header>
      <form data-form="clinical-record" data-record-type="guardian">
        <input type="hidden" name="patientId" value="${patient.id}" />
        ${clearableControl(`<input name="summary" placeholder="예: 식욕/활력 안내 완료" ${canManageClinical() ? "" : "disabled"} required />`)}
        <button type="submit" ${canManageClinical() ? "" : "disabled"}>기록</button>
      </form>
      ${renderClinicalList(updates, "보호자 업데이트 없음")}
    </article>
  `;
}

function renderPatientEditForm(patient) {
  return `
    <form class="patient-register-form patient-edit-form" data-form="patient-edit" aria-label="환자 정보 수정">
      <input type="hidden" name="editPatientId" value="${patient.id}" />
      <div class="patient-register-head">
        <div>
          <span>Profile</span>
          <strong>환자 정보 수정</strong>
        </div>
        <button type="button" data-action="toggle-patient-edit" aria-label="환자 정보 수정 닫기">×</button>
      </div>
      <div class="patient-register-grid">
        ${patientTextField("editChartNo", "차트번호", patient.chartNo, "numeric")}
        ${patientTextField("editName", "환자명", patient.name)}
        ${patientTextField("editGuardian", "보호자", patient.guardian)}
        <label class="patient-register-wide">
          <span>프로필 사진 URL</span>
          ${clearableControl(`<input name="editPhotoUrl" type="url" value="${escapeAttr(patient.photoUrl || "")}" placeholder="https://..." autocomplete="off" />`, patient.photoUrl)}
        </label>
        <label>
          <span>종</span>
          <select name="editSpecies">
            ${["개", "고양이", "기타"].map((value) => `<option ${patient.species === value ? "selected" : ""}>${value}</option>`).join("")}
          </select>
        </label>
        ${patientTextField("editBreed", "품종", patient.breed)}
        ${patientTextField("editAge", "나이", patient.age)}
        <label>
          <span>성별</span>
          <select name="editSex">
            ${["중성화수컷", "중성화암컷", "수컷", "암컷", "미상"].map((value) => `<option ${patient.sex === value ? "selected" : ""}>${value}</option>`).join("")}
          </select>
        </label>
        ${patientTextField("editWeight", "체중", patient.weight)}
        <label>
          <span>입원장</span>
          <select name="editWard">
            ${wardLocations().map((ward) => `<option value="${ward}" ${patient.ward === ward ? "selected" : ""}>${ward}</option>`).join("")}
          </select>
        </label>
        ${patientTextField("editDoctor", "담당의", patient.doctor)}
        <label>
          <span>입원일</span>
          <input name="editAdmitDate" type="date" value="${dateInputValue(patient.admitDate)}" />
        </label>
        <label>
          <span>수술일</span>
          <input name="editSurgeryDate" type="date" value="${patient.surgeryDate ? dateInputValue(patient.surgeryDate) : ""}" />
        </label>
        <label>
          <span>중요도</span>
          <select name="editImportance">
            <option value="normal" ${patient.importance !== "high" ? "selected" : ""}>보통</option>
            <option value="high" ${patient.importance === "high" ? "selected" : ""}>중요</option>
          </select>
        </label>
        <label>
          <span>차팅 간격</span>
          <select name="editChartInterval">
            ${chartIntervalOptions
              .map(([value, label]) => `<option value="${value}" ${chartIntervalForPatient(patient) === value ? "selected" : ""}>${label}</option>`)
              .join("")}
          </select>
        </label>
        <label class="patient-register-wide">
          <span>CC</span>
          ${clearableControl(`<textarea name="editCc">${patient.cc || ""}</textarea>`, patient.cc)}
        </label>
        <label class="patient-register-wide">
          <span>DX</span>
          ${clearableControl(`<textarea name="editDx">${patient.dx || ""}</textarea>`, patient.dx)}
        </label>
      </div>
      <button class="primary-action" type="submit">수정 저장</button>
    </form>
  `;
}

function patientTextField(name, label, value, inputMode = "") {
  const required = ["editChartNo", "editName", "editDoctor"].includes(name) ? "required" : "";
  return `
    <label>
      <span>${label}</span>
      ${clearableControl(`<input name="${name}" ${inputMode ? `inputmode="${inputMode}"` : ""} value="${escapeAttr(value || "")}" autocomplete="off" ${required} />`, value)}
    </label>
  `;
}

function clearableControl(controlHtml, value = "") {
  return `
    <div class="clearable-field ${String(value || "").trim() ? "has-value" : ""}">
      ${controlHtml}
      <button class="clear-field-button" type="button" data-action="clear-field" aria-label="필드 초기화">×</button>
    </div>
  `;
}

function syncClearableField(input) {
  input.closest(".clearable-field")?.classList.toggle("has-value", Boolean(input.value));
}

function renderChartMode(patient) {
  return `
    <div class="chart-mode ${state.entryPanelOpen ? "" : "quick-closed"}">
      ${renderChart(patient)}
      ${state.entryPanelOpen ? renderQuickInput(patient) : ""}
    </div>
  `;
}

function renderChart(patient) {
  const entries = entriesFor(patient.id);
  const patientOrders = orderTaskItems().filter((order) => order.patient.id === patient.id);
  const labelSize = getLabelSize();
  const chartHours = hours(patient);
  const current = currentTimeSlot(chartIntervalForPatient(patient));
  return `
    <div class="chart-scroll-shell" style="--label-width: ${labelSize.width}px; --cell-width: ${labelSize.cellWidth}px">
      <div class="chart-wrap">
        <table class="care-chart">
          <thead>
            <tr>
              <th class="row-head">
                <div class="label-tools">
                  <button class="label-now" type="button" data-action="select-cell" data-patient-id="${patient.id}" data-row-id="${state.rowId}" data-hour="${current}">현재</button>
                  <button class="label-step" type="button" data-action="resize-label" data-delta="-1" aria-label="항목 영역 작게">‹</button>
                  <span>${labelSize.label}</span>
                  <button class="label-step" type="button" data-action="resize-label" data-delta="1" aria-label="항목 영역 크게">›</button>
                </div>
                <button class="label-resize-handle" type="button" data-resize="label-width" aria-label="항목 영역 폭 조절"></button>
              </th>
              ${chartHours.map((hour) => `<th class="${hour === current ? "now" : ""}">${renderTimeHead(hour)}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) => `
                  <tr>
                    <th class="row-label ${row.tone}" ${measureModeForRow(row.id) ? `data-measure-row="${row.id}" data-patient-id="${patient.id}" data-hour="${current}"` : ""}>${row.label}</th>
                    ${chartHours
                      .map((hour) => {
                        const item = entries.find((entryItem) => entryItem.rowId === row.id && entryItem.hour === hour);
                        const cellOrders = patientOrders.filter((order) => order.row.id === row.id && order.hour === hour);
                        const selected = patient.id === state.patientId && row.id === state.rowId && hour === state.hour;
                        return `
                          <td class="${hour === current ? "now" : ""}">
                            <button class="cell ${item || cellOrders.length ? "filled" : ""} ${selected ? "selected" : ""}" data-action="select-cell" data-patient-id="${patient.id}" data-row-id="${row.id}" data-hour="${hour}" ${measureModeForRow(row.id) ? `data-measure-row="${row.id}"` : ""} aria-label="${row.label} ${formatTimeLabel(hour)}">
                              ${item ? `<strong>${item.value}</strong><small>${item.staff}</small>` : ""}
                              ${cellOrders.map((order) => `<em class="cell-order">${escapeAttr(order.title)}</em>`).join("")}
                            </button>
                          </td>
                        `;
                      })
                      .join("")}
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </div>
      <div class="scroll-track"><span></span></div>
    </div>
  `;
}

function renderQuickInput(patient) {
  const row = rows.find((item) => item.id === state.rowId) || rows[0];
  const size = getQuickSize();
  const showKeypad = shouldShowKeypad(row.id);
  return `
    <form class="quick-panel ${showKeypad ? "keypad-ready" : "no-keypad"}" data-form="entry" style="--quick-sheet-height: ${size.sheetHeight}vh">
      <input type="hidden" name="patientId" value="${patient.id}" />
      <div class="quick-head">
        <div>
          <strong>차트 바로 등록</strong>
              <span>${row.label} · ${formatTimeLabel(state.hour)} · 셀 길게 눌러 열기</span>
        </div>
        <div class="quick-head-actions">
          <button type="button" data-action="clear-cell">초기화</button>
        </div>
      </div>
      ${state.entrySaveNotice ? `<p class="entry-save-notice">${state.entrySaveNotice}</p>` : ""}
      <div class="quick-fields">
        <label>
          <span>항목</span>
          <select name="rowId">${rows.map((item) => `<option value="${item.id}" ${item.id === row.id ? "selected" : ""}>${item.label}</option>`).join("")}</select>
        </label>
        <label>
          <span>시간</span>
          <select name="hour">${hours(patient).map((hour) => `<option value="${hour}" ${hour === state.hour ? "selected" : ""}>${formatTimeLabel(hour)}</option>`).join("")}</select>
        </label>
        <label>
          <span>결과</span>
          ${clearableControl(`<textarea name="value" placeholder="${row.placeholder} 또는 특이사항 메모" autocomplete="off" required></textarea>`)}
        </label>
        <label>
          <span>작성자</span>
          ${clearableControl(`<input name="staff" value="${escapeAttr(patient.doctor)}" />`, patient.doctor)}
        </label>
      </div>
      ${renderEntryPresets(row.id)}
      ${showKeypad ? renderQuickKeypad() : ""}
      <button class="quick-save-wide" type="submit">기록 저장</button>
    </form>
  `;
}

function renderQuickLauncher(patient) {
  const row = rows.find((item) => item.id === state.rowId) || rows[0];
  const size = getQuickSize();
  return `
    <aside class="quick-launcher" style="--quick-launcher-width: ${size.launcherWidth}px">
      <span>선택 위치</span>
      <strong>${row.label} · ${formatTimeLabel(state.hour)}</strong>
      <div class="quick-launcher-controls" aria-label="빠른입력 메뉴 크기">
        <button type="button" data-action="resize-quick" data-delta="-1" aria-label="빠른입력 작게">‹</button>
        <small>${size.label}</small>
        <button type="button" data-action="resize-quick" data-delta="1" aria-label="빠른입력 크게">›</button>
      </div>
      <button type="button" data-action="open-quick">빠른입력 열기</button>
      <small>#${patient.chartNo} ${patient.name}</small>
    </aside>
  `;
}

function renderTaskCards(patient) {
  const entries = entriesFor(patient.id);
  const taskRows = rows.filter((row) => !["weight", "temp", "bp", "pulse", "resp"].includes(row.id));
  return `
    <div class="task-grid">
      ${taskRows
        .map((row) => {
          const count = entries.filter((item) => item.rowId === row.id).length;
          return `
            <article class="task-card">
              <h2>${row.label}</h2>
              <span class="chart-no">#${patient.chartNo}</span>
              <p>${patient.name} (${patient.guardian})</p>
              <small>${patient.species} / ${patient.breed} / ${patient.age}</small>
              <em>${count ? `${count}회 기록` : "미기록"}</em>
              <button data-action="select-cell" data-patient-id="${patient.id}" data-row-id="${row.id}" data-hour="${currentTimeSlot(chartIntervalForPatient(patient))}">진행하기 ›</button>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderTasksScreen() {
  const patient = activePatient();
  const tasks = filteredTasks();
  return `
    ${renderStatusTabs()}
    ${renderFilters()}
    ${renderShiftSummary(patient)}
    ${renderZeroMissPanel(tasks)}
    ${renderChartCopyTools(patient)}
    ${renderOrderComposer(patient)}
    ${renderHandoffPanel(patient)}
    <section class="menu-screen tasks-screen">
      <div class="screen-toolbar">
        <strong>총 ${tasks.length}건</strong>
        <div>
          <button class="${state.view === "cards" ? "active" : ""}" data-action="set-view" data-value="cards">간단히 보기</button>
          <button class="${state.view !== "cards" ? "active" : ""}" data-action="set-view" data-value="chart">시간대 별</button>
          <button data-action="open-order-settings" ${canManageClinical() ? "" : "disabled"}>To do 설정</button>
        </div>
      </div>
      ${canManageClinical() ? "" : `<p class="permission-note">환자 수정, 오더 생성, 검사 입력은 수의사 권한에서만 가능합니다. 테크니션은 기록과 완료 체크를 사용할 수 있습니다.</p>`}
      ${tasks.length ? `<div class="work-list">${tasks.map(renderWorkCard).join("")}</div>` : renderEmptyState("완료할 업무가 없습니다", "모든 업무가 완료되었습니다!")}
    </section>
  `;
}

function renderHandoffPanel(patient) {
  const notes = clinicalRecords("handoff");
  return `
    <section class="order-composer handoff-panel" aria-label="인수인계 노트">
      <header>
        <div>
          <span>Handoff</span>
          <strong>인수인계 노트</strong>
        </div>
      </header>
      <form class="order-form" data-form="clinical-record" data-record-type="handoff">
        <label>
          <span>환자</span>
          <select name="patientId">
            ${activePatientsList().map((item) => `<option value="${item.id}" ${item.id === patient.id ? "selected" : ""}>#${item.chartNo} ${item.name}</option>`).join("")}
          </select>
        </label>
        <label class="order-form-wide">
          <span>인수인계</span>
          ${clearableControl(`<input name="summary" placeholder="예: 21시 혈압 재확인, 보호자 오전 연락" required />`)}
        </label>
        <button class="primary-action" type="submit">노트 추가</button>
      </form>
      ${state.clinicalNotice ? `<p class="entry-save-notice">${state.clinicalNotice}</p>` : ""}
      ${renderClinicalList(notes, "등록된 인수인계가 없습니다.")}
    </section>
  `;
}

function renderWorkCard(task) {
  if (task.kind === "order") return renderOrderTaskCard(task);
  return `
    <article class="work-card ${task.done ? "done" : ""}">
      <div>
        <strong>${task.row.label}</strong>
        <span>#${task.patient.chartNo}</span>
        <h2>${task.patient.name} (${task.patient.guardian})</h2>
        <p>${task.patient.species} / ${task.patient.breed} / ${task.patient.age} / ${task.patient.sex}</p>
      </div>
      <footer>
        <small>지정: ${task.assignee}</small>
        <button data-action="select-cell" data-patient-id="${task.patient.id}" data-row-id="${task.row.id}" data-hour="${task.hour}">
          ${task.done ? "수정하기" : "진행하기"} ›
        </button>
      </footer>
    </article>
  `;
}

function renderOrderComposer(patient) {
  const orderPatient = patients.find((item) => item.id === (state.orderDraftPatientId || patient.id)) || patient;
  const orderCurrent = currentTimeSlot(chartIntervalForPatient(orderPatient));
  const orderRowId = rows.find((row) => row.id === state.orderDraftRowId)?.id || "diet";
  return `
    <section class="order-composer" aria-label="오더 생성">
      <header>
        <div>
          <span>Orders</span>
          <strong>오더 / To-do</strong>
        </div>
        <button type="button" data-action="toggle-order-form" ${canManageClinical() ? "" : "disabled"}>${state.orderFormOpen ? "닫기" : "오더 생성"}</button>
      </header>
      ${state.orderSaveNotice ? `<p class="entry-save-notice">${state.orderSaveNotice}</p>` : ""}
      ${
        state.orderFormOpen
          ? `
            <form class="order-form" data-form="order">
              <label>
                <span>환자</span>
                <select name="orderPatientId">
                  ${activePatientsList().map((item) => `<option value="${item.id}" ${item.id === orderPatient.id ? "selected" : ""}>#${item.chartNo} ${item.name}</option>`).join("")}
                </select>
              </label>
              <label>
                <span>시간</span>
                <select name="orderHour">
                  ${hours(orderPatient).map((hour) => `<option value="${hour}" ${hour === orderCurrent ? "selected" : ""}>${formatTimeLabel(hour)}</option>`).join("")}
                </select>
              </label>
              <label>
                <span>담당</span>
                <select name="orderAssignee">
                  <option>수의사</option>
                  <option>테크니션</option>
                  <option>식이</option>
                </select>
              </label>
              <label>
                <span>차트 항목</span>
                <select name="orderRowId">
                  ${rows.map((row) => `<option value="${row.id}" ${row.id === orderRowId ? "selected" : ""}>${row.label}</option>`).join("")}
                </select>
              </label>
              ${renderOrderPresets(orderRowId)}
              <label class="order-form-wide">
                <span>오더</span>
                ${clearableControl(`<input name="orderTitle" placeholder="예: 항생제 IV, 혈압 재측정" autocomplete="off" required />`)}
              </label>
              <label class="order-form-wide">
                <span>메모</span>
                ${clearableControl(`<textarea name="orderNote" placeholder="용량, 주의사항, 보호자 안내 등"></textarea>`)}
              </label>
              <button class="primary-action" type="submit" ${canManageClinical() ? "" : "disabled"}>오더 추가</button>
            </form>
          `
          : ""
      }
    </section>
  `;
}

function renderOrderPresets(rowId) {
  const presets = presetsForRow(rowId);
  return `
    <div class="entry-presets order-presets" aria-label="오더 추천">
      ${orderPresetButtons(rowId)}
    </div>
  `;
}

function orderPresetButtons(rowId) {
  return presetsForRow(rowId)
    .map(([value, label]) => `<button type="button" data-action="order-preset" data-value="${escapeAttr(value)}">${label}</button>`)
    .join("");
}

function renderClinicalList(items, emptyText) {
  if (!items.length) return `<p class="clinical-empty">${emptyText}</p>`;
  return `
    <ul class="clinical-list">
      ${items
        .slice(0, 5)
        .map(
          (item) => `
            <li>
              <strong>${item.title || item.summary}</strong>
              <span>${item.staff} · ${compactTimestamp(item.createdAt)}</span>
              <button data-action="delete-clinical-record" data-record-id="${item.id}" ${canManageClinical() ? "" : "disabled"}>삭제</button>
            </li>
          `
        )
        .join("")}
    </ul>
  `;
}

function renderOrderTaskCard(task) {
  const status = orderStatus(task.id);
  return `
    <article class="work-card order-task ${status.done ? "done" : ""}">
      <div>
        <strong>${task.title}</strong>
        <span>#${task.patient.chartNo} · ${formatTimeLabel(task.hour)}</span>
        <h2>${task.patient.name} (${task.patient.guardian})</h2>
        <p>${task.row.label} · 지정: ${task.assignee}</p>
        ${task.note ? `<p>${task.note}</p>` : ""}
      </div>
      <footer>
        <small>${status.done ? `${status.staff} 완료` : "미완료"}</small>
        <button data-action="delete-order" data-order-id="${task.id}" ${canManageClinical() ? "" : "disabled"}>삭제</button>
        <button data-action="toggle-order-done" data-order-id="${task.id}">
          ${status.done ? "되돌리기" : "완료 체크"} ›
        </button>
      </footer>
    </article>
  `;
}

function renderQuickScreen(patient) {
  finishBpmMeasureIfNeeded();
  const measure = currentBpmMeasure();
  const modeLabel = state.bpmMode === "resp" ? "호흡수" : "심박수";
  const modeUnit = state.bpmMode === "resp" ? "RPM" : "BPM";
  const row = rows.find((item) => item.id === state.rowId) || rows[0];
  return `
    <section class="quick-page menu-screen">
      <div class="quick-clock">
        <strong>${periodLabel(currentHour)} ${hour12(currentHour)}</strong>
        <button class="plain-icon" data-action="open-notifications" aria-label="알림">♢</button>
      </div>
      <div class="bpm-card">
        <div class="bpm-tabs">
          <button class="${state.bpmMode !== "resp" ? "active" : ""}" data-action="set-bpm-mode" data-value="pulse">심박수</button>
          <button class="${state.bpmMode === "resp" ? "active" : ""}" data-action="set-bpm-mode" data-value="resp">호흡수</button>
          <button data-action="reset-bpm">초기화</button>
        </div>
        ${state.bpmReturn ? `<div class="bpm-target">#${patient.chartNo} ${patient.name} · ${modeLabel} · ${formatTimeLabel(state.bpmReturn.hour)} 자동입력</div>` : ""}
        <button class="bpm-pad ${measure.active ? "measuring" : ""} ${measure.result !== null ? "done" : ""}" type="button" data-action="tap-bpm">
          <strong>${measure.result !== null ? `${measure.result}` : modeUnit}</strong>
          <span>${bpmPadLabel(measure, modeLabel)}</span>
        </button>
        <div class="bpm-meter">
          <span style="--progress: ${measure.progress}%"></span>
        </div>
        <div class="bpm-readout">
          <p>${measure.active ? `${measure.remaining}초 남음` : measure.result !== null ? `10초 ${measure.taps}회 → 1분 ${measure.result}${modeUnit}` : "측정 준비"}</p>
          <p>탭 ${measure.taps}회</p>
        </div>
        ${measure.result !== null && !state.bpmReturn ? `<button class="bpm-save" data-action="save-bpm-result">${modeLabel} 차트에 저장</button>` : ""}
      </div>
      <form class="quick-entry-card" data-form="entry">
        <input type="hidden" name="patientId" value="${patient.id}" />
        <input type="hidden" name="rowId" value="${row.id}" />
        <input type="hidden" name="hour" value="${currentTimeSlot(chartIntervalForPatient(patient))}" />
        <div class="quick-search">
          <span>▣</span>
          ${clearableControl(`<textarea name="value" placeholder="결과/완료/메모 입력" autocomplete="off" required></textarea>`)}
        </div>
        ${state.entrySaveNotice ? `<p class="entry-save-notice">${state.entrySaveNotice}</p>` : ""}
        <div class="quick-entry-layout">
          <div class="quick-row-picker">
            ${rows
              .filter((item) => item.quick)
              .map(
                (item, index) => `
                  <button type="button" class="${item.id === row.id ? "active" : ""}" data-action="select-quick-row" data-row-id="${item.id}">
                    ${index + 1}. ${item.label}
                  </button>
                `
              )
              .join("")}
          </div>
          ${showKeypad ? renderQuickKeypad() : `<button class="quick-save-wide" type="submit">기록 저장</button>`}
        </div>
      </form>
      <label class="patient-search">
        <input name="search" value="${state.search || ""}" placeholder="환자 선택 / 차트 번호 입력" autocomplete="off" />
        <span>⌕</span>
      </label>
      <div class="quick-patient-strip">${filteredPatients().map(renderMiniPatientButton).join("")}</div>
    </section>
  `;
}

function renderQuickKeypad() {
  return `
    <div class="keypad">
      ${["1", "2", "3", "4", "5", "6", "7", "8", "9", "dot", "0"]
        .map((key) => `<button type="button" data-action="append" data-value="${key}">${key === "dot" ? "-/+." : key}</button>`)
        .join("")}
      <button class="save" type="submit">기록 저장</button>
    </div>
  `;
}

function shouldShowKeypad(rowId) {
  return ["weight", "temp", "bp", "pulse", "resp"].includes(rowId);
}

function presetsForRow(rowId) {
  const presetMap = {
    weight: [],
    temp: [["정상", "정상"], ["발열", "발열"]],
    bp: [],
    pulse: [],
    resp: [["P(헐떡임)", "P"], ["SRR(숙면중 호흡수)", "SRR"]],
    vomit: [["구토 없음", "구토 없음"], ["구토 1회", "구토 1회"], ["거품토", "거품토"], ["사료토", "사료토"]],
    feces: [["설사", "설사"], ["정상변", "정상변"], ["혈변", "혈변"], ["점액변", "점액변"], ["변비", "변비"]],
    urine: [["정상뇨", "정상뇨"], ["혈뇨", "혈뇨"], ["황달뇨", "황달뇨"], ["배뇨 없음", "배뇨 없음"]],
    diet: [["강급", "강급"], ["핸드피딩", "핸드피딩"], ["잘먹음", "잘먹음"], ["식욕감소", "식욕감소"]],
    water: [["수액 유지", "수액 유지"], ["라인 확인", "라인 확인"], ["FRI", "FRI"]],
    cerenia: [["완료", "완료"]],
    urinary: [["압박배뇨 완료", "완료"], ["자발배뇨", "자발배뇨"], ["배뇨 없음", "배뇨 없음"]],
    guardian: [["완료", "완료"]]
  };
  return presetMap[rowId] ?? [["완료", "완료"], ["보류", "보류"]];
}

function renderEntryPresets(rowId) {
  const presets = presetsForRow(rowId);
  if (!presets.length) return "";
  return `
    <div class="entry-presets quick-entry-presets" aria-label="빠른 선택">
      ${presets
        .map(([value, label]) => `<button type="button" data-action="entry-preset" data-value="${escapeAttr(value)}">${label}</button>`)
        .join("")}
    </div>
  `;
}

function rowLabel(rowId) {
  return rows.find((row) => row.id === rowId)?.label || "차트";
}

function renderWardScreen() {
  const wards = wardStats();
  const wardView = state.wardView || "all";
  const sortBoards = [
    ["중요도순", wardSortedPatients("importance")],
    ["입원일순", wardSortedPatients("admit")],
    ["차트번호순", wardSortedPatients("chartNo")]
  ];
  return `
    <section class="menu-screen ward-screen">
      <div class="screen-toolbar">
        <strong>입원실 현황</strong>
        <div>
          <button class="${wardView === "all" ? "active" : ""}" data-action="set-ward-view" data-value="all">전체</button>
          <button class="${wardView === "icu" ? "active" : ""}" data-action="set-ward-view" data-value="icu">ICU</button>
        </div>
      </div>
      <div class="ward-pos-grid" aria-label="입원장 자리표">
        ${wards
          .map(
            (ward) => `
              <article class="ward-seat ${ward.patients.length ? "occupied" : "empty"}">
                <header>
                  <strong>${ward.name}</strong>
                  <span>${ward.patients.length ? `${ward.patients.length}명` : "빈 자리"}</span>
                </header>
                <div>
                  ${
                    ward.patients.length
                      ? ward.patients.map((patient) => renderWardSeatPatient(patient)).join("")
                      : `<span class="empty-seat">배정 대기</span>`
                  }
                </div>
              </article>
            `
          )
          .join("")}
      </div>
      <div class="ward-sort-board" aria-label="정렬 비교">
        ${sortBoards
          .map(
            ([label, items]) => `
              <section>
                <header>${label}</header>
                ${items.map((patient, index) => renderWardSortItem(patient, index + 1)).join("")}
              </section>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderWardSeatPatient(patient) {
  return `
    <button data-action="select-patient" data-id="${patient.id}">
      ${renderPatientAvatar(patient, "seat")}
      <strong>${patient.name}</strong>
      <small>${patient.doctor}</small>
      <em>${patient.importance === "high" ? "중요" : "보통"} · 입원 ${patient.admitDay}일차</em>
    </button>
  `;
}

function renderWardSortItem(patient, rank) {
  return `
    <button data-action="select-patient" data-id="${patient.id}">
      <span>${rank}</span>
      <strong>#${patient.chartNo} ${patient.name}</strong>
      <small>${patient.ward}</small>
    </button>
  `;
}

function renderMoreScreen() {
  const summary = taskSummary();
  const patient = activePatient();
  return `
    <section class="menu-screen more-screen">
      <div class="profile-card">
        <strong>데모수의사B</strong>
        <span>${userRoleLabel()} · 오늘 ${summary.done}/${summary.total}건 완료</span>
      </div>
      ${renderPlatformCards()}
      ${renderWardSettingsPanel()}
      ${renderAutoCalcPanel(patient)}
      <div class="role-switch">
        <button class="${state.userRole !== "tech" ? "active" : ""}" data-action="set-user-role" data-value="vet">수의사</button>
        <button class="${state.userRole === "tech" ? "active" : ""}" data-action="set-user-role" data-value="tech">테크니션</button>
      </div>
      <div class="more-list">
        <button data-action="set-section" data-value="chart"><span>▤</span>차트로 이동</button>
        <button data-action="set-section" data-value="tasks"><span>☑</span>내 업무 보기</button>
        <button data-action="reset-demo"><span>↺</span>데모 데이터 초기화</button>
        <button data-action="logout"><span>↪</span>로그아웃</button>
      </div>
    </section>
  `;
}

function renderWardSettingsPanel() {
  const locations = wardLocations();
  return `
    <section class="tool-panel ward-settings" aria-label="입원장 설정">
      <header>
        <span>Ward Setup</span>
        <strong>입원장 설정</strong>
      </header>
      <form class="ward-settings-form" data-form="ward-location">
        <input name="wardLocation" placeholder="예: 고양이 ICU-3" autocomplete="off" />
        <button type="submit">추가</button>
      </form>
      ${state.wardSettingsNotice ? `<p class="entry-save-notice">${state.wardSettingsNotice}</p>` : ""}
      <div class="ward-settings-list">
        ${locations
          .map((ward) => {
            const patientCount = patients.filter((patient) => patient.ward === ward).length;
            return `
              <article>
                <div>
                  <strong>${ward}</strong>
                  <span>${patientCount}명 배정</span>
                </div>
                <button type="button" data-action="remove-ward-location" data-value="${ward}" ${patientCount ? "disabled" : ""}>삭제</button>
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderRealtimeStrip() {
  const users = state.realtimeUsers?.length ? state.realtimeUsers : realtimeUsers;
  return `
    <section class="realtime-strip" aria-label="실시간 접속 상태">
      <div>
        <strong>실시간 동기화</strong>
        <span>${users.length}명 접속 · 방금 업데이트</span>
      </div>
      <ul>
        ${users.map((user) => `<li><b>${user.name}</b><span>${user.section}</span></li>`).join("")}
      </ul>
    </section>
  `;
}

function renderPlatformCards() {
  const summary = taskSummary();
  const users = state.realtimeUsers?.length ? state.realtimeUsers : realtimeUsers;
  return `
    <section class="platform-grid" aria-label="VetCrew 핵심 기능">
      <article>
        <span>Realtime Access</span>
        <strong>${users.length}명 동시 접속</strong>
      </article>
      <article>
        <span>Zero Miss</span>
        <strong>${summary.todo}건 추적 중</strong>
      </article>
      <article>
        <span>Flow First</span>
        <strong>빠른입력 1단계</strong>
      </article>
    </section>
  `;
}

function renderZeroMissPanel(tasks) {
  const delayed = tasks.filter((task) => task.status === "delayed").length;
  const pending = tasks.filter((task) => !task.done).length;
  const done = tasks.filter((task) => task.done).length;
  return `
    <section class="zero-miss-panel" aria-label="처치 누락 방지">
      <div>
        <span>처치 누락 방지</span>
        <strong>${pending ? `${pending}건 확인 필요` : "누락 없음"}</strong>
      </div>
      <dl>
        <div><dt>지연</dt><dd>${delayed}</dd></div>
        <div><dt>완료</dt><dd>${done}</dd></div>
        <div><dt>기록자</dt><dd>자동</dd></div>
      </dl>
    </section>
  `;
}

function renderAutoCalcPanel(patient) {
  const weight = Number(state.calcWeight || parseWeight(patient.weight) || 0);
  const doseMpk = Number(state.calcDoseMpk || 0);
  const concentration = Number(state.calcConcentration || 0);
  const hours = Number(state.calcFluidHours || 24);
  const doseMl = weight > 0 && doseMpk > 0 && concentration > 0 ? (weight * doseMpk) / concentration : 0;
  const fluidDay = weight > 0 ? weight * 50 : 0;
  const fluidRate = fluidDay > 0 && hours > 0 ? fluidDay / hours : 0;
  return `
    <section class="tool-panel" aria-label="자동 약물 수액 계산">
      <header>
        <span>Auto Calc</span>
        <strong>자동 약물·수액 계산</strong>
      </header>
      <div class="calc-grid">
        <label>
          <span>체중 kg</span>
          <input name="calcWeight" data-calc-field inputmode="decimal" value="${state.calcWeight || parseWeight(patient.weight) || ""}" />
        </label>
        <label>
          <span>용량 mg/kg</span>
          <input name="calcDoseMpk" data-calc-field inputmode="decimal" value="${state.calcDoseMpk || ""}" />
        </label>
        <label>
          <span>농도 mg/ml</span>
          <input name="calcConcentration" data-calc-field inputmode="decimal" value="${state.calcConcentration || ""}" />
        </label>
        <label>
          <span>수액 시간</span>
          <input name="calcFluidHours" data-calc-field inputmode="numeric" value="${state.calcFluidHours || "24"}" />
        </label>
      </div>
      <div class="calc-results">
        <output>약물 ${formatNumber(doseMl)} ml</output>
        <output>수액 ${formatNumber(fluidRate)} ml/hr</output>
      </div>
    </section>
  `;
}

function renderEmptyState(title, text) {
  return `
    <div class="empty-state">
      <strong>${title}</strong>
      <p>${text}</p>
    </div>
  `;
}

function renderMiniPatientButton(patient) {
  return `
    <button class="${patient.id === state.patientId ? "active" : ""}" data-action="select-quick-patient" data-id="${patient.id}">
      ${renderPatientAvatar(patient, "mini")}
      <span>#${patient.chartNo}</span>${patient.name}
    </button>
  `;
}

function copyPreviousChart() {
  if (!canManageTodo()) {
    state.chartCopyNotice = "수의사 권한에서만 차트복사가 가능합니다.";
    return;
  }
  const targetDate = selectedDateKey();
  const sourceDate = shiftDateKey(targetDate, -1);
  const patientIds = [state.patientId];
  const sourceEntries = state.entries.filter(
    (item) => patientIds.includes(item.patientId) && entryDateKey(item) === sourceDate
  );
  if (!sourceEntries.length) {
    state.chartCopyNotice = `${formatHeaderDate(sourceDate)}에 복사할 기록이 없습니다.`;
    return;
  }
  const deleteTargets = state.entries.filter((item) =>
    sourceEntries.some(
        (source) =>
          item.patientId === source.patientId &&
          item.rowId === source.rowId &&
          item.hour === source.hour &&
          entryDateKey(item) === targetDate
      )
  );
  const copiedEntries = sourceEntries.map((item) => ({
      ...item,
      id: `copy_${targetDate}_${item.patientId}_${item.rowId}_${item.hour}_${Date.now()}`,
      dateKey: targetDate,
      copiedFromDate: sourceDate,
      writtenAt: new Date().toISOString()
    }));
  state.entries = state.entries.filter((item) => !deleteTargets.some((target) => entryKey(item) === entryKey(target)));
  state.entries.push(...copiedEntries);
  syncBatchEntries(deleteTargets, copiedEntries);
  state.chartCopyNotice = `${sourceEntries.length}개 기록을 ${formatHeaderDate(targetDate)}로 복사했습니다.`;
}

function canManageTodo() {
  return (state.userRole || "vet") === "vet";
}

function canManageClinical() {
  return canManageTodo();
}

function userRoleLabel() {
  return canManageTodo() ? "수의사" : "테크니션";
}

function clinicalRecords(kind, patientId = "") {
  return (state.clinicalRecords || [])
    .filter((record) => record.kind === kind && (!patientId || record.patientId === patientId) && entryDateKey(record) === selectedDateKey())
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
}

function mergeClinicalRecords(currentRecords, incomingRecords) {
  const merged = [...currentRecords];
  incomingRecords.filter(isClinicalRecordLike).forEach((incoming) => {
    const index = merged.findIndex((record) => record.id === incoming.id);
    if (index >= 0) {
      merged[index] = { ...merged[index], ...incoming };
    } else {
      merged.push(incoming);
    }
  });
  return merged;
}

function isClinicalRecordLike(record) {
  return record && typeof record === "object" && record.id && record.kind && record.patientId;
}

function buildClinicalRecordFromForm(data, kind) {
  const patientId = String(data.get("patientId") || state.patientId || "").trim();
  if (!patientId) return { ok: false, error: "환자를 선택해주세요." };
  if (kind !== "handoff" && !canManageClinical()) return { ok: false, error: "수의사 권한에서만 입력할 수 있습니다." };
  const summary = String(data.get("summary") || "").trim();
  const testName = String(data.get("testName") || "").trim();
  const value = String(data.get("value") || "").trim();
  if (kind === "lab" && (!testName || !value)) return { ok: false, error: "검사항목과 결과를 입력해주세요." };
  if (kind !== "lab" && !summary) return { ok: false, error: "내용을 입력해주세요." };
  const title = kind === "lab" ? `${testName}: ${value}` : summary;
  return {
    ok: true,
    notice: kind === "handoff" ? "인수인계 노트 추가" : kind === "guardian" ? "보호자 업데이트 기록" : "검사 결과 추가",
    record: {
      id: `c_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
      kind,
      patientId,
      title,
      summary: kind === "lab" ? String(data.get("note") || "").trim() : summary,
      testName,
      value,
      dateKey: selectedDateKey(),
      staff: currentPresence().name,
      createdAt: new Date().toISOString()
    }
  };
}

function vitalTrendPoints(patientId) {
  const values = entriesFor(patientId)
    .filter((item) => item.rowId === "bp")
    .map((item) => ({ hour: Number(item.hour), value: Number.parseFloat(item.value) }))
    .filter((item) => Number.isFinite(item.value))
    .sort((a, b) => a.hour - b.hour);
  if (!values.length) return [];
  const max = Math.max(...values.map((item) => item.value), 1);
  return values.map((item) => ({ ...item, percent: Math.max(12, Math.round((item.value / max) * 100)) }));
}

function compactTimestamp(value) {
  const date = new Date(value || Date.now());
  if (Number.isNaN(date.getTime())) return "-";
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function patientStayLabel(patient, options = {}) {
  const admit = options.compact ? compactDate(patient.admitDate || patient.date) : patient.admitDate || patient.date || "-";
  const surgery = patient.surgeryDate
    ? options.compact
      ? compactDate(patient.surgeryDate)
      : patient.surgeryDate
    : options.compact
      ? "-"
      : "수술 없음";
  return `입원${options.compact ? "" : "일"} ${admit} · 수술${options.compact ? "" : "일"} ${surgery}`;
}

function compactDate(value) {
  const match = String(value || "").match(/^(\d{4})[.-](\d{1,2})[.-](\d{1,2})$/);
  if (!match) return value || "-";
  return `${Number(match[2])}/${Number(match[3])}`;
}

function activePatient() {
  return patients.find((patient) => patient.id === state.patientId) || patients[0];
}

function buildPatientFromForm(data, existingPatient = null) {
  const prefix = existingPatient ? "edit" : "new";
  const read = (field) => String(data.get(`${prefix}${field}`) || "").trim();
  const chartNo = read("ChartNo");
  const name = read("Name");
  const doctor = read("Doctor");
  if (!chartNo || !name || !doctor) return { ok: false, error: "차트번호, 환자명, 담당의는 필수입니다." };
  if (patients.some((patient) => patient.chartNo === chartNo && patient.id !== existingPatient?.id)) {
    return { ok: false, error: `#${chartNo} 차트번호가 이미 있습니다.` };
  }
  const admitDate = normalizeDisplayDate(read("AdmitDate") || selectedDateKey());
  const admitDay = calculateAdmitDay(admitDate);
  const ward = read("Ward") || wardLocations()[0] || "-";
  const importance = read("Importance") || "normal";
  const chartInterval = chartIntervalForValue(read("ChartInterval"), importance);
  const patient = normalizePatient({
    ...(existingPatient || {}),
    id: existingPatient?.id || `p_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
    chartNo,
    name,
    guardian: read("Guardian") || "-",
    photoUrl: read("PhotoUrl"),
    species: read("Species") || "기타",
    breed: read("Breed") || "-",
    age: read("Age") || "-",
    sex: read("Sex") || "미상",
    ward,
    admitDay,
    weight: read("Weight"),
    cc: read("Cc") || "입원 관리",
    dx: read("Dx") || "초진/입원 경과 관찰",
    doctor,
    status: existingPatient?.status || "current",
    importance,
    chartInterval,
    room: "-",
    date: admitDate,
    admitDate,
    surgeryDate: read("SurgeryDate") ? normalizeDisplayDate(read("SurgeryDate")) : "",
    tags: [`입원 ${admitDay}일차`, ward, importance === "high" ? "중요" : "일반"]
  });
  return { ok: true, patient };
}

function buildOrderFromForm(data) {
  const patientId = String(data.get("orderPatientId") || "").trim();
  const title = String(data.get("orderTitle") || "").trim();
  if (!patientId || !title) return { ok: false, error: "환자와 오더 내용은 필수입니다." };
  return {
    ok: true,
    order: {
      id: `o_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
      patientId,
      title,
      rowId: String(data.get("orderRowId") || "guardian"),
      hour: Number(data.get("orderHour") || currentHour),
      assignee: String(data.get("orderAssignee") || "수의사"),
      note: String(data.get("orderNote") || "").trim(),
      dateKey: selectedDateKey(),
      createdBy: currentPresence().name,
      createdAt: new Date().toISOString()
    }
  };
}

function calculateAdmitDay(admitDate) {
  const admit = parseDateKey(admitDate);
  const selected = parseDateKey(selectedDateKey());
  if (!admit || !selected) return 1;
  const elapsed = Math.floor((selected - admit) / 86400000) + 1;
  return Math.max(1, elapsed);
}

function normalizeDisplayDate(value) {
  const parsed = parseDateKey(value);
  if (!parsed) return String(value || "").replaceAll("-", ".");
  return dateToKey(parsed).replaceAll("-", ".");
}

function dateInputValue(value) {
  const parsed = parseDateKey(value);
  return parsed ? dateToKey(parsed) : "";
}

function escapeAttr(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function activePatientsList() {
  return patients.filter((patient) => patient.status !== "discharged");
}

function filteredPatients() {
  return activePatientsList().filter((patient) => {
    const query = String(state.search || "").trim().toLowerCase();
    const statusOk =
      state.status === "current" ||
      state.status === "planned" ||
      state.status === "done" ||
      patient.status === state.status;
    const speciesOk =
      state.species === "all" ||
      (state.species === "cat" && patient.species === "고양이") ||
      (state.species === "dog" && patient.species === "개") ||
      (state.species === "other" && !["고양이", "개"].includes(patient.species));
    const wardOk = state.ward === "all" || patient.ward === state.ward;
    const queryOk =
      !query ||
      [patient.chartNo, patient.name, patient.guardian, patient.ward, patient.doctor]
        .join(" ")
        .toLowerCase()
        .includes(query);
    return statusOk && speciesOk && wardOk && queryOk;
  });
}

function filteredChartPatients() {
  return patients.filter((patient) => {
    const query = String(state.search || "").trim().toLowerCase();
    const species = state.chartSpecies || "all";
    const doctor = state.chartDoctor || "all";
    const statusFilter = state.patientStatusFilter || "active";
    const statusOk =
      statusFilter === "all" ||
      (statusFilter === "active" && patient.status !== "discharged") ||
      patient.status === statusFilter;
    const speciesOk =
      species === "all" ||
      (species === "cat" && patient.species === "고양이") ||
      (species === "dog" && patient.species === "개") ||
      (species === "other" && !["고양이", "개"].includes(patient.species));
    const doctorOk = doctor === "all" || patient.doctor === doctor;
    const queryOk =
      !query ||
      [patient.chartNo, patient.name, patient.guardian, patient.ward, patient.doctor]
        .join(" ")
        .toLowerCase()
        .includes(query);
    return statusOk && speciesOk && doctorOk && queryOk;
  });
}

function sortedChartPatients(items) {
  const importanceRank = { high: 0, normal: 1 };
  return [...items].sort((a, b) => {
    if (state.chartSort === "admit") return b.admitDay - a.admitDay || a.chartNo.localeCompare(b.chartNo);
    if (state.chartSort === "chartNo") return a.chartNo.localeCompare(b.chartNo);
    return (importanceRank[a.importance] ?? 2) - (importanceRank[b.importance] ?? 2) || b.admitDay - a.admitDay;
  });
}

function wardSortedPatients(sort) {
  const importanceRank = { high: 0, normal: 1 };
  return [...wardViewPatients()].sort((a, b) => {
    if (sort === "admit") return b.admitDay - a.admitDay || a.chartNo.localeCompare(b.chartNo);
    if (sort === "chartNo") return a.chartNo.localeCompare(b.chartNo);
    return (importanceRank[a.importance] ?? 2) - (importanceRank[b.importance] ?? 2) || b.admitDay - a.admitDay;
  });
}

function taskItems() {
  const chartTasks = activePatientsList().flatMap((patient) =>
    rows
      .filter((row) => !["weight", "temp", "bp", "pulse", "resp"].includes(row.id))
      .map((row, index) => {
        const hour = [1, 3, 5, 9, 13, 17, 21][index % 7];
        const done = Boolean(entriesFor(patient.id).find((item) => item.rowId === row.id));
        return {
          id: `${patient.id}_${row.id}`,
          patient,
          row,
          hour,
          done,
          status: done ? "done" : patient.status === "delayed" ? "delayed" : index % 3 === 0 ? "planned" : "current",
          assignee: row.tone === "feed" ? "식이" : "수의사"
        };
      })
  );
  return [...chartTasks, ...orderTaskItems()];
}

function orderTaskItems() {
  return (state.orders || [])
    .filter((order) => entryDateKey(order) === selectedDateKey())
    .map((order) => {
      const patient = patients.find((item) => item.id === order.patientId) || activePatient();
      const row = rows.find((item) => item.id === order.rowId) || rows[0];
      const status = orderStatus(order.id);
      const hour = Number(order.hour ?? currentHour);
      return {
        ...order,
        kind: "order",
        patient,
        row,
        hour,
        done: status.done,
        status: status.done ? "done" : hour < currentTimeValue() ? "delayed" : hour === currentTimeSlot(chartIntervalForPatient(patient)) ? "current" : "planned",
        assignee: order.assignee || "수의사"
      };
    });
}

function orderStatus(orderId) {
  return (state.orderStatuses || {})[orderId] || { done: false, staff: "", updatedAt: "" };
}

function filteredTasks() {
  const patientIds = new Set(filteredPatients().map((patient) => patient.id));
  return taskItems().filter((task) => {
    const statusOk = state.status === "current" ? !task.done && task.status === "current" : task.status === state.status;
    const roleOk =
      state.role === "all" ||
      (state.role === "vet" && task.assignee === "수의사") ||
      (state.role === "diet" && task.assignee === "식이") ||
      (state.role === "tech" && task.assignee === "테크니션");
    return patientIds.has(task.patient.id) && statusOk && roleOk;
  });
}

function statusCounts() {
  if (state.section === "tasks") {
    const items = taskItems();
    return {
      delayed: items.filter((item) => item.status === "delayed").length,
      current: items.filter((item) => item.status === "current").length,
      planned: items.filter((item) => item.status === "planned").length,
      done: items.filter((item) => item.status === "done").length
    };
  }
  return {
    delayed: patients.filter((item) => item.status === "delayed").length,
    current: patients.length,
    planned: 0,
    done: 0
  };
}

function taskSummary() {
  const items = taskItems();
  const done = items.filter((item) => item.done).length;
  return { total: items.length, done, todo: items.length - done };
}

function wardStats() {
  return [...wardViewLocations()].sort((a, b) => a.localeCompare(b, "ko-KR")).map((name) => {
    const wardPatients = wardViewPatients().filter((patient) => patient.ward === name);
    const total = wardPatients.length * rows.length;
    const done = wardPatients.reduce((sum, patient) => sum + entriesFor(patient.id).length, 0);
    return { name, patients: wardPatients, total, done };
  });
}

function wardViewLocations() {
  const locations = wardLocations();
  if ((state.wardView || "all") !== "icu") return locations;
  return locations.filter((ward) => ward.toLowerCase().includes("icu"));
}

function wardViewPatients() {
  const allowedWards = new Set(wardViewLocations());
  return activePatientsList().filter((patient) => allowedWards.has(patient.ward));
}

function startBpmMeasure() {
  state.bpmMeasure = {
    mode: state.bpmMode || "pulse",
    startedAt: Date.now(),
    taps: 0,
    result: null
  };
}

function resetBpmMeasure() {
  state.bpmMeasure = null;
  state.bpmReturn = null;
}

function clearLongPressTimer() {
  clearTimeout(longPressTimer);
  longPressTimer = null;
}

function openMeasureFromChart(target) {
  const rowId = target.dataset.measureRow;
  const mode = measureModeForRow(rowId);
  if (!mode) return;
  const patientId = target.dataset.patientId || state.patientId;
  const hour = Number(target.dataset.hour || currentHour);
  state.patientId = patientId;
  state.rowId = rowId;
  state.hour = hour;
  state.bpmMode = mode;
  state.bpmMeasure = null;
  state.bpmReturn = {
    patientId,
    rowId,
    hour,
    dateKey: selectedDateKey()
  };
  state.section = "quick";
  state.quickOpen = false;
  suppressClickUntil = Date.now() + 700;
  save();
  render();
}

function measureModeForRow(rowId) {
  if (rowId === "pulse") return "pulse";
  if (rowId === "resp") return "resp";
  return "";
}

function saveBpmResult(result, target = state.bpmReturn) {
  const rowId = target?.rowId || (state.bpmMode === "resp" ? "resp" : "pulse");
  const patientId = target?.patientId || state.patientId;
  const hour = Number(target?.hour ?? currentHour);
  const dateKey = target?.dateKey || selectedDateKey();
  state.rowId = rowId;
  state.patientId = patientId;
  state.hour = hour;
  state.entries = state.entries.filter(
    (item) =>
      !(
        item.patientId === patientId &&
        item.rowId === rowId &&
        item.hour === hour &&
        entryDateKey(item) === dateKey
      )
  );
  const nextEntry = {
    id: `e_${Date.now()}`,
    patientId,
    rowId,
    hour,
    value: String(result),
    staff: activePatient().doctor,
    dateKey,
    writtenAt: new Date().toISOString()
  };
  state.entries.push(nextEntry);
  syncUpsertEntry(nextEntry);
}

function currentBpmMeasure() {
  const raw = state.bpmMeasure;
  if (!raw || raw.mode !== (state.bpmMode || "pulse")) {
    return { active: false, taps: 0, remaining: 10, progress: 0, result: null };
  }
  const elapsed = Math.max(0, Date.now() - Number(raw.startedAt || 0));
  const remainingMs = Math.max(0, 10000 - elapsed);
  const result = raw.result || (elapsed >= 10000 ? Number(raw.taps || 0) * 6 : null);
  return {
    active: elapsed < 10000 && !raw.result,
    taps: Number(raw.taps || 0),
    remaining: Math.ceil(remainingMs / 1000),
    progress: Math.min(100, Math.round((elapsed / 10000) * 100)),
    result
  };
}

function finishBpmMeasureIfNeeded() {
  const measure = currentBpmMeasure();
  if (!state.bpmMeasure || measure.result === null || state.bpmMeasure.result !== null) return;
  state.bpmMeasure.result = measure.result;
  if (state.bpmReturn) {
    const patientId = state.bpmReturn.patientId;
    saveBpmResult(measure.result, state.bpmReturn);
    state.bpmMeasure = null;
    state.bpmReturn = null;
    openChartDetail(patientId, { replace: true });
  }
}

function bpmPadLabel(measure, modeLabel) {
  if (measure.active) return `${modeLabel}에 맞춰 계속 탭`;
  if (measure.result !== null) return "다시 측정하려면 탭";
  return "탭해서 10초 측정 시작";
}

function syncBpmTicker() {
  clearInterval(bpmTicker);
  bpmTicker = null;
  const measure = currentBpmMeasure();
  if (!state.authed || state.section !== "quick" || !measure.active) return;
  bpmTicker = setInterval(() => {
    finishBpmMeasureIfNeeded();
    save();
    render();
  }, 250);
}

function periodLabel(hour) {
  return hour >= 12 ? "PM" : "AM";
}

function hour12(hour) {
  const wholeHour = Math.floor(Number(hour) || 0);
  return wholeHour % 12 || 12;
}

function entriesFor(patientId) {
  const dateKey = selectedDateKey();
  return state.entries.filter((item) => item.patientId === patientId && entryDateKey(item) === dateKey);
}

function latestValue(patientId, rowId) {
  return entriesFor(patientId)
    .filter((item) => item.rowId === rowId)
    .sort((a, b) => b.hour - a.hour)[0]?.value || "";
}

function latestVitalSummary(patientId) {
  const vitalRows = ["bp", "temp", "resp"];
  const vitalEntries = entriesFor(patientId).filter((item) => vitalRows.includes(item.rowId));
  if (!vitalEntries.length) return "AM 12 : BP -, BT -, RR -";
  const latestHour = Math.max(...vitalEntries.map((item) => Number(item.hour)));
  const valueAt = (rowId) => vitalEntries.find((item) => item.rowId === rowId && Number(item.hour) === latestHour)?.value || "-";
  return `${periodLabel(latestHour)} ${hour12(latestHour)} : BP ${valueAt("bp")}, BT ${valueAt("temp")}, RR ${valueAt("resp")}`;
}

function parseWeight(value) {
  return Number.parseFloat(String(value || "").replace(/[^\d.]/g, "")) || 0;
}

function formatNumber(value) {
  if (!value) return "-";
  if (value >= 10) return value.toFixed(1).replace(/\.0$/, "");
  return value.toFixed(2).replace(/0$/, "").replace(/\.0$/, "");
}

function selectedDateKey() {
  return normalizeDateKey(state.chartDate || DEFAULT_DATE_KEY);
}

function normalizeDateKey(value) {
  const parsed = parseDateKey(value);
  return dateToKey(parsed || parseDateKey(DEFAULT_DATE_KEY));
}

function entryDateKey(item) {
  return normalizeDateKey(item.dateKey || DEFAULT_DATE_KEY);
}

function parseDateKey(value) {
  const match = String(value || "").match(/^(\d{4})[-.](\d{2})[-.](\d{2})$/);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function dateToKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function monthKeyFromDateKey(dateKey) {
  return normalizeDateKey(dateKey).slice(0, 7);
}

function normalizeMonthKey(value) {
  const match = String(value || "").match(/^(\d{4})[-.](\d{2})(?:[-.]\d{2})?$/);
  if (!match) return DEFAULT_DATE_KEY.slice(0, 7);
  return `${match[1]}-${match[2]}`;
}

function parseMonthKey(value) {
  const monthKey = normalizeMonthKey(value);
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

function shiftMonthKey(monthKey, delta) {
  const date = parseMonthKey(monthKey);
  date.setMonth(date.getMonth() + delta);
  return dateToKey(date).slice(0, 7);
}

function calendarDays(monthKey) {
  const first = parseMonthKey(monthKey);
  const cursor = new Date(first);
  cursor.setDate(1 - first.getDay());
  const todayKey = dateToKey(new Date());
  return Array.from({ length: 42 }, () => {
    const date = new Date(cursor);
    const key = dateToKey(date);
    const day = {
      date,
      key,
      inMonth: date.getMonth() === first.getMonth(),
      today: key === todayKey
    };
    cursor.setDate(cursor.getDate() + 1);
    return day;
  });
}

function shiftDateKey(dateKey, delta) {
  const date = parseDateKey(dateKey) || parseDateKey(DEFAULT_DATE_KEY);
  date.setDate(date.getDate() + delta);
  return dateToKey(date);
}

function formatHeaderDate(dateKey) {
  const parts = headerDateParts(dateKey);
  return `${parts.monthDay} (${parts.weekday})`;
}

function headerDateParts(dateKey) {
  const date = parseDateKey(dateKey) || parseDateKey(DEFAULT_DATE_KEY);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return {
    monthDay: `${date.getMonth() + 1}월 ${date.getDate()}일`,
    weekday: weekdays[date.getDay()],
    weekend: date.getDay() === 0 || date.getDay() === 6
  };
}

function clampQuickSize(value) {
  return Math.min(4, Math.max(1, Math.round(value)));
}

function getQuickSize() {
  const value = clampQuickSize(state.quickSize || 2);
  return {
    value,
    label: ["XS", "S", "M", "L"][value - 1],
    launcherWidth: [86, 116, 150, 184][value - 1],
    sheetHeight: [28, 36, 44, 54][value - 1]
  };
}

function labelWidthForSize(value) {
  return [108, 138, 172, 220][clampLabelSize(value) - 1];
}

function finishChartResize(event) {
  if (!chartResize || event.pointerId !== chartResize.pointerId) return;
  state.labelWidth = clampLabelWidth(state.labelWidth || chartResize.startWidth);
  document.body.classList.remove("resizing-chart");
  chartResize = null;
  save();
  render();
}

function finishChartPan(event) {
  if (chartPan && event.pointerId === chartPan.pointerId) {
    if (chartPan.moved) suppressClickUntil = Date.now() + 180;
    syncChartScrollTrack(chartPan.chart);
    chartPan = null;
  }
  if (chartTrackDrag && event.pointerId === chartTrackDrag.pointerId) {
    suppressClickUntil = Date.now() + 180;
    syncChartScrollTrack(chartTrackDrag.chart);
    chartTrackDrag = null;
  }
  clearLongPressTimer();
}

function syncChartScrollTrack(chart) {
  const shell = chart.closest(".chart-scroll-shell");
  const thumb = shell?.querySelector(".scroll-track span");
  if (!thumb) return;
  const maxScroll = chart.scrollWidth - chart.clientWidth;
  const ratio = chart.scrollWidth > 0 ? chart.clientWidth / chart.scrollWidth : 1;
  const width = Math.max(18, Math.min(100, ratio * 100));
  const left = maxScroll > 0 ? (chart.scrollLeft / maxScroll) * (100 - width) : 0;
  thumb.style.width = `${width}%`;
  thumb.style.marginLeft = `${left}%`;
}

function syncChartScrollTracks() {
  document.querySelectorAll(".chart-wrap").forEach(syncChartScrollTrack);
}

function clampLabelSize(value) {
  return Math.min(4, Math.max(1, Math.round(value)));
}

function clampLabelWidth(value) {
  return Math.min(320, Math.max(96, Math.round(value)));
}

function getLabelSize(forcedValue) {
  const value = clampLabelSize(forcedValue || state.labelSize || 2);
  const presetWidth = labelWidthForSize(value);
  return {
    value,
    label: ["XS", "S", "M", "L"][value - 1],
    width: clampLabelWidth(forcedValue ? presetWidth : state.labelWidth || presetWidth),
    cellWidth: [42, 46, 50, 54][value - 1]
  };
}

function chartIntervalForValue(value, importance = "normal") {
  const interval = Number(value);
  if ([15, 30, 60].includes(interval)) return interval;
  return importance === "high" ? 30 : 60;
}

function chartIntervalForPatient(patient) {
  return chartIntervalForValue(patient?.chartInterval, patient?.importance);
}

function chartIntervalLabel(interval) {
  if (interval === 60) return "1시간으로";
  return `${interval}분으로`;
}

function currentTimeValue() {
  return currentHour + currentMinute / 60;
}

function currentTimeSlot(interval = 60) {
  const slotsPerHour = 60 / chartIntervalForValue(interval);
  return Math.floor(currentTimeValue() * slotsPerHour) / slotsPerHour;
}

function formatTimeLabel(hour) {
  const value = Number(hour) || 0;
  const wholeHour = Math.floor(value);
  const minutes = Math.round((value - wholeHour) * 60);
  return `${String(wholeHour).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function renderTimeHead(hour) {
  const value = Number(hour) || 0;
  const wholeHour = Math.floor(value);
  const minutes = Math.round((value - wholeHour) * 60);
  const period = minutes === 0 && (wholeHour === 0 || wholeHour === 12) ? `<small>${wholeHour === 0 ? "AM" : "PM"}</small>` : "<small></small>";
  return `${period}<span>${minutes === 0 ? wholeHour || 12 : `:${String(minutes).padStart(2, "0")}`}</span>`;
}

function hours(patient = activePatient()) {
  const interval = chartIntervalForPatient(patient);
  const slotCount = 24 * (60 / interval);
  return Array.from({ length: slotCount }, (_, index) => (index * interval) / 60);
}
