import { useState, useEffect, useRef, useCallback } from "react";

// ─── QUIZ DATA (100 sets × 5 questions each, questions in Nepali) ───────────
const generateQuizData = () => {
  const allSets = [];
  const rawQuestions = [
    { question: "नेपालको राजधानी के हो?", options: ["पोखरा", "काठमाडौं", "बुटवल", "वीरगञ्ज"], correctAnswer: "काठमाडौं" },
    { question: "नेपालको राष्ट्रिय फूल कुन हो?", options: ["गुलाब", "लालीगुराँस", "सूर्यमुखी", "कमल"], correctAnswer: "लालीगुराँस" },
    { question: "नेपालको राष्ट्रिय खेल कुन हो?", options: ["क्रिकेट", "फुटबल", "भलिबल", "ढ्याङ्ग्रो"], correctAnswer: "भलिबल" },
    { question: "नेपालको सबैभन्दा अग्लो हिमाल कुन हो?", options: ["कञ्चनजङ्घा", "सगरमाथा", "लोत्से", "मकालु"], correctAnswer: "सगरमाथा" },
    { question: "नेपालको राष्ट्रिय पशु कुन हो?", options: ["हात्ती", "गाई", "बाघ", "हिम चितुवा"], correctAnswer: "गाई" },
    { question: "नेपालमा कति वटा प्रदेश छन्?", options: ["५", "६", "७", "८"], correctAnswer: "७" },
    { question: "नेपालको मुद्रा के हो?", options: ["डलर", "रुपैयाँ", "यूरो", "टाका"], correctAnswer: "रुपैयाँ" },
    { question: "नेपालको सबैभन्दा लामो नदी कुन हो?", options: ["कर्णाली", "कोशी", "नारायणी", "गण्डकी"], correctAnswer: "कर्णाली" },
    { question: "नेपालको राष्ट्रिय चरा कुन हो?", options: ["ढाँकुर", "डाँफे", "मयूर", "परेवा"], correctAnswer: "डाँफे" },
    { question: "नेपालले संघीय लोकतान्त्रिक गणतन्त्र कहिले घोषणा गर्यो?", options: ["२०६३", "२०६५", "२०६२", "२०७२"], correctAnswer: "२०६५" },
    { question: "काठमाडौं उपत्यकामा कति जिल्ला छन्?", options: ["२", "३", "४", "५"], correctAnswer: "३" },
    { question: "नेपालको सबैभन्दा ठूलो जिल्ला कुन हो?", options: ["डोल्पा", "हुम्ला", "मुस्ताङ", "मनाङ"], correctAnswer: "डोल्पा" },
    { question: "नेपालको पहिलो विश्वविद्यालय कुन हो?", options: ["त्रिभुवन विश्वविद्यालय", "पूर्वाञ्चल विश्वविद्यालय", "पोखरा विश्वविद्यालय", "काठमाडौं विश्वविद्यालय"], correctAnswer: "त्रिभुवन विश्वविद्यालय" },
    { question: "सगरमाथाको उचाइ कति मिटर हो?", options: ["८,७४८", "८,८४९", "८,६११", "८,५१६"], correctAnswer: "८,८४९" },
    { question: "नेपालको राष्ट्रिय भाषा के हो?", options: ["मैथिली", "नेवारी", "नेपाली", "थारु"], correctAnswer: "नेपाली" },
    { question: "नेपालको क्षेत्रफल कति वर्ग किलोमिटर हो?", options: ["१,४७,१८१", "१,४१,५७०", "१,३५,८०४", "१,५५,०००"], correctAnswer: "१,४७,१८१" },
    { question: "नेपालमा पहिलो संविधान सभाको चुनाव कहिले भयो?", options: ["२०६४", "२०६५", "२०६२", "२०७०"], correctAnswer: "२०६४" },
    { question: "नेपालको सबैभन्दा पुरानो शहर कुन हो?", options: ["पाटन", "भक्तपुर", "काठमाडौं", "कीर्तिपुर"], correctAnswer: "भक्तपुर" },
    { question: "नेपालमा कति वटा राष्ट्रिय निकुञ्ज छन्?", options: ["९", "१०", "११", "१२"], correctAnswer: "१२" },
    { question: "नेपालको सबैभन्दा ठूलो ताल कुन हो?", options: ["फेवा ताल", "रारा ताल", "तिलिचो ताल", "गोसाइँकुण्ड"], correctAnswer: "रारा ताल" },
    { question: "बुद्धको जन्मस्थान कहाँ हो?", options: ["काठमाडौं", "लुम्बिनी", "पोखरा", "जनकपुर"], correctAnswer: "लुम्बिनी" },
    { question: "नेपालको पहिलो प्रधानमन्त्री को हुनुहुन्थ्यो?", options: ["मातृका प्रसाद कोइराला", "बी.पी. कोइराला", "पद्म शम्शेर", "भीम बहादुर पाण्डे"], correctAnswer: "पद्म शम्शेर" },
    { question: "नेपाल-चीन सीमामा कुन पास पर्छ?", options: ["लिपुलेक", "थाम्सेरकु", "नाम्पा", "रासुवागढी"], correctAnswer: "रासुवागढी" },
    { question: "नेपालको राष्ट्रिय झण्डाको आकार कस्तो छ?", options: ["आयताकार", "वर्गाकार", "दुई त्रिभुज", "वृत्ताकार"], correctAnswer: "दुई त्रिभुज" },
    { question: "जनकपुर कुन प्रदेशमा पर्छ?", options: ["प्रदेश नं. १", "मधेश प्रदेश", "बागमती प्रदेश", "लुम्बिनी प्रदेश"], correctAnswer: "मधेश प्रदेश" },
    { question: "नेपालमा पहिलो पटक जनगणना कहिले भयो?", options: ["१९११", "१९२१", "१९०१", "१९५२"], correctAnswer: "१९११" },
    { question: "नेपालको सर्वोच्च अदालत कहाँ छ?", options: ["पाटन", "ललितपुर", "काठमाडौं", "भक्तपुर"], correctAnswer: "काठमाडौं" },
    { question: "नेपालको नागरिकता ऐन कहिले बन्यो?", options: ["२०२०", "२०१५", "२०१८", "२०२५"], correctAnswer: "२०२०" },
    { question: "सगरमाथा राष्ट्रिय निकुञ्ज कुन प्रदेशमा छ?", options: ["बागमती", "कोशी", "गण्डकी", "कर्णाली"], correctAnswer: "कोशी" },
    { question: "नेपालको पहिलो राष्ट्रपति को हुनुभयो?", options: ["विद्यादेवी भण्डारी", "राम बरण यादव", "परमानन्द झा", "माधव कुमार नेपाल"], correctAnswer: "राम बरण यादव" },
    { question: "नेपालमा कति प्रकारका जलवायु पाइन्छन्?", options: ["३", "४", "५", "६"], correctAnswer: "५" },
    { question: "चितवन राष्ट्रिय निकुञ्ज कहाँ छ?", options: ["बागमती प्रदेश", "गण्डकी प्रदेश", "मधेश प्रदेश", "लुम्बिनी प्रदेश"], correctAnswer: "मधेश प्रदेश" },
    { question: "नेपालको राष्ट्रगान कसले लेखेका हुन्?", options: ["लेखनाथ पौड्याल", "ब्योमकेश त्रिपाठी", "प्रदीप कुमार राई", "माधव प्रसाद घिमिरे"], correctAnswer: "ब्योमकेश त्रिपाठी" },
    { question: "नेपालको पहिलो महिला राष्ट्रपति को हुनुभयो?", options: ["सुशीला कार्की", "विद्यादेवी भण्डारी", "अञ्जु राणा", "ऊर्मिला अर्याल"], correctAnswer: "विद्यादेवी भण्डारी" },
    { question: "नेपालको कुल जनसंख्या (२०२१ जनगणना) कति छ?", options: ["२ करोड ८०लाख", "२ करोड ९१ लाख", "३ करोड ५ लाख", "२ करोड ७५ लाख"], correctAnswer: "२ करोड ९१ लाख" },
    { question: "नेपालको सबैभन्दा उचो भन्ज्याङ कुन हो?", options: ["थोरोङ ला", "तिलिचो", "मुस्ताङ ला", "किचन"], correctAnswer: "थोरोङ ला" },
    { question: "नेपालको संसदको माथिल्लो सदनलाई के भनिन्छ?", options: ["प्रतिनिधि सभा", "राष्ट्रिय सभा", "व्यवस्थापिका", "संविधान सभा"], correctAnswer: "राष्ट्रिय सभा" },
    { question: "नेपालको कुन नदीमा सबैभन्दा धेरै जलविद्युत उत्पादन हुन्छ?", options: ["कोशी", "कर्णाली", "मर्स्याङ्दी", "तामाकोशी"], correctAnswer: "तामाकोशी" },
    { question: "नेपालमा पहिलो रेलसेवा कहाँ चल्यो?", options: ["काठमाडौं-पोखरा", "जयनगर-जनकपुर", "बीरगञ्ज-काठमाडौं", "बुटवल-भैरहवा"], correctAnswer: "जयनगर-जनकपुर" },
    { question: "नेपालको राष्ट्रिय दिवस कुन हो?", options: ["फागुन ७", "पुस २३", "बैशाख १", "पृथ्वी जयन्ती"], correctAnswer: "पृथ्वी जयन्ती" },
    { question: "नेपालको सबैभन्दा पुरानो राष्ट्रिय निकुञ्ज कुन हो?", options: ["सगरमाथा", "चितवन", "बर्दिया", "शुक्लाफाँटा"], correctAnswer: "चितवन" },
    { question: "नेपालका कति जिल्ला छन्?", options: ["७५", "७७", "७२", "८०"], correctAnswer: "७७" },
    { question: "नेपालको सबैभन्दा सानो जिल्ला कुन हो?", options: ["भक्तपुर", "ललितपुर", "मनाङ", "रसुवा"], correctAnswer: "भक्तपुर" },
    { question: "नेपालको पहिलो पञ्चायत व्यवस्था कहिले लागू भयो?", options: ["२०१७", "२०१५", "२०१९", "२०२०"], correctAnswer: "२०१७" },
    { question: "त्रिभुवन अन्तर्राष्ट्रिय विमानस्थल कहाँ छ?", options: ["पशुपतिनाथ नजिक", "गौशाला", "न्यू बानेश्वर", "गौचर"], correctAnswer: "गौचर" },
    { question: "नेपालमा कहाँ यूनेस्को विश्व सम्पदा स्थल सबैभन्दा धेरै छन्?", options: ["पोखरा", "काठमाडौं उपत्यका", "लुम्बिनी", "चितवन"], correctAnswer: "काठमाडौं उपत्यका" },
    { question: "सन् २०१५ को भूकम्पको तीव्रता कति थियो?", options: ["७.२", "७.८", "८.१", "६.९"], correctAnswer: "७.८" },
    { question: "नेपालको पहिलो हवाई सेवा कहिले सुरु भयो?", options: ["२०१०", "२०१३", "२०१६", "२०१९"], correctAnswer: "२०१३" },
    { question: "नेपाल कुन महाद्वीपमा पर्छ?", options: ["अफ्रिका", "एशिया", "युरोप", "अमेरिका"], correctAnswer: "एशिया" },
    { question: "नेपालको पहिलो पत्रिका कुन हो?", options: ["गोरखापत्र", "कान्तिपुर", "रिपब्लिका", "आनन्दबजार"], correctAnswer: "गोरखापत्र" },
  ];

  for (let set = 0; set < 100; set++) {
    const shuffled = [...rawQuestions].sort(() => Math.random() - 0.5);
    allSets.push(shuffled.slice(0, 5));
  }
  return allSets;
};

const QUIZ_SETS = generateQuizData();
const TIMER_DURATION = 25;

// ─── SOUNDS ───────────────────────────────────────────────────────────────────
const playSound = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === "correct") { osc.frequency.value = 880; gain.gain.setValueAtTime(0.3, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4); }
    else if (type === "wrong") { osc.frequency.value = 220; osc.type = "sawtooth"; gain.gain.setValueAtTime(0.2, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3); }
    else if (type === "tick") { osc.frequency.value = 440; gain.gain.setValueAtTime(0.05, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1); }
    osc.start(); osc.stop(ctx.currentTime + 0.5);
  } catch (e) {}
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .qa-root {
    font-family: 'Outfit', sans-serif;
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    transition: background 0.3s, color 0.3s;
  }
  .qa-root.light { --bg: #f0f4ff; --card: #ffffff; --text: #1a1a2e; --muted: #6b7280; --accent: #4f46e5; --accent2: #7c3aed; --border: #e5e7eb; --success: #059669; --danger: #dc2626; --warn: #d97706; }
  .qa-root.dark  { --bg: #0f0f1a; --card: #1a1a2e; --text: #e2e8f0; --muted: #94a3b8; --accent: #818cf8; --accent2: #a78bfa; --border: #2d2d44; --success: #34d399; --danger: #f87171; --warn: #fbbf24; }

  .qa-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: var(--card); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; }
  .qa-logo { font-weight: 800; font-size: 1.2rem; background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .qa-theme-btn { background: none; border: 1.5px solid var(--border); border-radius: 50px; padding: 0.4rem 1rem; cursor: pointer; font-size: 0.85rem; color: var(--text); font-family: 'Outfit', sans-serif; transition: all 0.2s; }
  .qa-theme-btn:hover { border-color: var(--accent); color: var(--accent); }

  .qa-page { animation: fadeUp 0.4s ease; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  /* HOME */
  .home-hero { text-align: center; padding: 5rem 2rem 3rem; }
  .home-badge { display: inline-block; background: linear-gradient(135deg, var(--accent), var(--accent2)); color: white; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.35rem 1rem; border-radius: 50px; margin-bottom: 1.5rem; }
  .home-title { font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 800; line-height: 1.1; margin-bottom: 1rem; }
  .home-title span { background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .home-desc { font-size: 1.15rem; color: var(--muted); max-width: 540px; margin: 0 auto 2.5rem; line-height: 1.7; }
  .home-stats { display: flex; justify-content: center; gap: 3rem; margin-bottom: 3rem; }
  .stat-item { text-align: center; }
  .stat-num { font-size: 2rem; font-weight: 800; color: var(--accent); }
  .stat-label { font-size: 0.8rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
  .btn-primary { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: white; border: none; padding: 1rem 2.5rem; border-radius: 50px; font-size: 1.05rem; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 20px rgba(79,70,229,0.35); }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(79,70,229,0.45); }
  .btn-primary:active { transform: scale(0.98); }
  .btn-secondary { background: var(--card); color: var(--text); border: 1.5px solid var(--border); padding: 0.85rem 2rem; border-radius: 50px; font-size: 1rem; font-weight: 500; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.2s; }
  .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }

  /* SELECTION */
  .selection-wrap { max-width: 900px; margin: 0 auto; padding: 3rem 2rem; }
  .section-title { font-size: 1.6rem; font-weight: 700; margin-bottom: 0.5rem; }
  .section-sub { color: var(--muted); margin-bottom: 2rem; font-size: 0.95rem; }
  .quiz-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); gap: 0.6rem; }
  .quiz-btn { background: var(--card); border: 1.5px solid var(--border); border-radius: 12px; padding: 0.85rem 0.5rem; text-align: center; cursor: pointer; font-family: 'Outfit', sans-serif; font-size: 0.95rem; font-weight: 600; color: var(--text); transition: all 0.2s; position: relative; }
  .quiz-btn:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(79,70,229,0.15); }
  .quiz-btn.completed { border-color: var(--success); background: rgba(5,150,105,0.08); }
  .quiz-btn.completed::after { content: '✓'; position: absolute; top: 2px; right: 5px; font-size: 10px; color: var(--success); }
  .score-badge { display: inline-block; font-size: 0.65rem; background: var(--success); color: white; border-radius: 4px; padding: 0 4px; margin-top: 2px; }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 200; animation: fadeIn 0.2s; backdrop-filter: blur(4px); }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal-box { background: var(--card); border-radius: 20px; padding: 2.5rem; max-width: 400px; width: 90%; text-align: center; animation: scaleIn 0.25s ease; border: 1px solid var(--border); }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
  .modal-icon { font-size: 3rem; margin-bottom: 1rem; }
  .modal-title { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.75rem; }
  .modal-desc { color: var(--muted); margin-bottom: 2rem; font-size: 0.95rem; }
  .modal-actions { display: flex; gap: 1rem; justify-content: center; }

  /* QUIZ */
  .quiz-wrap { max-width: 680px; margin: 0 auto; padding: 2rem 1.5rem; }
  .quiz-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; font-size: 0.85rem; color: var(--muted); font-weight: 500; }
  .q-counter { font-weight: 700; font-size: 1rem; color: var(--text); }
  .progress-track { width: 100%; height: 6px; background: var(--border); border-radius: 50px; margin-bottom: 2rem; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 50px; background: linear-gradient(90deg, var(--accent), var(--accent2)); transition: width 0.4s ease; }
  .timer-ring { display: flex; align-items: center; gap: 0.5rem; }
  .timer-num { font-size: 1.1rem; font-weight: 700; min-width: 28px; text-align: right; transition: color 0.3s; }
  .timer-num.urgent { color: var(--danger); animation: pulse 0.5s infinite; }
  @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }
  .timer-bar-track { width: 120px; height: 6px; background: var(--border); border-radius: 50px; overflow: hidden; }
  .timer-bar-fill { height: 100%; border-radius: 50px; transition: width 1s linear, background 0.3s; }
  .question-card { background: var(--card); border-radius: 20px; padding: 2rem; border: 1px solid var(--border); margin-bottom: 1.5rem; }
  .q-set-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); margin-bottom: 0.75rem; }
  .q-text { font-family: 'Noto Sans Devanagari', 'Outfit', sans-serif; font-size: clamp(1.05rem, 3vw, 1.3rem); font-weight: 600; line-height: 1.6; color: var(--text); }
  .options-grid { display: grid; gap: 0.75rem; }
  .opt-btn { background: var(--card); border: 1.5px solid var(--border); border-radius: 14px; padding: 1rem 1.25rem; text-align: left; cursor: pointer; font-family: 'Noto Sans Devanagari', 'Outfit', sans-serif; font-size: 1rem; font-weight: 500; color: var(--text); transition: all 0.2s; display: flex; align-items: center; gap: 0.75rem; }
  .opt-btn:not(:disabled):hover { border-color: var(--accent); color: var(--accent); transform: translateX(4px); }
  .opt-btn:disabled { cursor: not-allowed; }
  .opt-btn.correct { border-color: var(--success); background: rgba(5,150,105,0.1); color: var(--success); }
  .opt-btn.wrong { border-color: var(--danger); background: rgba(220,38,38,0.1); color: var(--danger); }
  .opt-label { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; background: var(--border); color: var(--muted); flex-shrink: 0; transition: all 0.2s; font-family: 'Outfit', sans-serif; }
  .opt-btn.correct .opt-label { background: var(--success); color: white; }
  .opt-btn.wrong .opt-label { background: var(--danger); color: white; }
  .opt-btn:not(:disabled):hover .opt-label { background: var(--accent); color: white; }

  /* RESULT */
  .result-wrap { max-width: 680px; margin: 0 auto; padding: 2rem 1.5rem; }
  .score-hero { text-align: center; padding: 2.5rem; background: var(--card); border-radius: 24px; border: 1px solid var(--border); margin-bottom: 2rem; }
  .score-circle { width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent2)); display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0 auto 1.5rem; box-shadow: 0 8px 30px rgba(79,70,229,0.3); }
  .score-num { font-size: 2.2rem; font-weight: 800; color: white; line-height: 1; }
  .score-denom { font-size: 1rem; color: rgba(255,255,255,0.75); }
  .score-label { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
  .score-sub { color: var(--muted); font-size: 0.95rem; }
  .result-stats { display: flex; justify-content: center; gap: 2rem; margin-top: 1.5rem; }
  .rs-item { text-align: center; }
  .rs-num { font-size: 1.5rem; font-weight: 700; }
  .rs-num.c { color: var(--success); } .rs-num.w { color: var(--danger); } .rs-num.s { color: var(--warn); }
  .rs-label { font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
  .answers-list { display: grid; gap: 1rem; margin-bottom: 2rem; }
  .answer-card { background: var(--card); border-radius: 16px; padding: 1.25rem; border: 1px solid var(--border); }
  .answer-q { font-family: 'Noto Sans Devanagari', 'Outfit', sans-serif; font-size: 0.95rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--text); }
  .answer-row { display: flex; gap: 0.5rem; align-items: center; font-size: 0.85rem; margin-bottom: 0.35rem; }
  .ans-badge { font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.05em; flex-shrink: 0; }
  .ans-badge.correct { background: rgba(5,150,105,0.15); color: var(--success); }
  .ans-badge.wrong { background: rgba(220,38,38,0.15); color: var(--danger); }
  .ans-badge.answer { background: rgba(79,70,229,0.15); color: var(--accent); }
  .ans-text { font-family: 'Noto Sans Devanagari', 'Outfit', sans-serif; }
  .result-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .high-score-banner { text-align: center; background: rgba(79,70,229,0.08); border: 1px dashed var(--accent); border-radius: 12px; padding: 0.75rem 1rem; font-size: 0.85rem; color: var(--accent); font-weight: 500; margin-bottom: 1.5rem; }
`;

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(() => window.matchMedia?.("(prefers-color-scheme: dark)").matches);
  const [page, setPage] = useState("home");
  const [selectedSet, setSelectedSet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [chosen, setChosen] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [locked, setLocked] = useState(false);
  const [scores, setScores] = useState(() => { try { return JSON.parse(localStorage.getItem("qa_scores") || "{}"); } catch { return {}; } });
  const timerRef = useRef(null);

  const questions = selectedSet !== null ? QUIZ_SETS[selectedSet] : [];
  const currentQ = questions[qIndex] || {};

  const saveScore = useCallback((set, score) => {
    setScores(prev => {
      const next = { ...prev, [set]: Math.max(prev[set] || 0, score) };
      localStorage.setItem("qa_scores", JSON.stringify(next));
      return next;
    });
  }, []);

  const nextQuestion = useCallback((ans, timed) => {
    clearInterval(timerRef.current);
    const isCorrect = ans === currentQ.correctAnswer;
    if (!timed) playSound(isCorrect ? "correct" : "wrong");
    const newAnswers = [...answers, { question: currentQ.question, options: currentQ.options, chosen: ans, correct: currentQ.correctAnswer, isCorrect }];
    setAnswers(newAnswers);
    setTimeout(() => {
      if (qIndex + 1 >= questions.length) {
        const score = newAnswers.filter(a => a.isCorrect).length;
        saveScore(selectedSet, score);
        setPage("result");
      } else {
        setQIndex(i => i + 1);
        setChosen(null);
        setLocked(false);
        setTimeLeft(TIMER_DURATION);
      }
    }, ans ? 1000 : 600);
  }, [currentQ, answers, qIndex, questions.length, selectedSet, saveScore]);

  useEffect(() => {
    if (page !== "quiz" || locked) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setLocked(true); nextQuestion(null, true); return 0; }
        if (t <= 5) playSound("tick");
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [page, qIndex, locked, nextQuestion]);

  const startQuiz = () => {
    setShowModal(false);
    setQIndex(0);
    setAnswers([]);
    setChosen(null);
    setLocked(false);
    setTimeLeft(TIMER_DURATION);
    setPage("quiz");
  };

  const handleOption = (opt) => {
    if (locked) return;
    setChosen(opt);
    setLocked(true);
    nextQuestion(opt, false);
  };

  const resetScores = () => {
    setScores({});
    localStorage.removeItem("qa_scores");
  };
  const timerPct = (timeLeft / TIMER_DURATION) * 100;
  const timerColor = timeLeft > 15 ? "#4f46e5" : timeLeft > 7 ? "#d97706" : "#dc2626";

  const getScoreMessage = (s, t) => {
    const p = s / t;
    if (p === 1) return "🏆 Perfect Score!";
    if (p >= 0.8) return "🌟 Excellent!";
    if (p >= 0.6) return "👍 Good Job!";
    if (p >= 0.4) return "📚 Keep Learning!";
    return "💪 Try Again!";
  };

  const prevBest = scores[selectedSet] || 0;
  const isNewRecord = page === "result" && correctCount > prevBest;

  return (
    <div className={`qa-root ${dark ? "dark" : "light"}`}>
      <style>{styles}</style>

      {/* HEADER */}
      <header className="qa-header">
        <div className="qa-logo" onClick={() => setPage("home")} style={{ cursor: "pointer" }}>NepalQuiz</div>
        <button className="qa-theme-btn" onClick={() => setDark(d => !d)}>{dark ? "☀ Light" : "☾ Dark"}</button>
      </header>

      {/* HOME */}
      {page === "home" && (
        <div className="qa-page">
          <div className="home-hero">
            <div className="home-badge">🇳🇵 Knowledge Challenge</div>
            <h1 className="home-title">Nepal <span>General Knowledge</span> Quiz</h1>
            <p className="home-desc">Test your knowledge about Nepal's geography, history, culture, and more — with questions in Nepali language.</p>
            <div className="home-stats">
              <div className="stat-item"><div className="stat-num">100</div><div className="stat-label">Quiz Sets</div></div>
              <div className="stat-item"><div className="stat-num">500</div><div className="stat-label">Questions</div></div>
              <div className="stat-item"><div className="stat-num">25s</div><div className="stat-label">Per Question</div></div>
            </div>
            <button className="btn-primary" onClick={() => setPage("selection")}>Start Quiz →</button>
          </div>
        </div>
      )}

      {/* SELECTION */}
      {page === "selection" && (
        <div className="qa-page">
          <div className="selection-wrap">
            <h2 className="section-title">Choose a Quiz Set</h2>
            <p className="section-sub">Select from 100 quiz sets — each with 5 Nepali questions. ✓ marks your completed sets.</p>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
              <button className="btn-secondary" style={{ fontSize: "0.85rem", padding: "0.5rem 1.2rem", color: "var(--danger)", borderColor: "var(--danger)" }} onClick={() => { if (window.confirm("Reset all scores? This cannot be undone.")) resetScores(); }}>🔄 Reset All Scores</button>
            </div>
            <div className="quiz-grid">
              {Array.from({ length: 100 }, (_, i) => {
                const s = scores[i];
                return (
                  <button key={i} className={`quiz-btn${s !== undefined ? " completed" : ""}`} onClick={() => { setSelectedSet(i); setShowModal(true); }}>
                    {i + 1}
                    {s !== undefined && <div className="score-badge">{s}/5</div>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-icon">🎯</div>
            <h3 className="modal-title">Ready for Set #{(selectedSet || 0) + 1}?</h3>
            <p className="modal-desc">5 questions · 25 seconds each · Questions in Nepali<br />{scores[selectedSet] !== undefined && `Your best: ${scores[selectedSet]}/5`}</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={startQuiz}>Start Quiz</button>
            </div>
          </div>
        </div>
      )}

      {/* QUIZ */}
      {page === "quiz" && (
        <div className="qa-page">
          <div className="quiz-wrap">
            <div className="quiz-meta">
              <span className="q-counter">Question {qIndex + 1} / {questions.length}</span>
              <div className="timer-ring">
                <div className="timer-bar-track">
                  <div className="timer-bar-fill" style={{ width: `${timerPct}%`, background: timerColor }} />
                </div>
                <span className={`timer-num${timeLeft <= 5 ? " urgent" : ""}`}>{timeLeft}s</span>
              </div>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${((qIndex) / questions.length) * 100}%` }} />
            </div>
            <div className="question-card">
              <div className="q-set-label">Set #{(selectedSet || 0) + 1}</div>
              <p className="q-text">{currentQ.question}</p>
            </div>
            <div className="options-grid" key={qIndex}>
              {(currentQ.options || []).map((opt, i) => {
                const labels = ["A", "B", "C", "D"];
                let cls = "";
                if (locked) {
                  if (opt === currentQ.correctAnswer) cls = "correct";
                  else if (opt === chosen) cls = "wrong";
                }
                return (
                  <button key={i} className={`opt-btn ${cls}`} disabled={locked} onClick={() => handleOption(opt)}>
                    <span className="opt-label">{labels[i]}</span>
                    <span className="ans-text">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* RESULT */}
      {page === "result" && (
        <div className="qa-page">
          <div className="result-wrap">
            <div className="score-hero">
              <div className="score-circle">
                <div className="score-num">{correctCount}</div>
                <div className="score-denom">/ {questions.length}</div>
              </div>
              <h2 className="score-label">{getScoreMessage(correctCount, questions.length)}</h2>
              <p className="score-sub">Set #{(selectedSet || 0) + 1} completed</p>
              <div className="result-stats">
                <div className="rs-item"><div className="rs-num c">{correctCount}</div><div className="rs-label">Correct</div></div>
                <div className="rs-item"><div className="rs-num w">{questions.length - correctCount}</div><div className="rs-label">Wrong</div></div>
                <div className="rs-item"><div className="rs-num s">{Math.round((correctCount / questions.length) * 100)}%</div><div className="rs-label">Score</div></div>
              </div>
            </div>
            {isNewRecord && <div className="high-score-banner">🎉 New personal best for Set #{(selectedSet || 0) + 1}!</div>}
            <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>Answer Review</h3>
            <div className="answers-list">
              {answers.map((a, i) => (
                <div key={i} className="answer-card">
                  <p className="answer-q">{i + 1}. {a.question}</p>
                  {a.chosen && (
                    <div className="answer-row">
                      <span className={`ans-badge ${a.isCorrect ? "correct" : "wrong"}`}>{a.isCorrect ? "Your answer ✓" : "Your answer ✗"}</span>
                      <span className="ans-text" style={{ color: a.isCorrect ? "var(--success)" : "var(--danger)" }}>{a.chosen}</span>
                    </div>
                  )}
                  {!a.isCorrect && (
                    <div className="answer-row">
                      <span className="ans-badge answer">Correct</span>
                      <span className="ans-text" style={{ color: "var(--success)" }}>{a.correct}</span>
                    </div>
                  )}
                  {!a.chosen && (
                    <div className="answer-row">
                      <span className="ans-badge wrong">Timed out</span>
                      <span className="ans-badge answer" style={{ marginLeft: 4 }}>Answer: {a.correct}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="result-actions">
              <button className="btn-secondary" onClick={() => setPage("selection")}>← All Sets</button>
              <button className="btn-primary" onClick={startQuiz}>Retry Set</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}