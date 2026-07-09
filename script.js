/* =========================================================
   COMMON GROUND · Pleasant Hill
   script.js — plain vanilla JS. No libraries, no build step.
   ========================================================= */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;

  /* ---------- progress + nav ---------- */
  var prog = document.getElementById("progress");
  var nav = document.getElementById("nav");
  function onScroll() {
    var h = document.documentElement;
    var sc = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    if (prog) prog.style.width = sc * 100 + "%";
    if (nav) nav.classList.toggle("scrolled", h.scrollTop > 40);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- hero entrance ---------- */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { document.body.classList.add("ready"); });
  });
  var cue = document.getElementById("hero-cue");
  if (cue) cue.addEventListener("click", function () {
    var t = document.getElementById("idea");
    if (t) t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  });

  /* ---------- reveals (rv, rv-l, rv-r, rv-scale) ---------- */
  var revEls = document.querySelectorAll(".rv,.rv-l,.rv-r,.rv-scale,.istep");
  if (hasIO) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    revEls.forEach(function (e) { io.observe(e); });
  } else { revEls.forEach(function (e) { e.classList.add("in"); }); }

  /* ---------- counters ---------- */
  function fmt(n) { return n.toLocaleString("en-US"); }
  function countUp(el) {
    var target = +el.getAttribute("data-target");
    var pre = el.getAttribute("data-prefix") || "", suf = el.getAttribute("data-suffix") || "";
    if (reduce || target === 0) { el.innerHTML = pre + fmt(target) + suf; return; }
    var dur = 1500, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.innerHTML = pre + fmt(Math.round(target * eased)) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var nums = document.querySelectorAll(".num[data-target]");
  if (hasIO) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); io2.unobserve(e.target); } });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { io2.observe(n); });
  } else { nums.forEach(countUp); }

  /* ---------- gap bars (opportunity) ---------- */
  var gapcard = document.querySelector(".gapcard");
  function drawGaps() {
    document.querySelectorAll(".gr-fill").forEach(function (f) {
      f.style.width = (f.getAttribute("data-w") || 0) + "%";
    });
  }
  if (gapcard) {
    if (hasIO) {
      var io5 = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { drawGaps(); io5.unobserve(e.target); } });
      }, { threshold: 0.35 });
      io5.observe(gapcard);
    } else drawGaps();
  }

  /* ---------- reinvest donut ---------- */
  var donut = document.getElementById("seg-district"), donutP = document.getElementById("seg-partner");
  var CIRC = 540;
  function drawDonut() {
    if (!donut) return;
    var g = 6, dLen = CIRC * 0.72, pLen = CIRC * 0.28;
    donut.style.strokeDasharray = (dLen - g) + " " + (CIRC - dLen + g);
    donutP.style.strokeDasharray = (pLen - g) + " " + (CIRC - pLen + g);
    donutP.style.transformOrigin = "110px 110px";
    donutP.style.transform = "rotate(" + (360 * 0.72) + "deg)";
    if (reduce) { donut.style.strokeDashoffset = 0; donutP.style.strokeDashoffset = 0; return; }
    donut.style.strokeDashoffset = CIRC; donutP.style.strokeDashoffset = CIRC;
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      donut.style.strokeDashoffset = 0; donutP.style.strokeDashoffset = 0;
    }); });
  }
  if (donut) {
    if (hasIO) {
      var io3 = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { drawDonut(); io3.unobserve(e.target); } });
      }, { threshold: 0.4 });
      io3.observe(donut);
    } else drawDonut();
  }

  /* ---------- invest toggle (business / resident) ---------- */
  document.querySelectorAll(".seg-toggle button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-pane");
      document.querySelectorAll(".seg-toggle button").forEach(function (b) { b.classList.remove("on"); b.setAttribute("aria-selected", "false"); });
      btn.classList.add("on"); btn.setAttribute("aria-selected", "true");
      document.querySelectorAll(".invest-pane").forEach(function (p) { p.classList.toggle("on", p.getAttribute("data-pane") === key); });
    });
  });

  /* ---------- interactive projection ---------- */
  var SCN = {
    conservative: [100, 300, 500, 650, 800],
    base:         [150, 400, 650, 900, 1200],
    ambitious:    [250, 500, 1000, 1500, 2000]
  };
  var YEAR_LABELS = [
    "Year 1 · The pilot", "Year 2 · Proof & repeat", "Year 3 · Scaling up",
    "Year 4 · A regional draw", "Year 5 · A Pleasant Hill institution"
  ];
  /* per-year stream mix (%) — sponsorships lead early, tournaments & naming grow */
  var STREAMS = ["Community sponsorships", "Signature tournament", "Naming partnership", "Community event", "Resident legacy & vendors"];
  var YEAR_MIX = [
    [34, 26, 20, 12, 8],
    [30, 30, 22, 10, 8],
    [26, 32, 26, 9, 7],
    [24, 34, 28, 8, 6],
    [22, 36, 30, 7, 5]
  ];
  var YEAR_NOTE = [
    "Year 1 stays deliberately narrow — one of each — to prove the model before scaling. Every figure sits inside the ranges these streams produce at comparable agencies.",
    "Year 2 repeats what worked and adds a second event and a second tournament weekend — the program starts to compound.",
    "By Year 3, tournaments and multi-year naming partnerships become the engine, drawing teams and sponsors from across the region.",
    "Year 4 scales the tournament calendar and deepens naming relationships — the kind that fund capital projects like the pool.",
    "By Year 5, Common Ground is a permanent Pleasant Hill institution: a recurring sponsor portfolio and a regional tournament draw."
  ];
  var curScn = "conservative", curYear = 0, chartShown = false;
  var barsWrap = document.getElementById("bars");
  var barCols = barsWrap ? barsWrap.querySelectorAll(".bar-col") : [];
  var crYear = document.getElementById("cr-year"), crNum = document.getElementById("cr-num"),
      crShare = document.getElementById("cr-share"), crSub = document.getElementById("cr-sub"),
      bdTotal = document.getElementById("bd-total-num"), bdRows = document.getElementById("bd-rows"),
      bdTitle = document.getElementById("bd-title"), bdNote = document.getElementById("bd-note");

  function money(k) { return k >= 1000 ? "$" + (k / 1000).toFixed(1) + "M" : "$" + k + "K"; }
  function share(k) { return money(Math.round(k * 0.7)) + "+"; }

  function renderBars() {
    var data = SCN[curScn], max = Math.max.apply(null, data);
    barCols.forEach(function (col, i) {
      var v = data[i];
      col.querySelector(".bar").style.height = (chartShown ? (v / max) * 100 : 0) + "%";
      col.querySelector(".bar-val").textContent = money(v);
      col.classList.toggle("active", i === curYear);
    });
  }
  function renderReadout() {
    var v = SCN[curScn][curYear];
    if (crYear) crYear.textContent = YEAR_LABELS[curYear];
    if (crNum) crNum.textContent = money(v);
    if (crSub) crSub.innerHTML = "Raised for Pleasant Hill · <b id=\"cr-share\">" + share(v) + "</b> straight back into the parks";
  }
  function renderBreakdown() {
    if (!bdRows) return;
    var total = SCN[curScn][curYear], mix = YEAR_MIX[curYear];
    var maxPct = Math.max.apply(null, mix);
    var rows = bdRows.querySelectorAll(".bd-row");
    rows.forEach(function (row, i) {
      var amt = Math.round(total * mix[i] / 100);
      var fill = row.querySelector(".bd-fill"), amtEl = row.querySelector(".bd-amt");
      /* re-trigger the width transition */
      fill.style.width = "0%";
      // force reflow so the change animates even when values are equal
      void fill.offsetWidth;
      fill.style.width = (chartShown ? (mix[i] / maxPct) * 100 : 0) + "%";
      amtEl.textContent = amt >= 1000 ? "$" + (amt / 1000).toFixed(1) + "M" : "$" + amt + "K";
    });
    if (bdTitle) bdTitle.textContent = "How Year " + (curYear + 1) + " gets built";
    if (bdTotal) bdTotal.textContent = money(total);
    if (bdNote) bdNote.textContent = YEAR_NOTE[curYear];
  }
  function renderAll() { renderBars(); renderReadout(); renderBreakdown(); }

  document.querySelectorAll(".scenario button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".scenario button").forEach(function (b) { b.classList.remove("on"); b.setAttribute("aria-selected", "false"); });
      btn.classList.add("on"); btn.setAttribute("aria-selected", "true");
      curScn = btn.getAttribute("data-scn"); renderAll();
    });
  });
  barCols.forEach(function (col) {
    col.addEventListener("click", function () { curYear = +col.getAttribute("data-i"); renderAll(); });
  });
  if (barsWrap) {
    renderReadout(); renderBreakdown();
    if (hasIO) {
      var io4 = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { chartShown = true; barsWrap.classList.add("shown"); renderBars(); renderBreakdown(); io4.unobserve(e.target); }
        });
      }, { threshold: 0.3 });
      io4.observe(barsWrap);
    } else { chartShown = true; barsWrap.classList.add("shown"); renderBars(); renderBreakdown(); }
  }

  /* ---------- backlit tiles ---------- */
  document.querySelectorAll(".tier").forEach(function (t) {
    t.addEventListener("pointermove", function (e) {
      var r = t.getBoundingClientRect();
      t.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
      t.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
    }, { passive: true });
  });

  /* ---------- asset explorer ---------- */
  var assetTabs = document.querySelectorAll(".asset-tab"), assetViews = document.querySelectorAll(".asset-view");
  assetTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var key = tab.getAttribute("data-asset");
      assetTabs.forEach(function (t) { t.classList.remove("on"); t.setAttribute("aria-selected", "false"); });
      tab.classList.add("on"); tab.setAttribute("aria-selected", "true");
      assetViews.forEach(function (v) { v.classList.toggle("on", v.getAttribute("data-asset") === key); });
    });
  });

  /* ---------- the room ---------- */
  var people = document.querySelectorAll(".person"), roomViews = document.querySelectorAll(".room-view");
  people.forEach(function (p) {
    p.addEventListener("click", function () {
      var key = p.getAttribute("data-person");
      people.forEach(function (x) { x.classList.remove("on"); x.setAttribute("aria-selected", "false"); });
      p.classList.add("on"); p.setAttribute("aria-selected", "true");
      roomViews.forEach(function (v) { v.classList.toggle("on", v.getAttribute("data-person") === key); });
    });
  });

  /* ---------- tier modals ---------- */
  var TIERS = {
    silver: { tier: "Silver Partner", price: "$5,000", per: "per year", h: "The local champion.",
      p: "The annual partnership built for the businesses that make Pleasant Hill feel like Pleasant Hill — the family orthodontist, the neighborhood HVAC company, the restaurant everyone knows. For the cost of a modest local ad campaign, they become a visible, year-round supporter of the parks their own customers use.",
      gets: ["<b>Field & fence signage</b> at a home park through the season","<b>Logo placement</b> in District newsletters and on the website","<b>Named presence</b> at one community event or program","A digital thank-you across the District's channels"], d: "$3,500", pv: "$1,500" },
    gold: { tier: "Gold Partner", price: "$10,000", per: "per year", h: "The established local brand.",
      p: "For the dealership, the credit union, the builder that wants to plant a flag in its own backyard. Gold pairs a high-visibility asset — a scoreboard, a court — with multi-park signage and event activation, plus priority in its business category so a competitor can't sit beside it.",
      gets: ["<b>Scoreboard or court</b> presence at a signature facility","<b>Multi-park signage</b> and on-site event activation","<b>Category priority</b> in its business segment","Recognition across digital, print and event channels"], d: "$7,000", pv: "$3,000" },
    presenting: { tier: "Presenting Partner", price: "$25,000", per: "per year", h: "Woven into community life.",
      p: "The anchor partnership — for a health system, regional bank or major employer that wants its name on the moments the whole town shows up for. Presenting rights to a signature event or tournament, premium naming on a marquee asset, and a year-round presence. This is the single relationship that can help underwrite a capital project like the pool.",
      gets: ["<b>Presenting rights</b> to a signature event or tournament","<b>Premium naming</b> on a marquee District asset","<b>Year-round</b> digital, field and on-site presence","<b>Category exclusivity</b> and first right to renew","A seat at the table as the flagship community partner"], d: "$17,500", pv: "$7,500" }
  };
  var scrim = document.getElementById("modal-scrim"), modalBody = document.getElementById("modal-body"),
      modalX = document.getElementById("modal-x"), lastFocus = null;
  function chk() { return "<svg viewBox=\"0 0 24 24\"><path d=\"M20 6 9 17l-5-5\"/></svg>"; }
  function openTier(key) {
    var t = TIERS[key]; if (!t || !scrim) return;
    var lis = t.gets.map(function (g) { return "<li>" + chk() + "<span>" + g + "</span></li>"; }).join("");
    modalBody.innerHTML =
      "<div class=\"m-tier\">" + t.tier + "</div>" +
      "<div class=\"m-price\">" + t.price + " <span>" + t.per + "</span></div>" +
      "<h3 id=\"modal-title\">" + t.h + "</h3><p>" + t.p + "</p>" +
      "<div class=\"m-section\"><h4>What a year includes</h4><ul class=\"m-list\">" + lis + "</ul></div>" +
      "<div class=\"m-section\"><h4>Where the money goes</h4><div class=\"m-split\">" +
      "<div><div class=\"ms-k\">Back into the parks</div><div class=\"ms-v\">" + t.d + "</div></div>" +
      "<div><div class=\"ms-k\">Runs the program</div><div class=\"ms-v g\">" + t.pv + "</div></div></div>" +
      "<p style=\"font-size:.82rem;color:var(--tx-inv-mute);margin-top:1rem\">An annual partnership — it renews each year, and its value grows with demand. No partner owns a public asset.</p></div>";
    scrim.hidden = false; lastFocus = document.activeElement;
    requestAnimationFrame(function () { scrim.classList.add("open"); });
    modalX.focus(); document.body.style.overflow = "hidden";
  }
  function closeModal() {
    if (!scrim) return;
    scrim.classList.remove("open"); document.body.style.overflow = "";
    setTimeout(function () { scrim.hidden = true; }, 360);
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll(".tier").forEach(function (t) {
    t.addEventListener("click", function () { openTier(t.getAttribute("data-tier")); });
    t.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openTier(t.getAttribute("data-tier")); } });
  });
  if (modalX) modalX.addEventListener("click", closeModal);
  if (scrim) scrim.addEventListener("click", function (e) { if (e.target === scrim) closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && scrim && !scrim.hidden) closeModal(); });

  /* ---------- seamless marquee (duplicate content) ---------- */
  var mq = document.getElementById("mq-track");
  if (mq && !reduce) {
    var clone = mq.innerHTML; mq.innerHTML = clone + clone;
  }

  /* ---------- contact widget ---------- */
  var widget = document.getElementById("contact-widget");
  if (widget) {
    var form = document.getElementById("cw-form"), trigger = document.getElementById("cw-trigger"),
        cancel = document.getElementById("cw-cancel"), errEl = document.getElementById("cw-error"),
        steps = widget.querySelectorAll(".cw-step"), nameEcho = widget.querySelector(".cw-name-echo");
    function setState(s) {
      widget.setAttribute("data-state", s);
      if (trigger) trigger.setAttribute("aria-expanded", s === "form" ? "true" : "false");
      if (form) form.setAttribute("aria-hidden", s === "form" ? "false" : "true");
    }
    function delay(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
    function setProgress(i) { steps.forEach(function (st, idx) { st.classList.toggle("on", idx <= i); }); }
    trigger.addEventListener("click", function () {
      setState("form"); setTimeout(function () { var n = document.getElementById("cw-name"); if (n) n.focus(); }, 140);
    });
    if (cancel) cancel.addEventListener("click", function () { if (errEl) errEl.textContent = ""; setState("idle"); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (errEl) errEl.textContent = "";
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var nameVal = (document.getElementById("cw-name").value || "").trim(), first = nameVal.split(/\s+/)[0];
      if (nameEcho) nameEcho.textContent = first ? ", " + first : "";
      setState("sending"); setProgress(0);
      var pause = reduce ? 0 : 650;
      var req = fetch(form.action, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) })
        .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); });
      delay(pause).then(function () { setProgress(1); return Promise.all([req, delay(pause)]); })
        .then(function (r) { if (!r[0].ok) throw (r[0].data && r[0].data.message) || "Something went wrong."; setProgress(2); return delay(reduce ? 0 : 620); })
        .then(function () { form.reset(); setState("done"); })
        .catch(function (err) { setState("form"); if (errEl) errEl.textContent = (typeof err === "string" ? err : "Network error.") + " You can also email me directly."; });
    });
  }

  /* ---------- 3D tilt on cards (hover devices only) ---------- */
  var canHover = window.matchMedia && window.matchMedia("(hover:hover)").matches;
  if (canHover && !reduce) {
    document.querySelectorAll(".tilt").forEach(function (el) {
      var raf = null;
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          el.style.transform = "perspective(900px) rotateX(" + (-py * 4.5).toFixed(2) + "deg) rotateY(" + (px * 5.5).toFixed(2) + "deg) translateY(-6px)";
        });
      }, { passive: true });
      el.addEventListener("pointerleave", function () {
        if (raf) cancelAnimationFrame(raf);
        el.style.transform = "";
      });
    });
  }

  /* ---------- hero parallax ---------- */
  if (!reduce) {
    var sun = document.querySelector(".hero-sun"), layer = document.querySelector(".hero-layer");
    document.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        if (sun) sun.style.transform = "translateY(" + y * 0.28 + "px)";
        if (layer) layer.style.transform = "translateX(-50%) translateY(" + y * 0.06 + "px)";
      }
    }, { passive: true });
  }
})();
