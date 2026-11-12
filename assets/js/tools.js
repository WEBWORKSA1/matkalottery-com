/* MatkaLottery.com — calculators and checkers. Everything runs in the browser; nothing is sent anywhere. */
(function () {
  'use strict';
  var ML = window.ML; if (!ML) return;
  var d = document, $ = ML.$, inr = ML.inr, words = ML.words, esc = ML.esc;
  function num(el) { return parseFloat(String(el && el.value || '').replace(/[^\d.]/g, '')) || 0; }
  function pct(x, dp) { return (x * 100).toFixed(dp == null ? 1 : dp) + '%'; }

  // ---------------- Prize tax calculator ----------------
  var tf = d.getElementById('tax-form');
  if (tf) {
    var typeSel = tf.elements.lt, commIn = tf.elements.commission;
    typeSel.addEventListener('change', function () { if (typeSel.value !== 'custom') commIn.value = typeSel.value; });
    commIn.addEventListener('input', function () { typeSel.value = 'custom'; });
    var calc = function () {
      var rg = tf.querySelector('[name=regime]:checked');
      var r = ML.prizeTax({ prize: num(tf.elements.prize), commission: num(commIn), other: num(tf.elements.other), regime: rg ? rg.value : 'new' });
      var rows = [
        ['Advertised prize', inr(r.prize)],
        ['Agent commission', (r.comm ? '− ' : '') + inr(r.comm)],
        ['Taxable winnings', inr(r.taxable)],
        ['Income tax at 30%', '− ' + inr(r.base)],
        ['Surcharge (' + Math.round(r.sr * 100) + '% of tax)', '− ' + inr(r.sur)],
        ['Health & education cess (4%)', '− ' + inr(r.cess)]
      ];
      $('#tax-rows').innerHTML = rows.map(function (x) { return '<tr><td>' + x[0] + '</td><td>' + x[1] + '</td></tr>'; }).join('') + '<tr class="total"><td>You keep</td><td>' + inr(r.net) + '</td></tr>';
      $('#tax-net').textContent = words(r.net);
      $('#tax-pct').textContent = r.prize ? 'That is ' + pct(r.net / r.prize) + ' of the advertised prize.' : 'Enter a prize amount to see the breakdown.';
      $('#tax-tds').textContent = r.tds ? 'Paid into your bank after 30% TDS: about ' + inr(r.paid) + '. The surcharge and cess (about ' + inr(r.due) + ') are usually still yours to pay as advance tax.' : 'Prizes of ₹10,000 or less are paid without TDS, but the 30% tax still applies when you file your return.';
      var P = r.prize || 1;
      $('#tax-stack').innerHTML = [[r.net, 'var(--green)'], [r.tax, 'var(--red)'], [r.comm, 'var(--gold)']].map(function (s) { return '<i style="width:' + (s[0] / P * 100) + '%;background:' + s[1] + '"></i>'; }).join('');
    };
    tf.addEventListener('input', calc); tf.addEventListener('change', calc);
    tf.addEventListener('submit', function (e) { e.preventDefault(); calc(); });
    calc();
  }

  // ---------------- Odds calculator ----------------
  function C(n, k) {
    n = BigInt(n); k = BigInt(k);
    if (k < 0n || k > n) return 0n;
    if (k > n - k) k = n - k;
    var r = 1n;
    for (var i = 1n; i <= k; i++) r = r * (n - k + i) / i;
    return r;
  }
  function oneIn(den, nm) {
    if (nm === 0n) return 'Not possible';
    var x = Number(den * 1000n / nm) / 1000;
    return '1 in ' + x.toLocaleString('en-IN', { maximumFractionDigits: x < 10 ? 2 : 0 });
  }
  var of = d.getElementById('odds-form');
  if (of) {
    var E = of.elements;
    var oddsCalc = function () {
      var n = +E.n.value, k = +E.k.value, m = +E.m.value, B = +E.B.value || 0, b = +E.b.value || 0, bm = +E.bm.value || 0;
      var err = $('#odds-err');
      err.textContent = '';
      if (!(n > 0 && n <= 1000 && k > 0 && k <= n && m >= 0 && m <= k)) { err.textContent = 'Check the numbers: you need 1 ≤ numbers drawn ≤ pool size (max 1000) and matches ≤ numbers drawn.'; return; }
      if (B > 0 && !(b >= 1 && b <= B && bm >= 0 && bm <= b)) { err.textContent = 'Check the bonus pool: bonus numbers drawn must be between 1 and the bonus pool size.'; return; }
      var den = C(n, k), nm = C(k, m) * C(n - k, k - m);
      if (B > 0) { den = den * C(B, b); nm = nm * C(b, bm) * C(B - b, b - bm); }
      $('#odds-main').textContent = oneIn(den, nm);
      $('#odds-combos').textContent = 'Different tickets possible: ' + (C(n, k) * (B > 0 ? C(B, b) : 1n)).toLocaleString('en-IN');
      var rows = '';
      for (var i = k; i >= 0; i--) rows += '<tr><td>Match ' + i + ' of ' + k + ' main numbers</td><td>' + oneIn(C(n, k), C(k, i) * C(n - k, k - i)) + '</td></tr>';
      $('#odds-table').innerHTML = rows;
    };
    of.addEventListener('input', oddsCalc);
    of.addEventListener('submit', function (e) { e.preventDefault(); oddsCalc(); });
    ML.$$('[data-preset]').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-preset').split(',');
        ['n', 'k', 'm', 'B', 'b', 'bm'].forEach(function (f, i) { E[f].value = v[i]; });
        oddsCalc();
      });
    });
    oddsCalc();
  }

  var rf = d.getElementById('raffle-form');
  if (rf) {
    var raffle = function () {
      var N = num(rf.elements.N), t = num(rf.elements.t), p = num(rf.elements.p), out = $('#raffle-out');
      if (!(N > 0 && t > 0 && t <= N && p > 0 && p <= N)) { out.textContent = 'Enter tickets printed, tickets you hold and number of prizes (each at least 1).'; return; }
      var q = 1, lim = Math.min(p, 200000);
      for (var i = 0; i < lim; i++) { var a = (N - t - i) / (N - i); if (a <= 0) { q = 0; break; } q *= a; }
      var P = 1 - q;
      out.innerHTML = 'Chance of winning at least one of these prizes: <b>' + (P >= 0.001 ? pct(P, 2) : (P * 100).toPrecision(2) + '%') + '</b>' + (P > 0 && P < 1 ? ' — about <b>1 in ' + Math.round(1 / P).toLocaleString('en-IN') + '</b>.' : '.');
    };
    rf.addEventListener('input', raffle); rf.addEventListener('submit', function (e) { e.preventDefault(); raffle(); }); raffle();
  }

  var ef = d.getElementById('ev-form');
  if (ef) {
    var ev = function () {
      var price = num(ef.elements.price), N = num(ef.elements.N), total = 0, after = 0, out = $('#ev-out');
      ef.elements.prizes.value.split(/\n/).forEach(function (l) {
        var parts = l.split(/[x×*]/i); if (parts.length < 2) return;
        var pr = parseFloat(parts[0].replace(/[^\d.]/g, '')) || 0, ct = parseFloat(parts[1].replace(/[^\d.]/g, '')) || 0;
        total += pr * ct; after += (pr > 10000 ? pr * 0.688 : pr) * ct;
      });
      if (!(price > 0 && N > 0 && total > 0)) { out.textContent = 'Fill in the ticket price, tickets printed and at least one prize line such as “1,00,000 x 5”.'; return; }
      var e1 = total / N, e2 = after / N;
      out.innerHTML = '<table class="kv"><tr><td>Prize money paid back per ticket (before tax)</td><td>' + inr(e1) + ' (' + pct(e1 / price) + ')</td></tr><tr><td>After 31.2% tax on prizes above ₹10,000</td><td>' + inr(e2) + ' (' + pct(e2 / price) + ')</td></tr><tr class="total"><td>Average loss per ₹' + price.toLocaleString('en-IN') + ' ticket</td><td>' + inr(price - e2) + '</td></tr></table>';
    };
    ef.addEventListener('input', ev); ef.addEventListener('submit', function (e) { e.preventDefault(); ev(); }); ev();
  }

  // ---------------- Scam message checker ----------------
  var RULES = [
    [/\b(otp|upi pin|atm pin|pin number|cvv|password|one[- ]time)\b/i, 30, 'Asks for an OTP, PIN, CVV or password. No lottery, bank or government office ever needs these.'],
    [/(matka|satta|jodi|panna|\bank\b).{0,60}(fix|leak|pakka|confirm|sure|100 ?%)|(fix|leak|pakka|confirm|sure|100 ?%).{0,60}(matka|satta|jodi|panna|\bank\b)/i, 30, 'Sells a “fixed” or “leaked” matka number. Random results cannot be leaked — and matka is illegal in India.'],
    [/\b(processing|registration|clearance|release|delivery|courier|customs|gst|stamp duty|insurance|transfer|verification|token)\b.{0,25}\b(fee|fees|charge|charges|amount|money|tax)\b|\b(fee|charges?)\b.{0,30}\b(prize|claim|release|lottery)\b/i, 28, 'Asks you to pay a fee or tax before you get the prize. Real prize tax is deducted before payment — you never pay first.'],
    [/(kerala|kerla|state) ?lottery.{0,60}(online|buy|purchase|book|whatsapp|ticket)/i, 22, 'Offers Kerala or state lottery tickets online or on WhatsApp. Kerala tickets are sold only on paper through authorised agents in Kerala.'],
    [/(you('ve| have)? (won|been selected)|winner|congratulation|lucky draw|lucky winner|jackpot|lottery (no|number)|aapki lottery|lottery lagi|inaam)/i, 12, 'Says you have won something. You cannot win a draw you never entered.'],
    [/\b(kbc|kaun banega|whatsapp lottery|jio|airtel|vodafone|bsnl|amazon|flipkart|reliance|tata|rbi|reserve bank|google|microsoft|coca[- ]?cola|sbi|income tax department|customs department)\b/i, 15, 'Uses a famous brand or government name. These organisations do not hand out lottery prizes by message.'],
    [/\b(upi|gpay|google pay|phonepe|paytm|bank account|account (no|number)|ifsc|gift card|crypto|bitcoin|usdt|qr code|scan)\b/i, 15, 'Mentions payment apps, bank details or QR codes. Receiving money never needs your PIN or a QR scan.'],
    [/\+(?!91\b)(\d{1,3})[\s-]?\d{3,}/, 15, 'Contains a foreign phone number. Most “prize manager” numbers in Indian lottery frauds are overseas.'],
    [/(urgent|immediately|within \d+ ?(hours?|hrs|minutes|mins|days)|today only|last chance|expire|act now|jaldi|turant|abhi)/i, 10, 'Creates urgency so you act before thinking.'],
    [/(https?:\/\/|www\.|bit\.ly|tinyurl|\.xyz|\.top|\.link|\.click|\.online)/i, 10, 'Contains a link. Do not tap links in prize messages.'],
    [/(guarantee|guaranteed|100 ?% (sure|win|safe)|no risk|double your)/i, 15, 'Promises guaranteed wins or returns. Nobody can guarantee a lottery or game result.'],
    [/(uk lottery|international lottery|euro ?millions|powerball|mega millions|national lottery|foreign lottery)/i, 15, 'Claims a win in a foreign or “international” lottery. Those require buying a ticket; email wins are fake.'],
    [/(aadhaar|aadhar|pan card|passport|kyc|selfie with)/i, 10, 'Asks for ID documents. These can be misused for loans and SIM cards in your name.'],
    [/(don'?t tell|do not tell|keep (it|this) (secret|confidential)|kisi ko mat|kisi ko na)/i, 10, 'Asks you to keep it secret — a pressure tactic so no one warns you.'],
    [/(refundable|send back|sent extra|excess amount|overpaid|wrongly sent)/i, 12, 'Talks about refunds or money sent “by mistake” — a common overpayment trick.']
  ];
  var sf = d.getElementById('scam-form');
  if (sf) {
    var ta = sf.elements.msg, res = $('#scam-result');
    var check = function () {
      var t = ta.value.trim();
      if (t.length < 8) { res.hidden = true; return; }
      var hits = RULES.filter(function (r) { return r[0].test(t); });
      var score = Math.min(100, hits.reduce(function (s, r) { return s + r[1]; }, 0));
      var level = score >= 40 ? ['Very likely a scam', 'var(--red)'] : score >= 15 ? ['Suspicious — verify before doing anything', 'var(--gold)'] : ['No common scam signals found', 'var(--green)'];
      $('#scam-verdict').textContent = level[0];
      $('#scam-verdict').style.color = score >= 15 && score < 40 ? 'var(--ink)' : level[1];
      var bar = $('#scam-meter'); bar.style.width = Math.max(4, score) + '%'; bar.style.background = level[1];
      $('#scam-score').textContent = 'Risk score: ' + score + ' / 100';
      $('#scam-reasons').innerHTML = hits.length ? hits.map(function (r) { return '<li>' + esc(r[2]) + '</li>'; }).join('') : '<li>We did not spot the usual red flags. That does not prove it is genuine — verify through the organisation’s official website or office, never through numbers in the message.</li>';
      var share = 'I checked a “you won” message with the free MatkaLottery.com scam checker: ' + level[0] + '. Check yours before you pay anyone: https://matkalottery.com/scam-checker.html';
      $('#scam-share').href = 'https://wa.me/?text=' + encodeURIComponent(share);
      res.hidden = false;
    };
    sf.addEventListener('submit', function (e) { e.preventDefault(); check(); if (!res.hidden) res.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });
    var ex = $('#scam-example');
    if (ex) ex.addEventListener('click', function () {
      ta.value = 'Congratulations!! Your WhatsApp number has won Rs 25,00,000 in the KBC Lucky Draw 2026. Lottery No 8899. To claim, contact our manager on WhatsApp +44 7700 900123. Pay Rs 12,500 processing fee by UPI within 24 hours or the prize will expire. Do not tell anyone until the money is in your bank account.';
      check();
    });
    var clr = $('#scam-clear');
    if (clr) clr.addEventListener('click', function () { ta.value = ''; res.hidden = true; ta.focus(); });
  }

  // ---------------- Lifetime simulator ----------------
  function poisson(l) {
    if (l > 30) { var g = Math.sqrt(-2 * Math.log(Math.random() || 1e-12)) * Math.cos(2 * Math.PI * Math.random()); return Math.max(0, Math.round(l + Math.sqrt(l) * g)); }
    var L = Math.exp(-l), k = 0, p = 1;
    do { k++; p *= Math.random(); } while (p > L);
    return k - 1;
  }
  function drawChart(cv, yrs, spent, back) {
    var dpr = window.devicePixelRatio || 1, W = cv.clientWidth, H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    var c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, W, H);
    var pl = 84, pr = 16, pt = 18, pb = 34, max = Math.max(spent, back) * 1.1 || 1;
    var X = function (y) { return pl + (W - pl - pr) * y / yrs; }, Y = function (v) { return H - pb - (H - pt - pb) * v / max; };
    c.font = '12px Hind, system-ui, sans-serif'; c.lineWidth = 1;
    for (var i = 0; i <= 4; i++) { var v = max * i / 4, y = Y(v); c.strokeStyle = '#E1E5EF'; c.beginPath(); c.moveTo(pl, y); c.lineTo(W - pr, y); c.stroke(); c.fillStyle = '#4A5078'; c.fillText(words(v), 4, y + 4); }
    var step = yrs <= 10 ? 1 : Math.ceil(yrs / 10);
    for (var yy = 0; yy <= yrs; yy += step) c.fillText(yy + 'y', X(yy) - 8, H - 12);
    function line(val, color) { c.strokeStyle = color; c.lineWidth = 3; c.beginPath(); c.moveTo(X(0), Y(0)); c.lineTo(X(yrs), Y(val)); c.stroke(); }
    line(spent, '#C81E63'); line(back, '#0E6E55');
    c.font = '600 13px Hind, system-ui, sans-serif';
    c.fillStyle = '#C81E63'; c.fillText('Money spent', pl + 10, pt + 6);
    c.fillStyle = '#0E6E55'; c.fillText('Expected prizes back', pl + 110, pt + 6);
  }
  var simf = d.getElementById('sim-form');
  if (simf) {
    var S = simf.elements, cv = d.getElementById('sim-chart');
    var sim = function () {
      var price = num(S.price), per = num(S.per), yrs = Math.max(1, Math.min(60, num(S.years))), prize = num(S.top), odds = num(S.odds), ret = Math.min(100, num(S.ret)) / 100;
      var T = Math.round(per * 52 * yrs), spent = T * price, p = odds > 0 ? 1 / odds : 0;
      var small = spent * ret, back = small + T * p * prize, ever = 1 - Math.pow(1 - p, T);
      var runs = 1000, wins = 0, nets = [];
      for (var i = 0; i < runs; i++) { var j = poisson(T * p), net = small + j * prize - spent; if (net > 0) wins++; nets.push(net); }
      nets.sort(function (a, b) { return a - b; });
      var set = function (id, v) { d.getElementById(id).textContent = v; };
      set('sim-tickets', T.toLocaleString('en-IN'));
      set('sim-spent', words(spent));
      set('sim-back', words(back));
      set('sim-loss', words(spent - back));
      set('sim-ever', ever >= 0.0001 ? pct(ever, 2) : '< 0.01%');
      set('sim-profit', wins + ' of ' + runs);
      set('sim-median', (nets[runs / 2] < 0 ? '−' : '') + words(Math.abs(nets[runs / 2])));
      if (cv) drawChart(cv, yrs, spent, back);
    };
    simf.addEventListener('input', sim); simf.addEventListener('submit', function (e) { e.preventDefault(); sim(); });
    window.addEventListener('resize', sim); sim();
  }

  // ---------------- Random number generator ----------------
  function rand(n) { var a = new Uint32Array(1), lim = Math.floor(4294967296 / n) * n, x; do { crypto.getRandomValues(a); x = a[0]; } while (x >= lim); return x % n; }
  function pick(k, n) { var pool = [], i; for (i = 1; i <= n; i++) pool.push(i); for (i = 0; i < k; i++) { var j = i + rand(n - i), t = pool[i]; pool[i] = pool[j]; pool[j] = t; } return pool.slice(0, k).sort(function (a, b) { return a - b; }); }
  var gf = d.getElementById('rng-form');
  if (gf) {
    gf.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = num(gf.elements.n), k = num(gf.elements.k), sets = Math.min(10, Math.max(1, num(gf.elements.sets))), B = num(gf.elements.B), b = num(gf.elements.b), out = $('#rng-out');
      if (!(n >= 2 && n <= 1000 && k >= 1 && k <= n)) { out.innerHTML = '<p class="status err">Choose a pool of 2–1000 numbers and pick no more numbers than the pool holds.</p>'; return; }
      if (B && !(b >= 1 && b <= B && B <= 100)) { out.innerHTML = '<p class="status err">The bonus pool needs 1–100 numbers and at least one bonus pick.</p>'; return; }
      var html = '';
      for (var s = 1; s <= sets; s++) {
        html += '<div class="set"><span>Set ' + s + '</span><div class="balls">' + pick(k, n).map(function (x) { return '<b class="ball">' + x + '</b>'; }).join('') + (B ? pick(b, B).map(function (x) { return '<b class="ball b2">' + x + '</b>'; }).join('') : '') + '</div></div>';
      }
      out.innerHTML = html;
    });
  }

  // ---------------- Self-check ----------------
  var qf = d.getElementById('self-form');
  if (qf) {
    qf.addEventListener('submit', function (e) {
      e.preventDefault();
      var qs = ML.$$('fieldset', qf), total = 0, missing = 0, out = $('#self-out');
      qs.forEach(function (f) { var c = f.querySelector('input:checked'); if (c) total += +c.value; else missing++; });
      if (missing) { out.hidden = false; out.innerHTML = '<p class="status err">Please answer all ' + qs.length + ' questions (' + missing + ' left).</p>'; return; }
      var band = total === 0 ? ['No warning signs in your answers', 'var(--green)', 'Keep it that way: set a monthly limit and never borrow to play.']
        : total <= 4 ? ['Low risk', 'var(--green)', 'A few signs are showing. Set a firm budget, avoid chasing losses and check in with yourself again next month.']
        : total <= 9 ? ['Moderate risk', 'var(--gold)', 'Gambling may already be costing you. Talking to a counsellor now is easier than later — the services below are free and confidential.']
        : ['High risk — please talk to someone today', 'var(--red)', 'Your answers suggest gambling is causing real harm. Call Tele-MANAS on 14416 (free, 24×7, many languages) or one of the services below.'];
      out.hidden = false;
      out.innerHTML = '<p class="meta">Your score: ' + total + ' of ' + (qs.length * 3) + '</p><p class="verdict" style="color:' + (band[1] === 'var(--gold)' ? 'var(--ink)' : band[1]) + '">' + band[0] + '</p><div class="meter"><i style="width:' + Math.max(4, total / (qs.length * 3) * 100) + '%;background:' + band[1] + '"></i></div><p style="margin-top:12px">' + band[2] + '</p><p><a class="btn btn-sm" href="#help">See free support</a></p>';
      out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
})();
