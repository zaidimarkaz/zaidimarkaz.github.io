// =========================================
// script.js (No "now" input in HTML)
// Normal Age + Accelerated Age + Total Age
// Arabic output + weeks/days option
// =========================================

// ---------- UTC helpers (avoid DST bugs) ----------
function utcToday() {
  const t = new Date();
  return new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()));
}

function toUTCDate(dateInputValue) {
  // dateInputValue: "YYYY-MM-DD"
  if (!dateInputValue) return null;
  const [y, m, d] = dateInputValue.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function fmtUTC(d) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addYearsUTC(date, years) {
  const y = date.getUTCFullYear() + years;
  const m = date.getUTCMonth();
  const d = date.getUTCDate();

  const result = new Date(Date.UTC(y, m, d));

  // Clamp overflow (e.g., Feb 29 -> Feb 28)
  if (result.getUTCMonth() !== m) {
    return new Date(Date.UTC(y, m + 1, 0));
  }
  return result;
}

function addMonthsUTC(date, months) {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();

  const result = new Date(Date.UTC(y, m + months, d));

  // Clamp overflow end-of-month
  if (result.getUTCDate() !== d) {
    return new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0));
  }
  return result;
}

function diffDaysUTC(a, b) {
  const msPerDay = 24 * 60 * 60 * 1000;
  // floor + epsilon for stability
  return Math.floor((b.getTime() - a.getTime()) / msPerDay + 1e-9);
}

// Calendar diff: years + months + days
function diffYMD(start, end) {
  if (end < start) return { years: 0, months: 0, days: 0, negative: true };

  // years
  let years = end.getUTCFullYear() - start.getUTCFullYear();
  let temp = addYearsUTC(start, years);
  if (temp > end) {
    years--;
    temp = addYearsUTC(start, years);
  }

  // months
  let months = end.getUTCMonth() - temp.getUTCMonth();
  if (months < 0) months += 12;

  let temp2 = addMonthsUTC(temp, months);
  if (temp2 > end) {
    months = (months + 11) % 12;
    temp2 = addMonthsUTC(temp, months);
  }

  // days
  const days = diffDaysUTC(temp2, end);
  return { years, months, days, negative: false };
}

function formatAgeArabic(ymd, weeksMode = "split") {
  const { years, months, days } = ymd;

  if (weeksMode === "days") {
    return `${years} سنة؛ ${months} شهر؛ ${days} يوم`;
  }

  const weeks = Math.floor(days / 7);
  const remDays = days % 7;
  return `${years} سنة؛ ${months} شهر؛ ${weeks} أسبوع؛ ${remDays} يوم`;
}

// ---------- Virtual now (accelerated timeline) ----------
function computeVirtualNow(now, pivot, accYears, mult) {
  if (now <= pivot) return { virtualNow: now, phase: "قبل تاريخ المحور" };

  const pivotEnd = addYearsUTC(pivot, accYears);

  const msNow = now.getTime();
  const msPivot = pivot.getTime();
  const msPivotEnd = pivotEnd.getTime();

  if (msNow <= msPivotEnd) {
    // during accelerated window
    const virtual = new Date(msPivot + (msNow - msPivot) * mult);
    return { virtualNow: virtual, phase: "داخل مدة التسريع", pivotEnd };
  }

  // after window: accelerate until pivotEnd, then normal afterwards
  const acceleratedEndVirtual = msPivot + (msPivotEnd - msPivot) * mult;
  const virtual = new Date(acceleratedEndVirtual + (msNow - msPivotEnd));
  return { virtualNow: virtual, phase: "بعد انتهاء مدة التسريع", pivotEnd };
}

function mustHaveDates(...dates) {
  return dates.every(d => d instanceof Date && !Number.isNaN(d.getTime()));
}

// ---------- DOM wiring (matches your HTML exactly) ----------
const elBirth = document.getElementById("birth");
const elPivot = document.getElementById("pivot");
const elAccYears = document.getElementById("accYears");
const elMult = document.getElementById("mult");
const elWeeksMode = document.getElementById("weeksMode");

const elNormal = document.getElementById("normal");
const elNormalMeta = document.getElementById("normalMeta");
const elNew = document.getElementById("newAge");
const elNewMeta = document.getElementById("newMeta");
const elTotal = document.getElementById("totalAge");
const elTotalMeta = document.getElementById("totalMeta");

function calculate() {
  const birth = toUTCDate(elBirth.value);
  const pivot = toUTCDate(elPivot.value);

  // ✅ Now is computed in JS (no HTML input)
  const now = utcToday();

  const accYears = Math.max(0, parseInt(elAccYears.value || "0", 10));
  const mult = Math.max(1, parseInt(elMult.value || "100", 10));
  const weeksMode = elWeeksMode ? elWeeksMode.value : "split";

  if (!mustHaveDates(birth, now, pivot)) {
    elNormal.textContent = "يرجى إدخال تاريخ الميلاد وتاريخ المحور.";
    elNew.textContent = "—";
    elTotal.textContent = "—";
    elNormalMeta.textContent = "—";
    elNewMeta.textContent = "—";
    elTotalMeta.textContent = "—";
    return;
  }

  // 1) Normal age
  const normalYMD = diffYMD(birth, now);
  elNormal.textContent = formatAgeArabic(normalYMD, weeksMode);
  elNormalMeta.textContent = `اليوم (تلقائياً) = ${fmtUTC(now)} | من ${fmtUTC(birth)} إلى ${fmtUTC(now)} (زمن عادي)`;

  // 2) Accelerated age
  const { virtualNow, phase, pivotEnd } = computeVirtualNow(now, pivot, accYears, mult);
  const newYMD = diffYMD(birth, virtualNow);
  elNew.textContent = formatAgeArabic(newYMD, weeksMode);

  const endStr = pivotEnd ? fmtUTC(pivotEnd) : fmtUTC(addYearsUTC(pivot, accYears));
  elNewMeta.textContent =
    `الآن الافتراضي = ${fmtUTC(virtualNow)} | الحالة: ${phase} | المحور ${fmtUTC(pivot)} → نهاية المدة ${endStr} | المضاعف: ×${mult}`;

  // 3) Total age = duration(normal) + duration(accelerated)
  const msBirth = birth.getTime();
  const normalDuration = now.getTime() - msBirth;
  const acceleratedDuration = virtualNow.getTime() - msBirth;

  const totalNow = new Date(msBirth + normalDuration + acceleratedDuration);
  const totalYMD = diffYMD(birth, totalNow);
  elTotal.textContent = formatAgeArabic(totalYMD, weeksMode);
  elTotalMeta.textContent = `تاريخ إجمالي افتراضي = ${fmtUTC(totalNow)} (مجموع المددتين)`;
}

// Button
document.getElementById("calc").addEventListener("click", calculate);

// Optional: recalc when inputs change (nice UX)
["change", "input"].forEach(evt => {
  elBirth.addEventListener(evt, calculate);
  elPivot.addEventListener(evt, calculate);
  elAccYears.addEventListener(evt, calculate);
  elMult.addEventListener(evt, calculate);
  if (elWeeksMode) elWeeksMode.addEventListener(evt, calculate);
});

// Run once on load
calculate();