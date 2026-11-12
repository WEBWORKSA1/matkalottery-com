/* MatkaLottery.com — site-wide behaviour (no tracking, no dependencies) */
(function () {
  'use strict';
  var d = document, w = window;

  // ---- Settings -----------------------------------------------------------
  var CFG = {
    // Contact routing is stored encoded and only decoded when a visitor sends a form.
    k: ['bW9jLmxp', 'YW1nQDFh', 'c2tyb3di', 'ZXc='],
    // Optional donation links. Leave blank to use the pledge form only.
    donate: { paypal: '', upi: '', bmc: '' },
    newsProxy: 'https://api.rss2json.com/v1/api.json?rss_url='
  };
  function inbox() { try { return atob(CFG.k.join('')).split('').reverse().join(''); } catch (e) { return ''; } }

  // ---- Helpers ------------------------------------------------------------
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var fmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
  function inr(n) { return fmt.format(Math.round(n || 0)); }
  function words(n) {
    var a = Math.abs(n);
    if (a >= 1e7) return '₹' + parseFloat((n / 1e7).toFixed(2)) + ' crore';
    if (a >= 1e5) return '₹' + parseFloat((n / 1e5).toFixed(2)) + ' lakh';
    return inr(n);
  }
  function ist() { var n = new Date(); return new Date(n.getTime() + (330 + n.getTimezoneOffset()) * 60000); }
  function dayIndex() { var t = ist(); return Math.floor(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()) / 864e5); }

  // India prize-tax model: commission first, then 30% + surcharge (on income band) + 4% cess.
  function prizeTax(o) {
    var P = Math.max(0, +o.prize || 0), c = Math.max(0, +o.commission || 0) / 100;
    var comm = P * c, taxable = P - comm, base = taxable * 0.30;
    var total = taxable + Math.max(0, +o.other || 0), sr = 0;
    if (total > 5e7) sr = o.regime === 'old' ? 0.37 : 0.25;
    else if (total > 2e7) sr = 0.25;
    else if (total > 1e7) sr = 0.15;
    else if (total > 5e6) sr = 0.10;
    var sur = base * sr, cess = (base + sur) * 0.04, tax = base + sur + cess;
    var tds = taxable > 10000 ? base : 0;
    return { prize: P, comm: comm, taxable: taxable, base: base, sr: sr, sur: sur, cess: cess, tax: tax, net: taxable - tax, tds: tds, paid: taxable - tds, due: tax - tds };
  }
  w.ML = { inbox: inbox, cfg: CFG, prizeTax: prizeTax, inr: inr, words: words, esc: esc, $: $, $$: $$ };

  // ---- Navigation -----------------------------------------------------------
  var toggle = $('.nav-toggle'), nav = $('#nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? 'Close' : 'Menu';
    });
  }
  var here = (location.pathname.split('/').pop() || 'index.html');
  $$('#nav a').forEach(function (a) { if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page'); });
  $$('[data-year]').forEach(function (el) { el.textContent = ist().getFullYear(); });

  // ---- Site search ----------------------------------------------------------
  var INDEX = [
    ['index.html', 'Home', 'matka lottery india odds tax scams'],
    ['learn.html', 'Learn hub: all guides', 'guides articles learn'],
    ['matka-history.html', 'History of matka', 'matka king ratan khatri kalyanji bhagat worli cotton bombay history film series'],
    ['is-matka-legal.html', 'Is matka legal in India?', 'law legal satta public gambling act 1867 online gaming act 2025 police'],
    ['state-lotteries.html', 'State lotteries in India', 'kerala nagaland sikkim punjab west bengal maharashtra goa lottery bumper weekly schedule'],
    ['lottery-tax.html', 'Lottery tax in India', 'tax tds 194b 115bb 30% surcharge cess income tax act 2025 393'],
    ['claim-prize.html', 'How to claim a lottery prize', 'claim prize ticket documents pan kerala 30 days directorate'],
    ['odds-explained.html', 'Lottery odds explained', 'odds probability combinations gambler fallacy hot cold numbers myths expected value'],
    ['glossary.html', 'Lottery & matka glossary', 'glossary terms meaning definitions bumper series tds'],
    ['scams.html', 'Scam shield: lottery frauds', 'scam fraud kbc whatsapp 25 lakh fake lottery 1930 cybercrime report fix game'],
    ['tools.html', 'All free tools', 'tools calculators'],
    ['tax-calculator.html', 'Prize tax calculator', 'calculator tax take home net prize kerala commission'],
    ['odds-calculator.html', 'Odds calculator', 'odds calculator combinations chance expected value raffle'],
    ['scam-checker.html', 'Scam message checker', 'check message scam whatsapp sms fake prize'],
    ['simulator.html', 'Lifetime ticket simulator', 'simulator spend years lifetime lose money'],
    ['number-generator.html', 'Random number generator', 'random number generator quick pick'],
    ['self-check.html', 'Gambling self-check & help', 'addiction help self test quiz tele manas 14416 icall'],
    ['winner-help.html', 'Winner & scam-victim help', 'won prize help ca tax advisor lawyer lead free check'],
    ['news.html', 'Lottery & scam news', 'news latest updates'],
    ['videos.html', 'Videos', 'videos youtube watch'],
    ['support.html', 'Support us (donate)', 'donate support donation fund'],
    ['contests.html', 'Contests & prizes', 'contest prize competition reel essay puzzle'],
    ['careers.html', 'Careers', 'jobs hiring writer translator video creator'],
    ['partner.html', 'Advertise & partner', 'advertise sponsor partnership media kit'],
    ['about.html', 'About & editorial policy', 'about us editorial policy team'],
    ['contact.html', 'Contact', 'contact email message'],
    ['disclaimer.html', 'Disclaimer & trademark notice', 'disclaimer trademark copyright'],
    ['privacy.html', 'Privacy policy', 'privacy cookies adsense'],
    ['terms.html', 'Terms of use', 'terms conditions']
  ];
  $$('[data-search]').forEach(function (input) {
    var box = input.parentNode.querySelector('.search-results');
    function run() {
      var q = input.value.trim().toLowerCase();
      if (q.length < 2) { box.hidden = true; return; }
      var terms = q.split(/\s+/);
      var hits = INDEX.filter(function (r) { var hay = (r[1] + ' ' + r[2]).toLowerCase(); return terms.every(function (t) { return hay.indexOf(t) > -1; }); }).slice(0, 7);
      box.innerHTML = hits.length ? hits.map(function (r) { return '<a href="' + r[0] + '">' + esc(r[1]) + '<span>' + esc(r[2].split(' ').slice(0, 6).join(', ')) + '</span></a>'; }).join('') : '<p>No match. Try “tax”, “scam” or “odds”.</p>';
      box.hidden = false;
    }
    input.addEventListener('input', run);
    input.addEventListener('focus', run);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { var f = box.querySelector('a'); if (f) location.href = f.getAttribute('href'); }
      if (e.key === 'Escape') { box.hidden = true; input.blur(); }
    });
    d.addEventListener('click', function (e) { if (!input.parentNode.contains(e.target)) box.hidden = true; });
  });

  // ---- Cookie notice --------------------------------------------------------
  var consentKey = 'ml-consent', saved = null;
  try { saved = localStorage.getItem(consentKey); } catch (e) { saved = 'n/a'; }
  if (!saved) {
    var c = d.createElement('div');
    c.className = 'consent'; c.setAttribute('role', 'region'); c.setAttribute('aria-label', 'Cookie notice');
    c.innerHTML = '<p>We use cookies for ads (Google AdSense) and to remember your choices. Read our <a href="privacy.html">privacy policy</a>.</p><button class="btn btn-sm" data-c="accept">Accept</button><button class="btn btn-sm btn-ghost" data-c="decline">Decline</button>';
    d.body.appendChild(c);
    c.addEventListener('click', function (e) {
      var v = e.target.getAttribute('data-c'); if (!v) return;
      try { localStorage.setItem(consentKey, v); } catch (x) {}
      c.remove();
    });
  }

  // ---- Email links (address never rendered in the page) ---------------------
  $$('[data-mail]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      location.href = 'mailto:' + inbox() + '?subject=' + encodeURIComponent(a.getAttribute('data-mail') || 'Hello from MatkaLottery.com');
    });
  });

  // ---- Forms -> FormSubmit (AJAX) with mailto fallback ----------------------
  $$('form[data-form]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!f.reportValidity()) return;
      var trap = f.querySelector('[name=_gotcha]');
      if (trap && trap.value) return;
      var st = f.querySelector('.status'), btn = f.querySelector('[type=submit]');
      var data = {};
      new FormData(f).forEach(function (v, k) { if (k === '_gotcha') return; data[k] = data[k] ? data[k] + ', ' + v : v; });
      var subject = f.getAttribute('data-form') + (data.priority ? ' [' + data.priority + ']' : '') + ' — MatkaLottery.com';
      data._subject = subject; data._template = 'table'; data._captcha = 'false'; data.page = location.href;
      if (st) { st.className = 'status'; st.textContent = 'Sending…'; }
      if (btn) btn.disabled = true;
      function done(ok) {
        if (btn) btn.disabled = false;
        if (ok) {
          if (st) { st.className = 'status ok'; st.textContent = f.getAttribute('data-ok') || 'Thank you — your message has been sent. We reply within 2 working days.'; }
          f.reset(); f.dispatchEvent(new Event('ml:sent'));
        } else {
          var body = Object.keys(data).filter(function (k) { return k.charAt(0) !== '_'; }).map(function (k) { return k + ': ' + data[k]; }).join('\n');
          if (st) { st.className = 'status ok'; st.textContent = 'Opening your email app to finish sending…'; }
          location.href = 'mailto:' + inbox() + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        }
      }
      fetch('https://formsubmit.co/ajax/' + inbox(), { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { return r.json(); })
        .then(function (j) { done(String(j.success) === 'true'); })
        .catch(function () { done(false); });
    });
  });

  // ---- Multi-step forms -------------------------------------------------------
  $$('[data-steps]').forEach(function (wrap) {
    var steps = $$('.step', wrap), bars = $$('.progress li', wrap), i = 0;
    function show(n, focus) {
      i = n;
      steps.forEach(function (s, k) { s.hidden = k !== n; });
      bars.forEach(function (b, k) { b.classList.toggle('done', k <= n); });
      var h = steps[n].querySelector('h3, legend'); if (h && focus) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }
    wrap.addEventListener('click', function (e) {
      if (e.target.closest('[data-next]')) {
        var ok = $$('input,select,textarea', steps[i]).every(function (el) { return el.reportValidity(); });
        if (ok && i < steps.length - 1) show(i + 1, true);
      }
      if (e.target.closest('[data-prev]') && i > 0) show(i - 1, true);
    });
    var form = wrap.closest('form') || wrap;
    form.addEventListener('ml:sent', function () { show(0); });
    show(0);
  });

  // ---- Quick take-home estimate (hero + lead form) ----------------------------
  $$('[data-quicktax]').forEach(function (box) {
    var prize = box.querySelector('[name=qt_prize]'), kerala = box.querySelector('[name=qt_kerala]');
    function upd() {
      var r = prizeTax({ prize: prize.value, commission: kerala && kerala.checked ? 10 : 0, regime: 'new' });
      var set = function (k, v) { var el = box.querySelector('[data-out=' + k + ']'); if (el) el.textContent = v; };
      set('net', words(r.net)); set('comm', inr(r.comm)); set('tax', inr(r.tax)); set('prize', words(r.prize));
      set('pct', r.prize ? Math.round(r.net / r.prize * 100) + '%' : '–');
    }
    prize.addEventListener('input', upd); if (kerala) kerala.addEventListener('change', upd); upd();
  });

  // ---- Lead priority (winner help) -------------------------------------------
  $$('[data-priority-from]').forEach(function (sel) {
    var out = d.getElementById(sel.getAttribute('data-priority-from'));
    function upd() { var v = +sel.value || 0; if (out) out.value = v >= 1e7 ? 'HOT' : v >= 1e6 ? 'WARM' : 'STANDARD'; var est = d.querySelector('[data-lead-est]'); if (est) { var r = prizeTax({ prize: v, commission: 10, regime: 'new' }); est.textContent = v ? 'On a Kerala ticket of this size you would keep about ' + words(r.net) + ' after commission and tax.' : ''; } }
    sel.addEventListener('change', upd); upd();
  });

  // ---- Live widgets -----------------------------------------------------------
  var KERALA = ['Samrudhi', 'Bhagyathara', 'Sthree Sakthi', 'Dhanalekshmi', 'Karunya Plus', 'Suvarna Keralam', 'Karunya'];
  var BUMPERS = [[0, 'Christmas–New Year Bumper'], [2, 'Summer Bumper'], [4, 'Vishu Bumper'], [6, 'Monsoon Bumper'], [8, 'Thiruvonam Bumper'], [10, 'Pooja Bumper']];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var SCAMS = [
    ['“KBC ₹25 lakh lottery” on WhatsApp', 'Kaun Banega Crorepati does not run lotteries. The “manager” will ask for a registration fee next.'],
    ['Pay GST to release your prize', 'Genuine prize tax is deducted before payment. Anyone asking you to pay tax first is a fraudster.'],
    ['Kerala lottery tickets sold online', 'Kerala lottery is sold as paper tickets through authorised agents in Kerala. Online “Kerala lottery” sellers are fake.'],
    ['“100% fix” matka number for a fee', 'Nobody can leak a random result. Paid “fix game” tips are a scam on top of an illegal game.'],
    ['Foreign lottery email', 'You cannot win a lottery you never entered. Emails about UK, US or “international” lottery wins are bait.'],
    ['“Scan this QR to receive money”', 'Scanning a QR code and entering your UPI PIN sends money. You never need a PIN to receive.'],
    ['Lucky draw from a shopping app', 'Fake “spin the wheel” pages copy big brands, then ask for a delivery or insurance fee.'],
    ['Prize courier stuck at customs', 'Customs officers do not call you to collect fees in a personal account.'],
    ['“RBI approved” lottery certificate', 'The Reserve Bank of India does not hold or approve lottery funds. Official-looking letters are forged.'],
    ['OTP to verify your prize', 'An OTP authorises a payment or login. Sharing it hands over your account.'],
    ['Lottery winner “agent” on Instagram', 'Real lottery departments do not DM winners. Verify only through the official website or office.'],
    ['Refund of “excess” prize money', 'A fake payment screenshot followed by a “please send the extra back” request is a classic trick.'],
    ['Video call from a “prize officer”', 'Fraudsters use uniforms, logos and fake ID cards on video calls. Hang up and call 1930 if money was lost.'],
    ['Pay to join a “lottery syndicate”', 'Strangers pooling money in a WhatsApp group usually disappear with it.']
  ];
  var MYTHS = [
    ['“This number is due.”', 'Draws have no memory. A number that has not appeared for months has exactly the same chance as any other.'],
    ['“Hot numbers keep winning.”', 'Short streaks happen in any random sequence. They do not predict the next draw.'],
    ['“Buying from a lucky shop helps.”', 'Shops that sell more tickets sell more winners. Your ticket’s chance is unchanged.'],
    ['“A system can beat the lottery.”', 'Wheels and systems only buy more combinations. More tickets cost proportionally more and the expected loss grows.'],
    ['“Birthdays are lucky numbers.”', 'They are no luckier, and because many people pick them, you are more likely to share a prize.'],
    ['“Matka results can be leaked.”', 'Anyone selling a “leaked” result is selling a lie. And matka is illegal in India.'],
    ['“The big prize is tax-free.”', 'Prizes are taxed at 30% plus surcharge and 4% cess, with no deductions allowed.'],
    ['“I’m close — I matched 5 of 6.”', 'Near misses feel meaningful but are just one of many losing outcomes.'],
    ['“Playing more often improves my odds.”', 'Each ticket has the same small chance. Playing more just multiplies what you spend.'],
    ['“Winners are chosen in advance.”', 'State draws are public and audited. The real risk is fake sites, not the official draw.'],
    ['“Quick picks never win.”', 'Quick picks and chosen numbers have identical odds; most winners in many lotteries are quick picks because most tickets are.'],
    ['“One big win fixes everything.”', 'Without planning, large windfalls often disappear within a few years. Get professional advice first.']
  ];
  var di = dayIndex(), now = ist();
  $$('[data-widget]').forEach(function (el) {
    var t = el.getAttribute('data-widget'), big = el.querySelector('.big'), p = el.querySelector('p:not(.big)');
    if (t === 'kerala') {
      big.textContent = KERALA[now.getDay()];
      p.innerHTML = 'Kerala’s weekly draw for ' + now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }) + ', usually at 3 pm. Check results only at <a href="https://statelottery.kerala.gov.in/" target="_blank" rel="noopener">the official site</a>.';
    } else if (t === 'bumper') {
      var m = now.getMonth(), nb = BUMPERS.filter(function (b) { return b[0] >= m; })[0] || BUMPERS[0];
      big.textContent = nb[1];
      p.textContent = nb[0] === m ? 'Kerala’s bumper season for ' + MONTHS[m] + '. Fake “bumper ticket” sellers peak now — buy only from authorised agents.' : 'Next Kerala bumper, usually drawn in ' + MONTHS[nb[0]] + '. Dates are set by the lottery department.';
    } else if (t === 'scam') {
      var s = SCAMS[di % SCAMS.length]; big.textContent = s[0]; p.textContent = s[1];
    } else if (t === 'myth') {
      var y = MYTHS[di % MYTHS.length]; big.textContent = y[0]; p.textContent = y[1];
    }
  });

  // ---- Click-to-load YouTube --------------------------------------------------
  $$('.video button[data-yt]').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = d.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + b.getAttribute('data-yt') + '?autoplay=1&rel=0';
      f.title = b.textContent.trim();
      f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';
      f.allowFullscreen = true; f.loading = 'lazy';
      b.parentNode.replaceChild(f, b);
    });
  });

  // ---- Live news (Google News RSS via rss2json, fallback to saved list) ------
  function when(s) {
    if (!s) return '';
    var t = /^\d{4}-\d\d-\d\d \d/.test(s) ? Date.parse(s.replace(' ', 'T') + 'Z') : Date.parse(s);
    return isNaN(t) ? '' : new Date(t).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  $$('[data-news]').forEach(function (el) {
    var q = el.getAttribute('data-news'), n = +el.getAttribute('data-count') || 6, label = el.parentNode.querySelector('[data-news-label]');
    function render(items, live) {
      items = items.filter(function (x) { return x && x.title && x.link; }).slice(0, n);
      if (!items.length) throw new Error('empty');
      el.innerHTML = items.map(function (x) { return '<li><a href="' + esc(x.link) + '" target="_blank" rel="noopener nofollow">' + esc(x.title) + '</a><span class="src">' + esc(x.source || '') + (x.date ? ' — ' + when(x.date) : '') + '</span></li>'; }).join('');
      if (label) label.textContent = live ? 'Live headlines, refreshed on every visit.' : 'Saved headlines (live feed unavailable right now).';
    }
    function saved() {
      return fetch('data/news.json').then(function (r) { return r.json(); }).then(function (j) {
        var topic = el.getAttribute('data-topic');
        render((j.items || []).filter(function (x) { return !topic || x.topic === topic; }), false);
      });
    }
    var rss = 'https://news.google.com/rss/search?q=' + encodeURIComponent(q) + '&hl=en-IN&gl=IN&ceid=IN:en';
    fetch(CFG.newsProxy + encodeURIComponent(rss)).then(function (r) { return r.json(); }).then(function (j) {
      if (j.status !== 'ok' || !j.items || !j.items.length) throw new Error('feed');
      render(j.items.map(function (it) { var t = it.title || '', i = t.lastIndexOf(' - '); return { title: i > 0 ? t.slice(0, i) : t, source: i > 0 ? t.slice(i + 3) : 'Google News', link: it.link, date: it.pubDate }; }), true);
    }).catch(function () { return saved(); }).catch(function () { el.innerHTML = '<li>Headlines are unavailable right now. Please try again later.</li>'; });
  });

  // ---- Donation buttons --------------------------------------------------------
  $$('[data-tier]').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('[data-tier]').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      var amt = d.getElementById('pledge-amount'); if (amt) amt.value = b.getAttribute('data-tier');
      var form = d.getElementById('pledge'); if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  var dl = $('[data-donate-links]');
  if (dl) {
    var links = [];
    if (CFG.donate.upi) links.push('<a class="btn" href="upi://pay?pa=' + encodeURIComponent(CFG.donate.upi) + '&pn=MatkaLottery.com&cu=INR">Pay by UPI</a>');
    if (CFG.donate.paypal) links.push('<a class="btn btn-ink" href="' + esc(CFG.donate.paypal) + '" target="_blank" rel="noopener">Give with PayPal</a>');
    if (CFG.donate.bmc) links.push('<a class="btn btn-ghost" href="' + esc(CFG.donate.bmc) + '" target="_blank" rel="noopener">Buy us a chai</a>');
    if (links.length) dl.innerHTML = '<div class="btn-row">' + links.join('') + '</div>';
  }
})();
