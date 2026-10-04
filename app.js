/* SI News Daily · pre-launch page.
   No third-party scripts, no trackers. The only network call is the sign-up POST.
   Device-only conveniences (role, gift, station, quiz taps) use localStorage inside try/catch. */
(function () {
"use strict";

var API = "https://acp9reat3l.execute-api.us-east-1.amazonaws.com/signal/request-link";
var SITE = "sinewsdaily.com";
var RM = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
var BEHAVIOR = RM ? "auto" : "smooth";

/* ===== SAMPLE DATA, generated 2026-10-03.
   Shown ROUNDED on the page: never an exact source count, magnitudes only. ===== */
var SNAP = { asOf: "2026-10-03T04:26:59Z", label: "Oct 3, 04:26 UTC", articles: 571740, maxAgeH: 26 };
/* [slug, unique_articles, unique_stories, articles per day 09-27..10-03 (10-03 partial)] */
var CATS = [["claude",13548,5157,[128,269,440,92,52,57,14]],["gemini",8919,3283,[51,124,143,63,70,65,7]],["openai",18122,8020,[245,342,768,245,126,133,35]],["agentic-ai",102294,54401,[2232,2916,4638,1502,1229,1238,190]],["cloud-ai",12797,8676,[250,330,540,184,139,161,26]],["robotics",15958,8332,[219,323,461,172,101,133,21]],["ai-safety",12025,6903,[142,328,592,185,192,183,16]],["creative-ai",7834,4351,[127,176,231,72,49,57,9]],["amazon-ai",3183,2140,[31,49,71,30,29,29,5]],["apple-ai",2445,1673,[49,26,59,35,19,21,6]],["benchmarks",5791,4528,[116,194,354,94,117,112,9]],["china-ai",34764,17551,[555,1057,695,497,326,257,64]],["consumer-ai",7580,5615,[133,177,302,120,94,84,13]],["enterprise-ai",19683,9279,[223,367,593,169,98,90,11]],["frontier-research",19276,13253,[305,591,1400,358,456,388,20]],["funding",37963,22201,[474,894,1043,498,307,315,69]],["meta-ai",1325,902,[48,47,62,30,19,26,5]],["microsoft-ai",4803,2538,[52,83,86,35,22,11,0]],["open-source-ai",9055,3967,[121,142,159,67,71,71,25]],["policy",45298,22990,[471,1651,1686,765,562,458,81]],["security",28798,16456,[386,1019,1043,368,321,274,55]],["silicon",10385,4637,[66,211,292,76,32,51,14]]];
/* articles in per hour, 2026-09-30T05:00 .. 2026-10-03T04:00 UTC (72 points) */
var HOURLY = [498,538,533,530,522,595,928,664,1012,795,581,698,730,704,625,603,628,498,458,443,418,412,770,1827,484,429,522,539,556,551,596,585,630,594,626,607,601,530,513,519,488,452,421,403,389,411,479,1805,510,364,445,483,506,515,472,482,580,589,535,574,505,500,484,403,417,393,379,332,310,300,283,295];
/* lane names = newsletter categories ("China AI" shows as Frontier US/China) */
var NAMES = {"claude":"Claude","gemini":"Gemini","openai":"OpenAI","agentic-ai":"Agentic AI","cloud-ai":"Cloud AI","robotics":"Robotics","ai-safety":"AI Safety","creative-ai":"Creative AI","amazon-ai":"Amazon AI","apple-ai":"Apple AI","benchmarks":"Benchmarks","china-ai":"Frontier US/China","consumer-ai":"Consumer AI","enterprise-ai":"Enterprise AI","frontier-research":"Frontier Research","funding":"Funding","meta-ai":"Meta AI","microsoft-ai":"Microsoft AI","open-source-ai":"Open-Source AI","policy":"Policy","security":"Security","silicon":"Silicon"};

/* ===== ROLE SAMPLES: real stories from our own issues (dev.theagentsignal.com), Sep 22-23, 2026.
   Labels set from each story's source type. Actions graft #8: time estimate + 2 or more named ways, never from a rumor. ===== */
var ROLES = {
 marketer:{name:"Marketer",short:"Marketer",a:"a marketer",poss:"a marketer's",pl:"marketers",day:"Tuesday",date:"Sep 22",lanes:["creative-ai","consumer-ai","agentic-ai"],
  s:[{l:"creative-ai",lab:"fact",why:"court filing",h:"Universal and Sony take their Suno copyright case to the new v6 model",src:"MusicRadar",y:"If AI music is in your ads or reels, check the licence terms before the next campaign ships."},
     {l:"agentic-ai",lab:"reported",why:"one outlet",h:"Banks warn AI shopping agents are outpacing fraud protections",src:"Quartz",y:"Software is starting to shop for your customers. Make prices, specs and returns plain enough for an agent to read."},
     {l:"consumer-ai",lab:"fact",why:"Google announcement",h:"Google's Googlebook fuses Android and ChromeOS into a Gemini-powered laptop",src:"Hypebeast",y:"Assistants are moving into the operating system. More people will meet your brand through an assistant's summary first."}],
  act:"Write one \u201cstyle anchor\u201d (palette, lighting, composition, texture) and paste it before every image prompt. Your visuals stay on-brand across tools.",ways:["Adobe Firefly","Midjourney","Gemini"],mins:4},
 founder:{name:"Founder & Exec",short:"Founder",a:"a founder",poss:"a founder's",pl:"founders",day:"Tuesday",date:"Sep 22",lanes:["funding","agentic-ai","policy"],
  s:[{l:"funding",lab:"fact",why:"company announcement",h:"Sela raises $21M; its AI agents now help originate $1B in loans a month",src:"Pulse 2.0",y:"Growth capital for agents already doing volume work, not a demo. The bar for \u201cAI in production\u201d just moved."},
     {l:"agentic-ai",lab:"fact",why:"announced round",h:"Baselayer raises $35M to build the trust layer for AI agents",src:"SiliconANGLE",y:"Money is flowing to the plumbing: identity, permissions, audit. Ask who signs for your agents' actions."},
     {l:"policy",lab:"fact",why:"published principles",h:"Six global banks publish shared principles for agents that act on customers' behalf",src:"The Paypers",y:"Authorization scope, audit trails, liability. If agents touch your customers' money, this is the checklist you'll be asked about."}],
  act:"Pick one workflow where an agent could do the first draft, and name who signs off. Run it for a week in two assistants side by side, and keep the better one.",ways:["Claude","ChatGPT"],mins:5},
 engineer:{name:"Engineer",short:"Engineer",a:"an engineer",poss:"an engineer's",pl:"engineers",day:"Tuesday",date:"Sep 22",lanes:["agentic-ai","open-source-ai","benchmarks"],
  s:[{l:"agentic-ai",lab:"reported",why:"one outlet",h:"Z.ai pulls a coding-assistant feature after a flaw exposed enterprise code uploads",src:"InfoWorld",y:"Before any coding assistant uploads a repo, check where the code goes and who can read it."},
     {l:"open-source-ai",lab:"reported",why:"one outlet",h:"AWS open-sources Strands Harness for multi-cloud agents",src:"Digital Today",y:"One more open harness to compare with LangGraph and the OpenAI Agents SDK before you commit."},
     {l:"benchmarks",lab:"fact",why:"published paper",h:"MCP-GRANITE: a new benchmark tests how precisely MCP agents use their tools",src:"arXiv",y:"If your agent speaks MCP, here's a test suite to borrow. The scores are the authors' own until reproduced."}],
  act:"Define two action tiers in your agent's system prompt: read-only steps go ahead; writes, deletes and outbound calls stop and ask first.",ways:["Claude Code","Codex","Gemini CLI"],mins:3},
 pm:{name:"Product Manager",short:"PM",a:"a product manager",poss:"a product manager's",pl:"product managers",day:"Tuesday",date:"Sep 22",lanes:["enterprise-ai","agentic-ai","consumer-ai"],
  s:[{l:"agentic-ai",lab:"fact",why:"on the record",h:"Okta pitches identity as the control plane for every AI agent",src:"forkast.news",y:"Your next agent spec needs an \u201caudit story\u201d: which agent acted, who allowed it, how to revoke it."},
     {l:"enterprise-ai",lab:"fact",why:"partnership announcement",h:"HP and OpenAI spell out what enterprise agents need beyond the model",src:"TechRepublic",y:"Their readiness list: local inference, orchestration, endpoint control, audit logs. A ready-made roadmap checklist."},
     {l:"enterprise-ai",lab:"reported",why:"single report",h:"Daily AI use nearly doubled in Canada; 1 in 3 workers now use it for multistep tasks",src:"Stock Titan (CDW report)",y:"Users are chaining tasks, not asking one-off questions. Design flows, not prompts."}],
  act:"Add three questions to your next AI feature review: which agent acted, who authorized it, and how do we revoke it? Compare two identity vendors before you build your own.",ways:["Okta","Delinea","Baselayer"],mins:2},
 security:{name:"Security",short:"Security",a:"a security lead",poss:"a security lead's",pl:"security leads",day:"Tuesday",date:"Sep 22",lanes:["security","ai-safety","agentic-ai"],
  s:[{l:"security",lab:"reported",why:"weekly recap",h:"A Cisco zero-day under active exploitation tops a week of AI-agent RCE and ClickFix attacks",src:"The Hacker News",y:"Perimeter devices are the target this week, not just endpoints. Check your network gear first."},
     {l:"agentic-ai",lab:"reported",why:"one outlet",h:"Banks warn AI shopping agents are outpacing fraud protections",src:"Quartz",y:"Agent traffic breaks old fraud baselines. Start tagging agent-initiated sessions separately."},
     {l:"ai-safety",lab:"fact",why:"published principles",h:"Six global banks publish shared principles for agentic commerce",src:"The Paypers",y:"Authorization scope, audit trails, liability: a ready-made outline for your own agent policy."}],
  act:"Paste a constraint block before any agent instruction: what it must not touch, what it can't share, and when to stop and ask.",ways:["Microsoft Copilot","Claude Projects","ChatGPT Tasks"],mins:3},
 investor:{name:"Investor & Analyst",short:"Investor",a:"an investor",poss:"an investor's",pl:"investors",day:"Wednesday",date:"Sep 23",lanes:["funding","silicon","china-ai"],
  s:[{l:"funding",lab:"fact",why:"announced round",h:"Cyera raises $400M from Goldman Sachs, taking its 2026 funding to $1.4B",src:"Calcalist",y:"Another large round for AI-era data security. Add it to your comps."},
     {l:"silicon",lab:"rumor",why:"vendor claim, unverified",h:"Alibaba claims its Zhenwu V900 is \u201cthe most powerful AI chip in China\u201d",src:"Tom's Hardware",y:"A claim, not a benchmark. Wait for independent numbers before it changes your view."},
     {l:"china-ai",lab:"fact",why:"product release",h:"Alibaba's Qwen Audio 3.1 cuts audio API prices by up to 95%",src:"The Decoder",y:"Price per task keeps falling. Check what that does to margins in your audio-AI comps."}],
  act:"Add a \u201cprice per task\u201d column to your comps sheet and refresh it monthly from two or more providers' public price pages.",ways:["Alibaba Cloud","Google Cloud"],mins:5,note:"News, not investment advice."},
 legal:{name:"Policy & Legal",short:"Policy",a:"a policy or legal pro",poss:"a policy pro's",pl:"policy and legal pros",day:"Tuesday",date:"Sep 22",lanes:["policy","ai-safety","china-ai"],
  s:[{l:"policy",lab:"fact",why:"court filing",h:"Universal and Sony extend their Suno copyright case to the new v6 model",src:"MusicRadar",y:"The argument: a new model version doesn't reset training-data liability. Watch how the court treats that."},
     {l:"policy",lab:"fact",why:"government launch",h:"The Philippines puts Gemini into its eGovPH portal: 11 AI tools for citizens",src:"TechRepublic",y:"A national template for AI in public services. Procurement and accountability questions will follow."},
     {l:"policy",lab:"reported",why:"one outlet",h:"OpenAI calls for global cooperation on AI standards",src:"Fox News",y:"A call, not a commitment. Track which standards bodies the labs actually join."}],
  act:"Run this on your next contract: \u201cIdentify the five clauses most likely to create obligation or risk for me. Flag all dates, deadlines and numbers above $10,000.\u201d You still make the call.",ways:["Claude","ChatGPT","Gemini"],mins:4},
 educator:{name:"Educator & Student",short:"Educator",a:"an educator",poss:"an educator's",pl:"educators",day:"Wednesday",date:"Sep 23",lanes:["consumer-ai","enterprise-ai","benchmarks"],
  s:[{l:"consumer-ai",lab:"fact",why:"OpenAI's own post",h:"OpenAI Academy adds new learning paths",src:"openai.com",y:"Free structured courses to point students to. Pair them with a second provider's so students compare, not just consume."},
     {l:"enterprise-ai",lab:"reported",why:"vendor's own case study",h:"How higher education is putting AI agents to work",src:"salesforce.com",y:"Useful examples for advising, admissions and admin. Remember the source is selling the product."},
     {l:"benchmarks",lab:"fact",why:"published by both groups",h:"UK AISI and EvalEval team up to make benchmark results reproducible",src:"Hugging Face blog",y:"A ready classroom case: a score means little until someone else can reproduce it."}],
  act:"Before accepting any AI answer, add: \u201cList the three pieces of evidence from the source that led you to this conclusion.\u201d It teaches the habit of checking the chain.",ways:["ChatGPT","Gemini","Claude"],mins:2}
};
var ORDER = ["marketer","founder","engineer","pm","security","investor","legal","educator"];

/* ===== quiz (graft #6): built from real stories on this page ===== */
var QUIZ = [
 {q:"Alibaba says its Zhenwu V900 is \u201cthe most powerful AI chip in China.\u201d No independent benchmark has run yet. Which label fits?",
  o:["Fact","Reported","Rumor"],a:2,why:"A company's own claim with no independent check stays a rumor until someone else measures it.",src:"Tom's Hardware, Sep 23"},
 {q:"Six global banks publish shared principles for AI agents that act on their customers' behalf. Which label fits?",
  o:["Fact","Reported","Rumor"],a:0,why:"The banks published the document themselves. That's on the record.",src:"The Paypers, Sep 22"},
 {q:"Count sources, not headlines. Say five sites run the same IPO story, and every one cites a single outlet's report. How many independent sources is that?",
  o:["Five","One","None"],a:1,why:"Five headlines, one source. Echoes don't add evidence, which is why our labels count independent sources.",src:"How our desk labels stories"}
];
var LEVELS = ["Tuned in","Antenna glow","New colour","Sharp-eyed badge"];

/* ===== gifts (spec: Gift drop). Delivery lines must stay true. ===== */
var GIFTS = {
 alien:{name:"Your alien",after:"It's ready now: pick a colour and save it below."},
 song:{name:"Your theme song",after:"We make it in our music lab after you confirm your email. It takes a few days."},
 audio:{name:"A 3-minute audio brief",after:"It comes to your inbox after you confirm. Add your role below so it fits."},
 chapter:{name:"A free book chapter",after:"It comes to your inbox after you confirm."},
 wallpaper:{name:"Alien-crew wallpapers",after:"The pack comes to your inbox after you confirm."}
};
var GIFT_ORDER = ["alien","song","audio","chapter","wallpaper"];

/* ===== prices: TIERED-RESERVATION-PRICING-2026-10-03.md (do not invent). All-in. ===== */
var DLG = {
 pro:{t:"Reserve Pro",get:"Your role's 3 lanes in full, the full hourly radio, and a personal brief tuned by your taps.",price:"Pro launches at $9.99/mo or $99/yr. Your founding price: $7.99/mo or $79/yr, locked for as long as you stay subscribed.",save:"$2 a month, $24 a year (20%). Or $20 a year on annual.",today:"$9.99 refundable deposit, credited to your first bill at launch.",pay:"Reserve Pro with Stripe \u00b7 $9.99"},
 max:{t:"Reserve MAX",get:"All 22 lanes in full, morning and evening Deep Dive (learning, no news), all 24 white papers with audio, the member community, and everything in Pro.",price:"MAX launches at $199/yr or $19.99/mo. Your founding price: $149/yr or $14.99/mo, locked for as long as you stay subscribed.",save:"$50 a year on annual (25%). Or $5 a month, $60 a year, on monthly.",today:"$29 refundable deposit, credited to your first bill at launch.",pay:"Reserve MAX with Stripe \u00b7 $29"},
 ultra:{t:"Reserve Ultra",get:"The 21-book library, training by job title, the full AI-Era Defense Playbook, the insider circle, and everything in MAX.",price:"Ultra launches at $999/yr or $99.99/mo. Your founding price: $699/yr or $69.99/mo, locked for as long as you stay subscribed.",save:"$300 a year on annual (30%). Or $30 a month, $360 a year, on monthly.",today:"$99 refundable deposit, credited to your first bill at launch.",pay:"Reserve Ultra with Stripe \u00b7 $99"},
 playbook:{t:"Buy the AI-Era Defense Playbook",get:"About 100 pages (PDF) plus the audio edition, delivered by email.",price:"$49 (proposed price), all-in.",saveK:"Note",save:"Ultra includes the full Playbook, if you'd rather reserve that.",todayK:"Today",today:"$49, a normal purchase of something that exists today.",pay:"Buy with Stripe \u00b7 $49",refund:"Digital download: no refunds once delivered.",buy:true}
};

/* ===== helpers ===== */
function $(id) { return document.getElementById(id); }
function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]; }); }
function store(k, v) {
  try {
    if (v === undefined) { return window.localStorage.getItem("snd." + k); }
    if (v === null) { window.localStorage.removeItem("snd." + k); } else { window.localStorage.setItem("snd." + k, v); }
  } catch (e) { /* private mode / blocked storage: the page works without it */ }
  return null;
}
var BY = {};
CATS.forEach(function (c) { BY[c[0]] = { slug: c[0], w: c[3].reduce(function (a, b) { return a + b; }, 0) }; });
function rounded(n) { /* rounded magnitudes only */
  if (n >= 10000) { return "~" + Math.round(n / 1000) + "k"; }
  if (n >= 1000) { return "~" + (Math.round(n / 100) / 10) + "k"; }
  if (n >= 100) { return "~" + (Math.round(n / 10) * 10); }
  return String(n);
}
function magnitude(n) { /* switches itself to "a million" only once the real count passes it */
  if (n >= 1e6) { return "Over a million"; }
  if (n >= 5e5) { return "Over half a million"; }
  if (n >= 1e5) { return "Hundreds of thousands of"; }
  return "Thousands of";
}
function lab(k, why) { return '<span class="lab ' + k + '">' + ({fact:"Fact",reported:"Reported",rumor:"Rumor"}[k]) + (why ? ' <small>\u00b7 ' + esc(why) + '</small>' : '') + '</span>'; }
function scrollToEl(el, block) { if (el && el.scrollIntoView) { el.scrollIntoView({ behavior: BEHAVIOR, block: block || "start" }); } }

/* ===== live numbers + fail-closed freshness (graft #10) ===== */
var stale = (Date.now() - Date.parse(SNAP.asOf)) > SNAP.maxAgeH * 3600 * 1000;
$("mArticles").textContent = magnitude(SNAP.articles);
if (stale) {
  $("asofDot").classList.add("stale");
  $("asofText").textContent = "Desk snapshot from " + SNAP.label + ". A fresh one is on the way.";
}

/* ===== role ===== */
var role = "marketer", rolePicked = false, sentRole = "";
function setRole(k, picked) {
  if (!ROLES[k]) { return; }
  role = k; var r = ROLES[k];
  if (picked) { rolePicked = true; store("role", k); }
  var rb = $("r-" + k); if (rb && rolePicked && !rb.checked) { rb.checked = true; }
  $("ledeRole").textContent = rolePicked ? "you, as " + r.a : "your role";
  $("signupBtn").textContent = rolePicked ? "Send my " + r.short + " brief" : "Send my brief";
  $("mornH").textContent = rolePicked ? "Here's your " + r.day + ", as " + r.a + "." : "Here's " + r.poss + " " + r.day + ".";
  $("mornSub").textContent = "My SI Morning is your daily brief (SI: superintelligence, the new name for AI). Swipe through a dated sample (not today's news): three stories from our " + r.date + " issue, one action, and done." + (rolePicked ? "" : " Tap your role above to see yours.");
  var sel = $("pfRole"); if (sel && rolePicked) { sel.value = k; }
  renderDeck(); renderLanes();
}
$("roleChips").addEventListener("change", function (e) { if (e.target && e.target.name === "role") { setRole(e.target.value, true); } });

/* ===== sample brief deck: swipe, buttons, arrow keys ===== */
var track = $("deckTrack");
function fbKey() { return "fb." + role; }
function renderDeck() {
  var r = ROLES[role], h = "";
  r.s.forEach(function (s, i) {
    h += '<article class="dcard" aria-roledescription="slide" aria-label="Story ' + (i + 1) + ' of 3"><span class="dnum">' + (i + 1) + ' / 3</span>' +
      '<div class="dmeta">' + lab(s.lab, s.why) + '<span class="chip">' + esc(NAMES[s.l]) + '</span></div>' +
      '<h3>' + esc(s.h) + '</h3><p class="foryou"><b>For you:</b> ' + esc(s.y) + '</p>' +
      '<p class="src">Source: ' + esc(s.src) + ' \u00b7 ' + esc(r.date) + '</p></article>';
  });
  var fb = {}; try { fb = JSON.parse(store(fbKey()) || "{}") || {}; } catch (e) { fb = {}; }
  h += '<article class="dcard action" aria-roledescription="slide" aria-label="Action of the day">' +
    '<p class="k">Action of the day \u00b7 about ' + r.mins + ' min</p><p class="act">' + esc(r.act) + '</p>' +
    '<div><p class="k mt4">Ways to do it</p><ul class="ways mt6">' + r.ways.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join("") + '</ul></div>' +
    (r.note ? '<p class="tiny">' + esc(r.note) + '</p>' : '') +
    '<div class="fb" role="group" aria-label="How was this action?">' +
    '<button type="button" data-fb="tried" aria-pressed="' + (!!fb.tried) + '">Tried it</button>' +
    '<button type="button" data-fb="useful" aria-pressed="' + (fb.vote === "useful") + '">Useful</button>' +
    '<button type="button" data-fb="nope" aria-pressed="' + (fb.vote === "nope") + '">Not for me</button>' +
    '<button type="button" data-copy>Copy</button></div>' +
    '<p class="fbmsg" role="status"></p>' +
    '<p class="tiny">Built only from Fact or Reported stories. Rumors never become actions. No sponsors.</p></article>';
  h += '<article class="dcard done" aria-roledescription="slide" aria-label="You\'re caught up">' +
    '<img src="img/char_blue_pulse-standing2.png" width="169" height="273" alt="">' +
    '<h3>You\'re caught up.</h3><p>That\'s the whole brief: five minutes, then on with your day. Want it at 7:00 every morning?</p>' +
    '<a class="btn" href="#signup" data-join>Send me this every morning</a>' +
    '<button class="linkbtn" type="button" data-share>Share this sample</button><p class="tiny" data-sharemsg role="status"></p></article>';
  track.innerHTML = h;
  deckTarget = -1; lastIdx = -1;
  track.scrollLeft = 0;
  buildDots(); updateDeck();
}
function deckCards() { return track.children; }
function deckIndex() {
  var c = deckCards(); if (!c.length) { return 0; }
  var base = c[0].offsetLeft, best = 0, bestD = Infinity;
  for (var i = 0; i < c.length; i++) { var d = Math.abs((c[i].offsetLeft - base) - track.scrollLeft); if (d < bestD) { bestD = d; best = i; } }
  /* at the far end the last card may not reach the snap line */
  if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) { best = c.length - 1; }
  return best;
}
var deckTarget = -1, deckTargetTimer = null;
function curIdx() { return deckTarget >= 0 ? deckTarget : deckIndex(); }
function deckGo(i) {
  var c = deckCards(); if (!c.length) { return; }
  i = Math.max(0, Math.min(c.length - 1, i));
  deckTarget = i; clearTimeout(deckTargetTimer);
  deckTargetTimer = setTimeout(function () { deckTarget = -1; lastIdx = -1; updateDeck(); }, RM ? 60 : 800);
  track.scrollTo({ left: c[i].offsetLeft - c[0].offsetLeft, behavior: BEHAVIOR });
  lastIdx = -1; updateDeck();
}
function buildDots() { var n = deckCards().length, s = ""; for (var i = 0; i < n; i++) { s += "<i></i>"; } $("deckDots").innerHTML = s; }
var lastIdx = -1;
function updateDeck() {
  var i = curIdx(), n = deckCards().length;
  if (i === lastIdx && n) { return; }
  lastIdx = i;
  $("deckCount").textContent = (i + 1) + " of " + n;
  var dots = $("deckDots").children; for (var d = 0; d < dots.length; d++) { dots[d].className = d === i ? "on" : ""; }
  $("deckPrev").disabled = i === 0; $("deckNext").disabled = i === n - 1;
}
track.addEventListener("scroll", function () { if (deckTarget < 0) { updateDeck(); } }, { passive: true }); /* 5 cards: cheap enough per event */
$("deckPrev").addEventListener("click", function () { deckGo(curIdx() - 1); });
$("deckNext").addEventListener("click", function () { deckGo(curIdx() + 1); });
track.addEventListener("keydown", function (e) {
  if (e.target !== track) { return; }
  if (e.key === "ArrowRight") { e.preventDefault(); deckGo(curIdx() + 1); }
  else if (e.key === "ArrowLeft") { e.preventDefault(); deckGo(curIdx() - 1); }
});
track.addEventListener("click", function (e) {
  var b = e.target.closest("button"); if (!b) { return; }
  var card = b.closest(".dcard"), msg;
  if (b.hasAttribute("data-fb")) {
    var fb = {}; try { fb = JSON.parse(store(fbKey()) || "{}") || {}; } catch (er) { fb = {}; }
    var k = b.getAttribute("data-fb");
    if (k === "tried") { fb.tried = !fb.tried; } else { fb.vote = fb.vote === k ? null : k; }
    store(fbKey(), JSON.stringify(fb));
    card.querySelector('[data-fb="tried"]').setAttribute("aria-pressed", String(!!fb.tried));
    card.querySelector('[data-fb="useful"]').setAttribute("aria-pressed", String(fb.vote === "useful"));
    card.querySelector('[data-fb="nope"]').setAttribute("aria-pressed", String(fb.vote === "nope"));
    card.querySelector(".fbmsg").textContent = "Saved on this device. At launch, your taps tune tomorrow's picks.";
  } else if (b.hasAttribute("data-copy")) {
    msg = card.querySelector(".fbmsg");
    copyText(ROLES[role].act, function (ok) { msg.textContent = ok ? "Copied. Paste it into the tool you use." : "Copy didn't work here. Press and hold the text to copy it."; });
  } else if (b.hasAttribute("data-share")) {
    msg = card.querySelector("[data-sharemsg]");
    var r = ROLES[role], url = "https://" + SITE + "/#role=" + role;
    if (navigator.share) {
      navigator.share({ title: "My SI Morning: the " + r.name + " sample", text: "A five-minute AI brief for " + r.pl + ", from SI News Daily.", url: url }).catch(function () {});
    } else {
      copyText(url, function (ok) { msg.textContent = ok ? "Link copied: " + url : "Share this link: " + url; });
    }
  }
});
function copyText(t, cb) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(t).then(function () { cb(true); }, function () { cb(false); }); return; }
  } catch (e) { /* fall through */ }
  cb(false);
}

/* ===== lanes: Pro = your 3, MAX = all 22 (the league-table upsell, compact) ===== */
var laneAll = false;
function renderLanes() {
  var r = ROLES[role], mine = rolePicked ? r.lanes : [];
  var rest = CATS.map(function (c) { return BY[c[0]]; }).filter(function (x) { return mine.indexOf(x.slug) < 0; }).sort(function (a, b) { return b.w - a.w; });
  if (!laneAll) { rest = rest.slice(0, 9 - mine.length); }
  var h = mine.map(function (s) { return '<li class="chip mine">' + esc(NAMES[s]) + ' <b>' + rounded(BY[s].w) + '</b></li>'; }).join("");
  h += rest.map(function (x) { return '<li class="chip">' + esc(NAMES[x.slug]) + ' <b>' + rounded(x.w) + '</b></li>'; }).join("");
  $("laneCloud").innerHTML = h;
  $("lanesLine").innerHTML = "<b>Pro covers your 3 lanes. MAX covers all 22.</b> " + (rolePicked ? "As " + esc(r.a) + ", yours are " + esc(NAMES[r.lanes[0]]) + ", " + esc(NAMES[r.lanes[1]]) + " and " + esc(NAMES[r.lanes[2]]) + "." : "Tap your role at the top to see yours.");
  $("laneMore").textContent = laneAll ? "Show fewer" : "Show all 22 lanes";
  $("laneMore").setAttribute("aria-expanded", laneAll ? "true" : "false");
}
$("laneMore").addEventListener("click", function () { laneAll = !laneAll; renderLanes(); });

/* ===== desk: hot lanes + 72-hour pulse chart ===== */
(function () {
  var top = CATS.map(function (c) { return BY[c[0]]; }).sort(function (a, b) { return b.w - a.w; }).slice(0, 5);
  $("hot").innerHTML = top.map(function (x) { return '<li class="chip">' + esc(NAMES[x.slug]) + ' <b>' + rounded(x.w) + '</b></li>'; }).join("");
  var W = 360, H = 120, T = 6, B = 18, n = HOURLY.length, max = 1900, bw = W / n, ch = H - T - B, s = "";
  HOURLY.forEach(function (v, i) { var h = v / max * ch; s += '<rect class="bar' + (i === n - 1 ? " hi" : "") + '" x="' + (i * bw + 0.5).toFixed(2) + '" y="' + (T + ch - h).toFixed(1) + '" width="' + (bw - 1).toFixed(2) + '" height="' + h.toFixed(1) + '" rx="1"/>'; });
  [[0, "Sep 30"], [19, "Oct 1"], [43, "Oct 2"], [67, "Oct 3"]].forEach(function (t) { var x = t[0] * bw, last = t[0] === 67; s += '<text x="' + (last ? W : x).toFixed(1) + '" y="' + (H - 4) + '"' + (last ? ' text-anchor="end"' : '') + '>' + t[1] + '</text>'; });
  $("pulseChart").innerHTML = s;
})();

/* ===== quiz + alien level ===== */
var qi = 0, qc = 0, qAnswered = false;
function level() { return Math.min(4, 1 + qc); }
function renderLevel(announce) {
  var L = level(), img = $("lvlImg");
  img.src = L >= 3 ? "img/char_purple_globe-standing2.png" : "img/char_blue_pulse-standing2.png";
  img.className = (L === 2 || L === 4) ? "glow" : "";
  $("lvlBadge").textContent = "Level " + L + " \u00b7 " + LEVELS[L - 1];
  var st = $("lvlSteps").children; for (var i = 0; i < st.length; i++) { st[i].className = i < L ? "on" : ""; }
  return announce ? " Your alien reached level " + L + ": " + LEVELS[L - 1] + "." : "";
}
function renderQ() {
  var q = QUIZ[qi], bars = "";
  for (var i = 0; i < QUIZ.length; i++) { bars += '<i class="' + (i < qi || (i === qi && qAnswered) ? "done" : "") + '"></i>'; }
  $("quizBody").innerHTML = '<div class="qprog" aria-hidden="true">' + bars + '</div>' +
    '<p class="k">Question ' + (qi + 1) + ' of ' + QUIZ.length + '</p><p class="qtext" id="qText">' + esc(q.q) + '</p>' +
    '<div class="opts" role="group" aria-labelledby="qText">' + q.o.map(function (o, j) { return '<button type="button" data-o="' + j + '">' + esc(o) + '</button>'; }).join("") + '</div>' +
    '<div id="qFeed" aria-live="polite"></div>';
}
$("quizBody").addEventListener("click", function (e) {
  var b = e.target.closest("button"); if (!b) { return; }
  if (b.hasAttribute("data-o") && !qAnswered) {
    qAnswered = true;
    var q = QUIZ[qi], pick = +b.getAttribute("data-o"), right = pick === q.a;
    if (right) { qc++; }
    var opts = $("quizBody").querySelectorAll("[data-o]");
    for (var i = 0; i < opts.length; i++) {
      opts[i].disabled = true;
      if (+opts[i].getAttribute("data-o") === q.a) { opts[i].classList.add("right"); opts[i].innerHTML += ' <span>\u2713 Answer</span>'; }
      else if (opts[i] === b) { opts[i].classList.add("wrong"); opts[i].innerHTML += ' <span>\u2715 Your pick</span>'; }
    }
    var lv = renderLevel(right);
    var last = qi === QUIZ.length - 1;
    $("qFeed").innerHTML = '<div class="qfeed"><b>' + (right ? "Right." : "Not quite. It's " + esc(q.o[q.a]) + ".") + esc(lv) + '</b>' + esc(q.why) + ' <span class="tiny">(' + esc(q.src) + ')</span></div>' +
      '<button class="btn navy qnext" type="button" data-next>' + (last ? "See my result" : "Next question") + '</button>';
    $("quizBody").querySelector(".qprog").children[qi].className = "done";
  } else if (b.hasAttribute("data-next")) {
    if (qi < QUIZ.length - 1) { qi++; qAnswered = false; renderQ(); var f = $("quizBody").querySelector("[data-o]"); if (f) { f.focus(); } }
    else { showResult(); }
  } else if (b.hasAttribute("data-again")) {
    qi = 0; qc = 0; qAnswered = false; renderLevel(false); renderQ(); var g = $("quizBody").querySelector("[data-o]"); if (g) { g.focus(); }
  }
});
function showResult() {
  var L = level();
  $("quizBody").innerHTML = '<p class="qresult" tabindex="-1" id="qRes">You got ' + qc + ' of ' + QUIZ.length + '.</p>' +
    '<p class="mt8">Your alien reached level ' + L + ': ' + esc(LEVELS[L - 1]) + '. The habit that matters most: count sources, not headlines.</p>' +
    '<div class="rowbtns"><a class="btn" href="#signup" data-join>Send me the free brief</a><button class="btn ghost" type="button" data-again>Play again</button></div>';
  $("qRes").focus();
}
renderLevel(false); renderQ();

/* ===== gifts ===== */
var gift = store("gift") || "";
if (!GIFTS[gift]) { gift = ""; }
var signedUp = false;
$("giftMini").innerHTML = GIFT_ORDER.map(function (g) { return '<input type="radio" name="gift2" id="g2-' + g + '" value="' + g + '"><label for="g2-' + g + '">' + esc(GIFTS[g].name) + '</label>'; }).join("");
function setGift(g) {
  if (!GIFTS[g]) { return; }
  gift = g; store("gift", g);
  var a = document.querySelector('input[name="gift"][value="' + g + '"]'); if (a) { a.checked = true; }
  var b = document.querySelector('input[name="gift2"][value="' + g + '"]'); if (b) { b.checked = true; }
  $("giftStatus").textContent = "Picked: " + GIFTS[g].name + ". " + (signedUp ? GIFTS[g].after : "Sign up and it's yours.");
  $("giftDeliver").textContent = GIFTS[g].after;
  $("alienMaker").hidden = g !== "alien";
  if (g === "alien" && signedUp) { drawAlien(); }
}
document.addEventListener("change", function (e) {
  var t = e.target; if (!t || (t.name !== "gift" && t.name !== "gift2")) { return; }
  setGift(t.value);
});
if (gift) { setGift(gift); } else { $("giftDeliver").textContent = "Pick one. You can change it any time before you confirm."; }

/* your alien, delivered instantly: flat PNG + your name on a badge BESIDE it (never on the character) */
var alienCol = store("alienCol") === "purple" ? "purple" : "blue";
function alienSrc() { return alienCol === "purple" ? "img/char_purple_pulse.png" : "img/char_blue_pulse-standing2.png"; }
function cleanName() { return ($("pfName").value || "").replace(/[<>\u0000-\u001f]/g, "").trim().slice(0, 24); }
var alienCanvas = null;
function rr(x, X, Y, w, h, r) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); }
function drawAlien() {
  var swb = document.querySelectorAll("#alienMaker [data-col]");
  for (var i = 0; i < swb.length; i++) { swb[i].setAttribute("aria-pressed", String(swb[i].getAttribute("data-col") === alienCol)); }
  var img = new Image();
  img.onload = function () {
    var c = document.createElement("canvas"); c.width = 640; c.height = 640;
    var x = c.getContext("2d");
    x.fillStyle = "#FFF6EC"; x.fillRect(0, 0, 640, 640);
    x.fillStyle = alienCol === "purple" ? "#EEE8FF" : "#E3EEFF"; rr(x, 32, 32, 576, 576, 44); x.fill();
    var h = 420, w = img.width * h / img.height;
    x.drawImage(img, 64, 130, w, h);
    var name = cleanName() || "Founding listener", size = 34, bx = 64 + w + 20, maxW = 640 - 48 - bx - 28;
    do { x.font = "800 " + size + "px Figtree, system-ui, sans-serif"; size -= 2; } while (x.measureText(name).width > maxW && size > 16);
    var tw = x.measureText(name).width, bh = size + 30;
    x.fillStyle = "#1F2A44"; rr(x, bx, 300, tw + 28, bh, bh / 2); x.fill();
    x.fillStyle = "#FFF6EC"; x.textBaseline = "middle"; x.fillText(name, bx + 14, 300 + bh / 2 + 1);
    x.fillStyle = "#1F2A44"; x.font = "700 20px Figtree, system-ui, sans-serif"; x.fillText("SI News Daily", bx + 4, 300 + bh + 26);
    alienCanvas = c;
    try { $("alienPrev").src = c.toDataURL("image/png"); }
    catch (e) { alienCanvas = null; $("alienPrev").src = alienSrc(); }
  };
  img.onerror = function () { $("alienMsg").textContent = "Your alien couldn't load just now. Try again in a moment."; };
  img.src = alienSrc();
}
$("alienMaker").addEventListener("click", function (e) {
  var b = e.target.closest("[data-col]"); if (!b) { return; }
  alienCol = b.getAttribute("data-col"); store("alienCol", alienCol); drawAlien();
});
$("alienSave").addEventListener("click", function () {
  var m = $("alienMsg");
  if (!alienCanvas || !alienCanvas.toBlob) { m.textContent = "Press and hold the picture to save it."; return; }
  try {
    alienCanvas.toBlob(function (blob) {
      if (!blob) { m.textContent = "Press and hold the picture to save it."; return; }
      var url = URL.createObjectURL(blob), a = document.createElement("a");
      a.href = url; a.download = "my-si-alien.png"; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      m.textContent = "Saved. Use it as your profile picture anywhere.";
    }, "image/png");
  } catch (e) { m.textContent = "Press and hold the picture to save it."; }
});
var nameTimer = null;
$("pfName").addEventListener("input", function () { if (gift !== "alien" || !signedUp) { return; } clearTimeout(nameTimer); nameTimer = setTimeout(drawAlien, 250); });

/* ===== sign-up: POST /signal/request-link (strict schema, fix/signup-strict-schemas-20261003) ===== */
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
var LANDING_RE = /^\/[A-Za-z0-9._~!$&'()*+,;=:@%\/-]{0,199}$/;
var email = $("email"), emailErr = $("emailErr"), signedEmail = "";
function showEmailErr(t) { emailErr.textContent = t; if (t) { email.setAttribute("aria-invalid", "true"); } else { email.removeAttribute("aria-invalid"); } }
email.addEventListener("blur", function () { var v = email.value.trim(); if (v && !EMAIL_RE.test(v)) { showEmailErr("That doesn't look like a full email address yet."); } });
email.addEventListener("input", function () { if (emailErr.textContent && EMAIL_RE.test(email.value.trim())) { showEmailErr(""); } });

function baseBody(addr) {
  var b = { email: addr, site: SITE };
  var lp = location.pathname || "/"; if (LANDING_RE.test(lp)) { b.landing_path = lp; }
  try { var tz = Intl.DateTimeFormat().resolvedOptions().timeZone; if (tz && tz.length <= 40) { b.tz = tz; } } catch (e) { /* optional */ }
  if (location.search) { b.query = location.search.slice(0, 2048); }
  var hp = $("website").value; if (hp) { b.hp = hp; } /* honeypot: the server answers a silent 200 and stores nothing */
  return b;
}
function postLink(body) {
  var ctrl = window.AbortController ? new AbortController() : null;
  var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 15000) : null;
  return fetch(API, { method: "POST", mode: "cors", credentials: "omit", headers: { "content-type": "application/json" }, body: JSON.stringify(body), signal: ctrl ? ctrl.signal : undefined })
    .then(function (r) { if (timer) { clearTimeout(timer); } return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, code: j && j.error }; }); },
          function () { if (timer) { clearTimeout(timer); } return { status: 0, code: "network" }; });
}
function friendly(status, code) {
  if (status === 400) {
    if (code === "invalid_email") { return "That email address doesn't look right. Check for a typo and try again."; }
    if (code === "invalid_profile" || code === "invalid_field") { return "One of your details didn't fit. Check your name and number, then try again."; }
    return "Something in the form didn't go through. Refresh the page and try again.";
  }
  if (status === 415) { return "Our sign-up form hit a technical snag. Refresh the page and try again."; }
  if (status === 429) { return "Lots of sign-ups from your network just now. Give it a few minutes, then try again."; }
  if (status >= 500) { return "Our sign-up service is having a moment. Please try again shortly."; }
  return "We couldn't reach our sign-up service. Check your connection and try again.";
}
$("signup").addEventListener("submit", function (e) {
  e.preventDefault();
  var v = email.value.trim();
  if (!EMAIL_RE.test(v)) { showEmailErr(v ? "That doesn't look like a full email address yet." : "Add your email address to get the brief."); email.focus(); return; }
  showEmailErr("");
  var btn = $("signupBtn"), label = btn.textContent;
  btn.disabled = true; btn.textContent = "Sending\u2026"; $("signup").setAttribute("aria-busy", "true");
  var body = baseBody(v);
  if (rolePicked) { body.profile = { role: ROLES[role].name, cadence: "daily" }; sentRole = role; }
  postLink(body).then(function (res) {
    btn.disabled = false; btn.textContent = label; $("signup").removeAttribute("aria-busy");
    if (res.status === 200) { onSignedUp(v); } else { showEmailErr(friendly(res.status, res.code)); email.focus(); }
  });
});
function onSignedUp(addr) {
  signedUp = true; signedEmail = addr;
  $("sentTo").textContent = addr;
  $("step1").hidden = true; $("step2").hidden = false;
  if (rolePicked) { $("pfRole").value = role; }
  if (gift) { setGift(gift); }
  $("giftStatus").textContent = gift ? "Picked: " + GIFTS[gift].name + ". " + GIFTS[gift].after : "Pick your gift here, or in your sign-up box.";
  var h = $("s2h"); h.setAttribute("tabindex", "-1"); h.focus();
  var joins = document.querySelectorAll(".top-cta,.tb-join span");
  for (var i = 0; i < joins.length; i++) { joins[i].textContent = "You're in"; }
  $("doneCta").textContent = "See you at 7:00";
  $("doneText").textContent = "That's everything for now. Confirm the link in your inbox, and your brief meets you at 7:00. The news of the hour is here whenever you want it.";
}
(function () {
  var sel = $("pfRole");
  sel.innerHTML = '<option value="">Choose\u2026</option>' + ORDER.map(function (k) { return '<option value="' + k + '">' + esc(ROLES[k].name) + '</option>'; }).join("");
})();
function phoneOk(p) { var s = p.replace(/[\s().-]/g, ""); return /^\d{10}$/.test(s) || /^\+[1-9]\d{7,14}$/.test(s); }
$("pfSave").addEventListener("click", function () {
  var err = $("pfErr"), ok = $("pfMsg"); err.textContent = ""; ok.textContent = "";
  var name = $("pfName").value.trim(), r = $("pfRole").value, phone = $("pfPhone").value.trim(), sms = $("pfSms").checked;
  if (/[<>]/.test(name)) { err.textContent = "Please use just your name, without < or >."; return; }
  if (sms && !phone) { err.textContent = "Add a mobile number for the 7:00 text, or untick the box."; return; }
  if (sms && !phoneOk(phone)) { err.textContent = "Add the full mobile number, with the country code if you're outside the US."; return; }
  if (!name && !sms && (!r || r === sentRole)) { ok.textContent = "Nothing new to save. You're all set."; return; }
  if (r) { setRole(r, true); }
  var body = baseBody(signedEmail), prof = { cadence: "daily" };
  if (name) { prof.name = name; }
  if (r) { prof.role = ROLES[r].name; }
  body.profile = prof;
  if (sms) { body.sms_opt_in = true; body.phone = phone; }
  var b = $("pfSave"); b.disabled = true;
  postLink(body).then(function (res) {
    b.disabled = false;
    if (res.status === 200) { sentRole = r || sentRole; ok.textContent = "Saved. We sent a fresh confirmation link with your details, so tap the newest email."; }
    else { err.textContent = friendly(res.status, res.code); }
  });
});
$("pfSkip").addEventListener("click", function () { $("pfErr").textContent = ""; $("pfMsg").textContent = "No problem. Your confirmation link is waiting in your inbox."; });

/* every "join" CTA lands on the email field (or the step-2 box once signed up) */
document.addEventListener("click", function (e) {
  var a = e.target.closest("[data-join]"); if (!a) { return; }
  e.preventDefault();
  var form = $("signup"); scrollToEl(form, "center");
  setTimeout(function () { var t = signedUp ? $("s2h") : email; try { t.focus({ preventScroll: true }); } catch (er) { t.focus(); } }, RM ? 0 : 450);
});

/* ===== on-air player: instant play, stations, companion ===== */
var audio = $("audio"), air = $("listen"), playBtn = $("playBtn"), tbPlay = $("tbPlay"), seek = $("seek"), ptime = $("ptime"), pnote = $("pnote");
var NOTE_DEFAULT = "Live hourly brief, Founders' Preview. Assembled automatically; a fresh one every hour.";
var STATIONS = { si: "SI station", claude: "Claude station", openai: "OpenAI station", gemini: "Gemini station" };
var STNAME = { si: "SI", claude: "Claude", openai: "OpenAI", gemini: "Gemini" };
var station = "si", audioBroken = false;
function mmss(s) { if (!isFinite(s) || s < 0) { return "0:00"; } s = Math.floor(s); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
function warm() { if (audio.preload !== "auto") { audio.preload = "auto"; } }
[playBtn, tbPlay].forEach(function (b) { ["pointerenter", "touchstart", "focus"].forEach(function (ev) { b.addEventListener(ev, warm, { passive: true }); }); });
function setUI(on) {
  air.classList.toggle("playing", on); tbPlay.classList.toggle("on", on);
  var l = on ? "Pause the news of the hour" : "Play the news of the hour";
  playBtn.setAttribute("aria-label", l); tbPlay.setAttribute("aria-label", l);
}
function fail() { setUI(false); pnote.textContent = "The hourly audio isn't available right now. Please try again in a few minutes."; }
function toggle() {
  if (!audio.paused) { audio.pause(); return; }
  if (audioBroken) { audioBroken = false; audio.load(); }
  var p; try { p = audio.play(); } catch (e) { fail(); return; }
  if (p && p.catch) { p.catch(function (err) { if (!err || err.name !== "AbortError") { fail(); } }); }
}
playBtn.addEventListener("click", toggle);
tbPlay.addEventListener("click", toggle);
audio.addEventListener("play", function () { setUI(true); if (pnote.textContent !== NOTE_DEFAULT && station === "si") { pnote.textContent = NOTE_DEFAULT; } });
audio.addEventListener("pause", function () { setUI(false); });
audio.addEventListener("ended", function () { setUI(false); seek.value = 0; });
audio.addEventListener("error", function () { audioBroken = true; if (air.classList.contains("playing") || !audio.paused) { fail(); } });
audio.addEventListener("loadedmetadata", function () { ptime.textContent = "0:00 / " + mmss(audio.duration); });
audio.addEventListener("timeupdate", function () {
  if (!audio.duration) { return; }
  seek.value = Math.round(audio.currentTime / audio.duration * 1000);
  ptime.textContent = mmss(audio.currentTime) + " / " + mmss(audio.duration);
  seek.setAttribute("aria-valuetext", mmss(audio.currentTime) + " of " + mmss(audio.duration));
});
seek.addEventListener("input", function () { if (audio.duration) { audio.currentTime = seek.value / 1000 * audio.duration; } });
if ("mediaSession" in navigator && window.MediaMetadata) {
  try { navigator.mediaSession.metadata = new window.MediaMetadata({ title: "The news of the hour", artist: "SI News Daily", album: "SI station (live hour)" }); } catch (e) { /* optional */ }
}
function setStation(k) {
  if (!STATIONS[k]) { return; }
  station = k; store("station", k);
  var bs = document.querySelectorAll(".stations [data-st]");
  for (var i = 0; i < bs.length; i++) { bs[i].setAttribute("aria-pressed", String(bs[i].getAttribute("data-st") === k)); }
  $("stationBadge").textContent = STATIONS[k];
  pnote.textContent = k === "si" ? NOTE_DEFAULT : "Preview: every station plays the same live SI brief for now. The " + STNAME[k] + " hour is planned.";
}
document.querySelector(".stations").addEventListener("click", function (e) { var b = e.target.closest("[data-st]"); if (b) { setStation(b.getAttribute("data-st")); } });
var savedSt = store("station"); if (savedSt && STATIONS[savedSt]) { setStation(savedSt); }
function tick() { try { $("clock").textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) + " your time"; } catch (e) { /* optional */ } }
tick(); setInterval(tick, 20000);

/* ===== reserve / buy dialog: four lines, fixed order ===== */
var dlg = $("dlg"), lastFocus = null, payUrl = "";
function openDlg(k) {
  var d = DLG[k]; if (!d) { return; }
  lastFocus = document.activeElement;
  $("dlgH").textContent = d.t;
  $("dlgFour").innerHTML = [["What you get", d.get], ["Price", d.price], [d.saveK || "You save", d.save], [d.todayK || "Deposit", d.today]]
    .map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join("");
  $("dlgIns").hidden = !!d.buy;
  $("dlgPay").textContent = d.pay;
  $("dlgRefund").textContent = d.refund || "Refundable on request before launch: one email or one click. Move it to another tier any time before launch. Prices are all-in.";
  $("dlgTest").hidden = true;
  if (dlg.showModal) { dlg.showModal(); } else { dlg.setAttribute("open", ""); }
  $("dlgPay").focus();
}
function closeDlg() { if (dlg.close) { dlg.close(); } else { dlg.removeAttribute("open"); } }
document.addEventListener("click", function (e) { var t = e.target.closest("[data-reserve]"); if (t) { payUrl = t.getAttribute("data-pay-url") || ""; openDlg(t.getAttribute("data-reserve")); } });
$("dlgPay").addEventListener("click", function () { /* pay-wired */ if (payUrl) { window.location.assign(payUrl); return; } $("dlgTest").hidden = false; });
$("dlgClose").addEventListener("click", closeDlg);
dlg.addEventListener("click", function (e) { if (e.target === dlg) { closeDlg(); } });
dlg.addEventListener("close", function () { if (lastFocus && lastFocus.focus) { lastFocus.focus(); } });

/* ===== mobile tab bar steps aside while the keyboard is up ===== */
var tabbar = $("tabbar");
document.addEventListener("focusin", function (e) { if (e.target && /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) && e.target.type !== "radio" && e.target.type !== "checkbox" && e.target.type !== "range") { tabbar.classList.add("kb"); } });
document.addEventListener("focusout", function () { setTimeout(function () { var a = document.activeElement; if (!a || !/^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName)) { tabbar.classList.remove("kb"); } }, 60); });

/* ===== init: shared links like #role=security, then a remembered role ===== */
var m = /role=([a-z]+)/.exec(location.hash || "");
var remembered = store("role");
if (m && ROLES[m[1]]) { setRole(m[1], true); }
else if (remembered && ROLES[remembered]) { setRole(remembered, true); }
else { setRole("marketer", false); }
window.addEventListener("hashchange", function () { var mm = /role=([a-z]+)/.exec(location.hash || ""); if (mm && ROLES[mm[1]]) { setRole(mm[1], true); } });
window.addEventListener("resize", function () { lastIdx = -1; updateDeck(); });
})();
