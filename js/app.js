const $ = (sel, el = document) => el.querySelector(sel);

function loadUser() {
  try { return JSON.parse(localStorage.getItem("karibu_user") || "null"); }
  catch { return null; }
}
function saveUser(u) { localStorage.setItem("karibu_user", JSON.stringify(u)); }
function loadSet(key) {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); }
  catch { return []; }
}
function saveSet(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

function nav(user) {
  return `
    <nav class="nav">
      <a class="brand" href="#/">Karibu <span>Dates</span></a>
      <div class="nav-actions">
        ${user
          ? `<span class="muted">${user.name || user.email}</span>
             <a class="btn ghost" href="#/app/discover">Open app</a>
             <button class="btn" id="logout">Log out</button>`
          : `<a class="btn ghost" href="#/login">Log in</a>
             <a class="btn primary" href="#/register">Join free</a>`}
      </div>
    </nav>`;
}

function landing() {
  return `
    ${nav(loadUser())}
    <section class="hero">
      <div>
        <p class="kicker">Location-based matchmaking · Kenya</p>
        <h1>Meet someone nearby — Nairobi to Mombasa, Kisumu to Kiambu.</h1>
        <p class="lede">Create a profile, share your county, swipe people around you, and chat when it clicks. Filters for distance, age, interests, church or campus vibe. Optional tribe filter stays optional.</p>
        <div class="hero-cta">
          <a class="btn primary" href="#/register">Create your profile</a>
          <a class="btn ghost" href="#/app/discover">Peek at Discover</a>
        </div>
        <div class="stats">
          <div><b>47</b>counties</div>
          <div><b>GPS</b>nearby first</div>
          <div><b>M-Pesa</b>premium ready</div>
        </div>
      </div>
      <div class="card-stack">
        ${PROFILES.slice(0,3).map(p => `
          <article class="preview-card">
            <img src="${p.photo}" alt="${p.name}" />
            <div class="preview-meta">
              <strong>${p.name}, ${p.age}</strong>
              <div>${p.town}, ${p.county} · ${p.km} km</div>
            </div>
          </article>`).join("")}
      </div>
    </section>
    <section class="section">
      <div class="grid-3">
        <article class="feature"><h3>Nearby first</h3><p>We ask for location (or your county) and rank people by distance. Town + county matter more than a random nationwide feed.</p></article>
        <article class="feature"><h3>Kenyan filters</h3><p>Age, distance, county, religion, lifestyle mode, interests. Tribe is optional — never required.</p></article>
        <article class="feature"><h3>Safety built in</h3><p>Report, block, and hide a profile in two taps. Meet in public. We never show exact GPS to other users.</p></article>
      </div>
    </section>
    <footer>Demo frontend · GitHub + Netlify · Photos from Unsplash · Not a live dating service yet.</footer>`;
}

function authForm(mode) {
  const isLogin = mode === "login";
  return `
    ${nav(loadUser())}
    <div class="auth-wrap">
      <p class="kicker">${isLogin ? "Welcome back" : "Karibu"}</p>
      <h2>${isLogin ? "Log in" : "Create an account"}</h2>
      <form class="panel" id="auth-form" style="margin-top:16px">
        ${isLogin ? "" : `<div class="field"><label>Name</label><input name="name" required placeholder="e.g. Sam" /></div>`}
        <div class="field"><label>Email</label><input name="email" type="email" required placeholder="you@email.com" /></div>
        <div class="field"><label>Password</label><input name="password" type="password" required minlength="6" /></div>
        <button class="btn primary full" type="submit">${isLogin ? "Log in" : "Continue"}</button>
        <p style="margin-top:12px;color:var(--muted)">${isLogin ? 'New here? <a href="#/register">Register</a>' : 'Have an account? <a href="#/login">Log in</a>'}</p>
      </form>
    </div>`;
}

function profileSetup(user) {
  const selected = new Set(user.interests || []);
  return `
    ${nav(user)}
    <div class="auth-wrap" style="max-width:640px">
      <p class="kicker">Profile</p>
      <h2>Tell people who you are</h2>
      <form class="panel" id="profile-form" style="margin-top:16px">
        <div class="field"><label>Display name</label><input name="name" value="${user.name || ""}" required /></div>
        <div class="field"><label>Age</label><input name="age" type="number" min="18" max="80" value="${user.age || 25}" required /></div>
        <div class="field"><label>County</label>
          <select name="county">${COUNTIES.map(c => `<option ${user.county===c?"selected":""}>${c}</option>`).join("")}</select>
        </div>
        <div class="field"><label>Town / estate</label><input name="town" value="${user.town || ""}" placeholder="Kilimani, Nyali, Milimani…" /></div>
        <div class="field"><label>Religion</label>
          <select name="religion">
            ${["Prefer not to say","Christian","Muslim","Hindu","Other"].map(r => `<option ${user.religion===r?"selected":""}>${r}</option>`).join("")}
          </select>
        </div>
        <div class="field"><label>Mode</label>
          <select name="mode">${MODES.map(m => `<option ${user.mode===m?"selected":""}>${m}</option>`).join("")}</select>
        </div>
        <div class="field"><label>Tribe (optional)</label><input name="tribe" value="${user.tribe || ""}" placeholder="Leave blank if you prefer" /></div>
        <div class="field"><label>Bio</label><textarea name="bio" rows="3">${user.bio || ""}</textarea></div>
        <div class="field"><label>Interests</label>
          <div class="chips" id="interest-chips">
            ${INTERESTS.map(i => `<button type="button" class="chip ${selected.has(i)?"on":""}" data-i="${i}">${i}</button>`).join("")}
          </div>
        </div>
        <button class="btn primary full" type="submit">Save profile</button>
        <button class="btn ghost full" type="button" id="geo" style="margin-top:8px">Use my location</button>
      </form>
    </div>`;
}

function appChrome(user, active, inner) {
  return `
    ${nav(user)}
    <div class="app-layout">
      <aside class="side">
        <a class="${active==="discover"?"active":""}" href="#/app/discover">Discover</a>
        <a class="${active==="matches"?"active":""}" href="#/app/matches">Matches</a>
        <a class="${active==="chat"?"active":""}" href="#/app/chat">Chat</a>
        <a class="${active==="safety"?"active":""}" href="#/app/safety">Safety</a>
        <a class="${active==="premium"?"active":""}" href="#/app/premium">Premium</a>
        <a href="#/profile">Edit profile</a>
      </aside>
      <main class="main">${inner}</main>
    </div>`;
}

function getFilters() {
  return {
    county: $("#f-county")?.value || "Any",
    maxKm: Number($("#f-km")?.value || 50),
    minAge: Number($("#f-min")?.value || 18),
    maxAge: Number($("#f-max")?.value || 45),
    mode: $("#f-mode")?.value || "Any",
    religion: $("#f-rel")?.value || "Any"
  };
}

function filteredProfiles() {
  const likes = new Set(loadSet("karibu_likes"));
  const passes = new Set(loadSet("karibu_passes"));
  const blocked = new Set(loadSet("karibu_blocked"));
  let list = PROFILES.filter(p => !likes.has(p.id) && !passes.has(p.id) && !blocked.has(p.id));
  const f = window.__filters || { county:"Any", maxKm:50, minAge:18, maxAge:45, mode:"Any", religion:"Any" };
  return list.filter(p =>
    (f.county === "Any" || p.county === f.county) &&
    p.km <= f.maxKm &&
    p.age >= f.minAge && p.age <= f.maxAge &&
    (f.mode === "Any" || p.mode === f.mode) &&
    (f.religion === "Any" || p.religion === f.religion)
  );
}

function discoverView(user) {
  const list = filteredProfiles();
  const p = list[0];
  const filters = `
    <div class="toolbar">
      <select id="f-county"><option>Any</option>${COUNTIES.map(c=>`<option>${c}</option>`).join("")}</select>
      <select id="f-km"><option value="10">10 km</option><option value="25">25 km</option><option value="50" selected>50 km</option><option value="200">Whole county</option></select>
      <input id="f-min" type="number" value="18" style="width:70px" />
      <input id="f-max" type="number" value="40" style="width:70px" />
      <select id="f-mode"><option>Any</option>${MODES.map(m=>`<option>${m}</option>`).join("")}</select>
      <select id="f-rel"><option>Any</option><option>Christian</option><option>Muslim</option></select>
      <button class="btn" id="apply-f">Filter</button>
    </div>`;
  if (!p) {
    return appChrome(user, "discover", filters + `<div class="panel"><h2>That's everyone nearby</h2><p>Widen filters or check Matches.</p></div>`);
  }
  return appChrome(user, "discover", filters + `
    <div class="swipe-stage">
      <article class="swipe-card">
        <img src="${p.photo}" alt="${p.name}" />
        <div class="swipe-info">
          <h2>${p.name}, ${p.age}</h2>
          <p class="meta">${p.town}, ${p.county} · ${p.km} km · ${p.mode} · ${p.religion}</p>
          <p>${p.bio}</p>
          <div class="chips" style="margin-top:10px">${p.interests.map(i=>`<span class="chip on">${i}</span>`).join("")}</div>
        </div>
        <div class="actions">
          <button class="circle" data-act="pass" data-id="${p.id}">✕</button>
          <button class="circle" data-act="like" data-id="${p.id}">♥</button>
        </div>
      </article>
      <aside class="panel">
        <h3>How matching works</h3>
        <p style="color:var(--muted);margin:8px 0 12px">Demo uses mock distances. Live app would use Haversine and never expose exact pins.</p>
        <p><strong>${list.length}</strong> people in this filter set.</p>
        <button class="btn green full" style="margin-top:16px" id="boost">Boost my profile</button>
      </aside>
    </div>`);
}

function matchesView(user) {
  const likes = new Set(loadSet("karibu_likes"));
  const people = PROFILES.filter(p => likes.has(p.id));
  return appChrome(user, "matches", `
    <h2>Matches</h2>
    <p class="meta">In this demo a like becomes a match immediately.</p>
    <div class="people" style="margin-top:16px">
      ${people.length ? people.map(p => `
        <article class="person">
          <img src="${p.photo}" alt="" />
          <div class="p"><strong>${p.name}</strong><div class="meta">${p.county} · ${p.km} km</div>
          <a class="btn primary" href="#/app/chat?with=${p.id}" style="margin-top:8px;display:inline-block">Chat</a></div>
        </article>`).join("") : `<p>No matches yet. Heart someone on Discover.</p>`}
    </div>`);
}

function chatView(user) {
  const likes = loadSet("karibu_likes");
  const people = PROFILES.filter(p => likes.includes(p.id));
  const params = new URLSearchParams(location.hash.split("?")[1] || "");
  const withId = Number(params.get("with") || (people[0] && people[0].id));
  const other = PROFILES.find(p => p.id === withId) || people[0];
  const key = other ? "karibu_chat_" + other.id : "";
  const msgs = key ? loadSet(key) : [];
  if (!other) {
    return appChrome(user, "chat", `<div class="panel"><h2>No chats yet</h2><p>Match someone first.</p></div>`);
  }
  return appChrome(user, "chat", `
    <div class="chat">
      <div class="chat-list">
        ${people.map(p => `<div class="chat-item ${p.id===other.id?"active":""}" onclick="location.hash='#/app/chat?with=${p.id}'"><strong>${p.name}</strong><div class="meta">${p.county}</div></div>`).join("")}
      </div>
      <div class="thread">
        <div class="msgs" id="msgs">
          ${msgs.length ? msgs.map(m => `<div class="bubble ${m.me?"me":""}">${m.text}</div>`).join("") : `<div class="bubble">Hey ${user.name || ""} — nice to match. You in ${other.county} often?</div>`}
        </div>
        <form class="composer" id="chat-form">
          <input name="text" placeholder="Write something kind…" required />
          <button class="btn primary" type="submit">Send</button>
        </form>
      </div>
    </div>`;
}

function safetyView(user) {
  return appChrome(user, "safety", `
    <div class="panel">
      <h2>Safety & reports</h2>
      <p class="meta">Block hides them from Discover. Report is stored locally in this demo.</p>
      <div class="field" style="margin-top:16px"><label>Who?</label>
        <select id="rep-user">${PROFILES.map(p=>`<option value="${p.id}">${p.name} · ${p.county}</option>`).join("")}</select>
      </div>
      <div class="field"><label>Reason</label>
        <select id="rep-reason"><option>Fake profile</option><option>Harassment</option><option>Spam</option><option>Underage concern</option><option>Other</option></select>
      </div>
      <div class="field"><label>Details</label><textarea id="rep-note" rows="3"></textarea></div>
      <button class="btn danger" id="do-report">Report & block</button>
      <h3 style="margin-top:24px">Meeting tips</h3>
      <ul style="color:var(--muted);padding-left:18px">
        <li>Meet in a public place — mall, café, daytime.</li>
        <li>Tell a friend where you are going.</li>
        <li>Karibu never asks for M-Pesa to “verify” a match.</li>
      </ul>
    </div>`;
}

function premiumView(user) {
  return appChrome(user, "premium", `
    <div class="grid-3">
      <article class="panel"><h3>Free</h3><p>Daily swipes, county filters, chat after match.</p></article>
      <article class="panel"><h3>Boost · KES 150</h3><p>Be shown first in your county for 30 minutes. Pay with M-Pesa STK.</p><button class="btn primary" id="pay">Pay with M-Pesa</button></article>
      <article class="panel"><h3>Plus · KES 499 / mo</h3><p>See who liked you, rewind a swipe, travel mode for another county.</p></article>
    </div>`;
}

function render() {
  const app = $("#app");
  const hash = location.hash || "#/";
  const path = hash.replace("#", "").split("?")[0];
  const user = loadUser();

  if (path === "/" || path === "") app.innerHTML = landing();
  else if (path === "/login") app.innerHTML = authForm("login");
  else if (path === "/register") app.innerHTML = authForm("register");
  else if (path === "/profile") {
    if (!user) { location.hash = "#/login"; return; }
    app.innerHTML = profileSetup(user);
  }
  else if (path.startsWith("/app")) {
    if (!user) { location.hash = "#/login"; return; }
    if (path === "/app/matches") app.innerHTML = matchesView(user);
    else if (path === "/app/chat") app.innerHTML = chatView(user);
    else if (path === "/app/safety") app.innerHTML = safetyView(user);
    else if (path === "/app/premium") app.innerHTML = premiumView(user);
    else app.innerHTML = discoverView(user);
  } else app.innerHTML = landing();

  bind();
}

function bind() {
  $("#logout")?.addEventListener("click", () => {
    localStorage.removeItem("karibu_user");
    location.hash = "#/";
    toast("Logged out");
  });

  $("#auth-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const existing = loadUser() || {};
    const user = {
      ...existing,
      name: fd.get("name") || existing.name || "You",
      email: fd.get("email"),
      interests: existing.interests || []
    };
    saveUser(user);
    toast("Karibu!");
    location.hash = user.county ? "#/app/discover" : "#/profile";
  });

  $("#interest-chips")?.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    b.classList.toggle("on");
  });

  $("#profile-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const interests = [...document.querySelectorAll("#interest-chips .chip.on")].map(c => c.dataset.i);
    const user = { ...loadUser(), ...Object.fromEntries(fd.entries()), interests };
    saveUser(user);
    toast("Profile saved");
    location.hash = "#/app/discover";
  });

  $("#geo")?.addEventListener("click", () => {
    if (!navigator.geolocation) { toast("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const user = { ...loadUser(), lat: pos.coords.latitude, lng: pos.coords.longitude };
        saveUser(user);
        toast("Location saved (not shown to others)");
      },
      () => toast("Location permission denied — pick a county instead")
    );
  });

  $("#apply-f")?.addEventListener("click", () => {
    window.__filters = getFilters();
    render();
  });

  document.querySelectorAll("[data-act]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const key = btn.dataset.act === "like" ? "karibu_likes" : "karibu_passes";
      const arr = loadSet(key);
      if (!arr.includes(id)) arr.push(id);
      saveSet(key, arr);
      if (btn.dataset.act === "like") toast("It's a match (demo)");
      render();
    });
  });

  $("#chat-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.hash.split("?")[1] || "");
    const likes = loadSet("karibu_likes");
    const withId = Number(params.get("with") || likes[0]);
    const text = new FormData(e.target).get("text");
    const key = "karibu_chat_" + withId;
    const msgs = loadSet(key);
    msgs.push({ me: true, text });
    saveSet(key, msgs);
    setTimeout(() => {
      const replies = ["Sawa, let's grab chai.", "You free this weekend?", "Haha noted", "Which side of town?"];
      msgs.push({ me: false, text: replies[Math.floor(Math.random()*replies.length)] });
      saveSet(key, msgs);
      render();
    }, 600);
    render();
  });

  $("#do-report")?.addEventListener("click", () => {
    const id = Number($("#rep-user").value);
    const blocked = loadSet("karibu_blocked");
    if (!blocked.includes(id)) blocked.push(id);
    saveSet("karibu_blocked", blocked);
    const reports = loadSet("karibu_reports");
    reports.push({ id, reason: $("#rep-reason").value, note: $("#rep-note").value, at: Date.now() });
    saveSet("karibu_reports", reports);
    toast("Reported and blocked");
  });

  $("#pay")?.addEventListener("click", () => toast("M-Pesa STK would fire here (Daraja API)"));
  $("#boost")?.addEventListener("click", () => { location.hash = "#/app/premium"; });
}

window.addEventListener("hashchange", render);
render();
