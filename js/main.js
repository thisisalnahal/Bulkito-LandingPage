(function () {
  "use strict";

  /* 1) Google Play link: switches the page from "coming soon" to "download now" */
  var url = ((window.BULKITO_CONFIG || {}).playStoreUrl || "").trim();
  if (/^https?:\/\//i.test(url)) {
    document.body.classList.add("is-live");
    document.querySelectorAll("[data-store]").forEach(function (a) {
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  /* 2) Screens gallery */
  var track = document.getElementById("track");
  if (!track) return;
  var slides = Array.prototype.slice.call(track.children);
  var cap = document.getElementById("cap");
  var dotsBox = document.getElementById("dots");
  var prev = document.querySelector(".arw.prev");
  var next = document.querySelector(".arw.next");
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var cur = 0, ticking = false;

  var dots = slides.map(function (s, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", s.dataset.title);
    b.addEventListener("click", function () { go(i); });
    dotsBox.appendChild(b);
    s.addEventListener("click", function () { go(i); });
    return b;
  });

  function go(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    var s = slides[i];
    track.scrollTo({ left: s.offsetLeft + s.offsetWidth / 2 - track.clientWidth / 2, behavior: calm ? "auto" : "smooth" });
  }

  function update() {
    ticking = false;
    var mid = track.scrollLeft + track.clientWidth / 2, best = 0, bd = Infinity;
    slides.forEach(function (s, i) {
      var d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid);
      if (d < bd) { bd = d; best = i; }
    });
    cur = best;
    slides.forEach(function (s, i) { s.classList.toggle("on", i === cur); dots[i].classList.toggle("on", i === cur); });
    cap.textContent = slides[cur].dataset.title;
    if (prev) prev.disabled = cur === 0;
    if (next) next.disabled = cur === slides.length - 1;
  }

  track.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener("resize", function () { go(cur); update(); });
  if (prev) prev.addEventListener("click", function () { go(cur - 1); });
  if (next) next.addEventListener("click", function () { go(cur + 1); });
  track.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(cur - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(cur + 1); }
  });
  update();
})();
