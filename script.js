/* =========================================================
   East Bay Community Partnerships · Pleasant Hill Pitch
   script.js — plain vanilla JS. No libraries, no build step.
   ========================================================= */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;

  /* ---------- scroll progress + nav ---------- */
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

  /* ---------- scroll reveals ---------- */
  var rvs = document.querySelectorAll(".rv");
  if (hasIO) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    rvs.forEach(function (e) { io.observe(e); });
  } else {
    rvs.forEach(function (e) { e.classList.add("in"); });
  }

  /* ---------- animated counters ---------- */
  function fmt(n) { return n.toLocaleString("en-US"); }
  function countUp(el) {
    var target = +el.getAttribute("data-target");
    var pre = el.getAttribute("data-prefix") || "";
    var suf = el.getAttribute("data-suffix") || "";
    if (reduce || target === 0) { el.innerHTML = pre + fmt(target) + suf; return; }
    var dur = 1500, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.innerHTML = pre + fmt(Math.round(target * eased)) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var nums = document.querySelectorAll(".num[data-target]");
  if (hasIO) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); io2.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { io2.observe(n); });
  } else { nums.forEach(countUp); }

  /* ---------- 70/30 donut ---------- */
  var donut = document.getElementById("seg-district");
  var donutP = document.getElementById("seg-partner");
  var CIRC = 540; // ~2*pi*86
  function drawDonut() {
    if (!donut) return;
    // district = 70% (gold), partner = 30% (leaf), gap for rounded caps
    var g = 6;
    var dLen = CIRC * 0.70, pLen = CIRC * 0.30;
    donut.style.strokeDasharray = (dLen - g) + " " + (CIRC - dLen + g);
    donut.style.strokeDashoffset = reduce ? 0 : CIRC;
    donutP.style.strokeDasharray = (pLen - g) + " " + (CIRC - pLen + g);
    donutP.style.strokeDashoffset = reduce ? -dLen : CIRC;
    // rotate partner segment to start where district ends
    donutP.style.transformOrigin = "110px 110px";
    donutP.style.transform = "rotate(" + (360 * 0.70) + "deg)";
    if (!reduce) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          donut.style.strokeDashoffset = 0;
          donutP.style.strokeDashoffset = 0;
        });
      });
    }
  }
  if (donut) {
    if (hasIO) {
      var io3 = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { drawDonut(); io3.unobserve(e.target); } });
      }, { threshold: 0.4 });
      io3.observe(donut);
    } else { drawDonut(); }
  }

  /* ---------- interactive revenue projection ---------- */
  var SCN = {
    conservative: [100, 300, 500, 650, 800],
    base:         [150, 400, 650, 900, 1200],
    ambitious:    [250, 500, 1000, 1500, 2000]
  };
  var YEAR_LABELS = [
    "Year 1 · The Pleasant Hill Pilot",
    "Year 2 · Proof & repeat",
    "Year 3 · Regional expansion begins",
    "Year 4 · Multi-district platform",
    "Year 5 · The East Bay platform"
  ];
  var STREAM_PCT = [34, 26, 20, 12, 8]; // sponsorships, tournament, naming, event, vendor
  var curScn = "conservative", curYear = 0, chartShown = false;

  var barsWrap = document.getElementById("bars");
  var barCols = barsWrap ? barsWrap.querySelectorAll(".bar-col") : [];
  var crYear = document.getElementById("cr-year");
  var crNum = document.getElementById("cr-num");
  var crShare = document.getElementById("cr-share");
  var crSub = document.getElementById("cr-sub");
  var bdTotal = document.getElementById("bd-total-num");
  var bdRows = document.getElementById("bd-rows");

  function money(k) {
    if (k >= 1000) return "$" + (k / 1000).toFixed(1).replace(/\.0$/, ".0") + "M";
    return "$" + k + "K";
  }
  function share(k) { return money(Math.round(k * 0.7)); }

  function renderBars() {
    var data = SCN[curScn];
    var max = Math.max.apply(null, data);
    barCols.forEach(function (col, i) {
      var v = data[i];
      var bar = col.querySelector(".bar");
      var val = col.querySelector(".bar-val");
      bar.style.height = (chartShown ? (v / max) * 100 : 0) + "%";
      val.textContent = money(v);
      col.classList.toggle("active", i === curYear);
    });
  }
  function renderReadout() {
    var v = SCN[curScn][curYear];
    if (crYear) crYear.textContent = YEAR_LABELS[curYear];
    if (crNum) crNum.textContent = money(v);
    if (crShare) crShare.textContent = share(v);
    if (crSub) crSub.innerHTML = "New revenue generated · <b id=\"cr-share\">" + share(v) + "</b> to the District (70%)";
  }
  function renderBreakdown() {
    if (!bdRows) return;
    var y1 = SCN[curScn][0];
    var maxPct = Math.max.apply(null, STREAM_PCT);
    var rows = bdRows.querySelectorAll(".bd-row");
    rows.forEach(function (row, i) {
      var amt = Math.round(y1 * STREAM_PCT[i] / 100);
      var fill = row.querySelector(".bd-fill");
      var amtEl = row.querySelector(".bd-amt");
      fill.setAttribute("data-pct", STREAM_PCT[i]);
      fill.style.width = (chartShown ? (STREAM_PCT[i] / maxPct) * 100 : 0) + "%";
      amtEl.textContent = "$" + amt + "K";
    });
    if (bdTotal) bdTotal.textContent = money(y1);
  }

  document.querySelectorAll(".scenario button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".scenario button").forEach(function (b) {
        b.classList.remove("on"); b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("on"); btn.setAttribute("aria-selected", "true");
      curScn = btn.getAttribute("data-scn");
      renderBars(); renderReadout(); renderBreakdown();
    });
  });
  barCols.forEach(function (col) {
    col.addEventListener("click", function () {
      curYear = +col.getAttribute("data-i");
      renderBars(); renderReadout();
    });
  });

  if (barsWrap) {
    renderReadout(); renderBreakdown();
    if (hasIO) {
      var io4 = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            chartShown = true;
            barsWrap.classList.add("shown");
            renderBars(); renderBreakdown();
            io4.unobserve(e.target);
          }
        });
      }, { threshold: 0.3 });
      io4.observe(barsWrap);
    } else {
      chartShown = true; barsWrap.classList.add("shown"); renderBars(); renderBreakdown();
    }
  }

  /* ---------- backlit tiles (tiers) ---------- */
  document.querySelectorAll(".tier").forEach(function (t) {
    t.addEventListener("pointermove", function (e) {
      var r = t.getBoundingClientRect();
      t.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
      t.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
    }, { passive: true });
  });

  /* ---------- asset explorer ---------- */
  var assetTabs = document.querySelectorAll(".asset-tab");
  var assetViews = document.querySelectorAll(".asset-view");
  assetTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var key = tab.getAttribute("data-asset");
      assetTabs.forEach(function (t) { t.classList.remove("on"); t.setAttribute("aria-selected", "false"); });
      tab.classList.add("on"); tab.setAttribute("aria-selected", "true");
      assetViews.forEach(function (v) {
        v.classList.toggle("on", v.getAttribute("data-asset") === key);
      });
    });
  });

  /* ---------- the room (stakeholder selector) ---------- */
  var people = document.querySelectorAll(".person");
  var roomViews = document.querySelectorAll(".room-view");
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
    silver: {
      tier: "Silver Sponsor", price: "$5,000", per: "per year",
      h: "The local champion.",
      p: "The tier built for the businesses that make Pleasant Hill feel like Pleasant Hill — the family orthodontist, the neighborhood HVAC company, the restaurant everyone knows. For the cost of a modest local ad campaign, they become a visible, year-round supporter of the parks their own customers use.",
      gets: [
        "<b>Field & fence signage</b> at a home park through the season",
        "<b>Logo placement</b> in District newsletters and on the website",
        "<b>Named presence</b> at one community event or program",
        "A digital thank-you across the District's social channels"
      ],
      d: "$3,500", pv: "$1,500"
    },
    gold: {
      tier: "Gold Sponsor", price: "$10,000", per: "per year",
      h: "The established local brand.",
      p: "For the dealership, the credit union, the home builder that wants to plant a flag in its own backyard. Gold pairs a high-visibility physical asset — a scoreboard, a court — with multi-park signage and event activation, plus priority in its business category so a competitor can't sit beside it.",
      gets: [
        "<b>Scoreboard or court naming</b> presence at a signature facility",
        "<b>Multi-park signage</b> and on-site event activation",
        "<b>Category priority</b> in its business segment",
        "Recognition across digital, print and event channels"
      ],
      d: "$7,000", pv: "$3,000"
    },
    presenting: {
      tier: "Presenting Sponsor", price: "$25,000", per: "per year",
      h: "Own “community” in Pleasant Hill.",
      p: "The anchor tier — for a health system, regional bank, or major employer that wants its name on the moments the whole city shows up for. Presenting rights to a signature event or tournament series, premium naming on a marquee asset, and a year-round presence that makes the brand synonymous with Pleasant Hill's parks. This is the single relationship that can underwrite a capital project.",
      gets: [
        "<b>Presenting rights</b> to a signature event or tournament series",
        "<b>Premium naming</b> on a marquee District asset",
        "<b>Year-round</b> digital, field and on-site presence",
        "<b>Category exclusivity</b> and first right of renewal",
        "A seat at the table as the flagship community partner"
      ],
      d: "$17,500", pv: "$7,500"
    }
  };
  var scrim = document.getElementById("modal-scrim");
  var modalBody = document.getElementById("modal-body");
  var modalX = document.getElementById("modal-x");
  var lastFocus = null;

  function checkSvg() {
    return "<svg viewBox=\"0 0 24 24\"><path d=\"M20 6 9 17l-5-5\"/></svg>";
  }
  function openTier(key) {
    var t = TIERS[key];
    if (!t || !scrim) return;
    var lis = t.gets.map(function (g) { return "<li>" + checkSvg() + "<span>" + g + "</span></li>"; }).join("");
    modalBody.innerHTML =
      "<div class=\"m-tier\">" + t.tier + "</div>" +
      "<div class=\"m-price\">" + t.price + " <span>" + t.per + "</span></div>" +
      "<h3 id=\"modal-title\">" + t.h + "</h3>" +
      "<p>" + t.p + "</p>" +
      "<div class=\"m-section\"><h4>What the partner gets</h4><ul class=\"m-list\">" + lis + "</ul></div>" +
      "<div class=\"m-section\"><h4>Where the money goes</h4>" +
      "<div class=\"m-split\">" +
      "<div><div class=\"ms-k\">To the District (70%)</div><div class=\"ms-v\">" + t.d + "</div></div>" +
      "<div><div class=\"ms-k\">To the partnership (30%)</div><div class=\"ms-v leaf\">" + t.pv + "</div></div>" +
      "</div></div>";
    scrim.hidden = false;
    lastFocus = document.activeElement;
    requestAnimationFrame(function () { scrim.classList.add("open"); });
    modalX.focus();
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    if (!scrim) return;
    scrim.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(function () { scrim.hidden = true; }, 360);
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll(".tier").forEach(function (t) {
    t.addEventListener("click", function () { openTier(t.getAttribute("data-tier")); });
    t.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openTier(t.getAttribute("data-tier")); }
    });
  });
  if (modalX) modalX.addEventListener("click", closeModal);
  if (scrim) scrim.addEventListener("click", function (e) { if (e.target === scrim) closeModal(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && scrim && !scrim.hidden) closeModal();
  });

  /* ---------- contact widget (Web3Forms progressive reveal) ---------- */
  var widget = document.getElementById("contact-widget");
  if (widget) {
    var form = document.getElementById("cw-form");
    var trigger = document.getElementById("cw-trigger");
    var cancel = document.getElementById("cw-cancel");
    var errEl = document.getElementById("cw-error");
    var steps = widget.querySelectorAll(".cw-step");
    var nameEcho = widget.querySelector(".cw-name-echo");

    function setState(s) {
      widget.setAttribute("data-state", s);
      if (trigger) trigger.setAttribute("aria-expanded", s === "form" ? "true" : "false");
      if (form) form.setAttribute("aria-hidden", s === "form" ? "false" : "true");
    }
    function delay(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
    function setProgress(index) { steps.forEach(function (st, i) { st.classList.toggle("on", i <= index); }); }

    trigger.addEventListener("click", function () {
      setState("form");
      setTimeout(function () { var n = document.getElementById("cw-name"); if (n) n.focus(); }, 140);
    });
    if (cancel) cancel.addEventListener("click", function () { if (errEl) errEl.textContent = ""; setState("idle"); });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (errEl) errEl.textContent = "";
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var nameVal = (document.getElementById("cw-name").value || "").trim();
      var first = nameVal.split(/\s+/)[0];
      if (nameEcho) nameEcho.textContent = first ? ", " + first : "";
      setState("sending"); setProgress(0);
      var pause = reduce ? 0 : 650;
      var req = fetch(form.action, {
        method: "POST", headers: { Accept: "application/json" }, body: new FormData(form)
      }).then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); });

      delay(pause).then(function () {
        setProgress(1);
        return Promise.all([req, delay(pause)]);
      }).then(function (results) {
        var r = results[0];
        if (!r.ok) throw (r.data && r.data.message) || "Something went wrong.";
        setProgress(2);
        return delay(reduce ? 0 : 620);
      }).then(function () {
        form.reset(); setState("done");
      }).catch(function (err) {
        setState("form");
        if (errEl) errEl.textContent = (typeof err === "string" ? err : "Network error.") + " You can also email me directly.";
      });
    });
  }

  /* ---------- gentle hero parallax ---------- */
  if (!reduce) {
    var scene = document.querySelector(".hero-scene");
    document.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (scene && y < window.innerHeight) scene.style.transform = "translateY(" + y * 0.12 + "px)";
    }, { passive: true });
  }
})();
