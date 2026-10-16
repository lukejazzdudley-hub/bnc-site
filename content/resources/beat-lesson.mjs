const textField = (name, label, rows = 2) => `<label class="beat-field">${label}<textarea name="${name}" rows="${rows}" maxlength="12000"></textarea><span class="beat-print-field" data-print-field="${name}"></span></label>`;

export const beatLessonSections = [
  {
    id: 'beat-to-demo-lesson',
    heading: 'A 30-minute beat-to-demo lesson',
    html: `<p>Make a short demo that lets you hear a writing decision. Use a beat you have permission to practise with, headphones, a notebook and any recorder. You do not need Cadence or an account. This is a writing exercise, not a promise to finish a release-ready song in half an hour.</p>
<ol class="beat-lesson-steps"><li><strong>Minutes 0–5 · Hear the shape.</strong> Count four beats per bar. Find the first full bar, then mark changes in the instrumental. If the beat uses another metre, adapt the count; the worksheet calculator below assumes four beats per bar.</li><li><strong>Minutes 5–10 · Choose a thought.</strong> Write one sentence about what changes. Our original example: “Missing the last bus gives me time to decide what I actually want to say.” Speak that sentence over a four-bar loop.</li><li><strong>Minutes 10–18 · Draft and record A.</strong> Write four lines, try one per bar, then record at the beat’s actual tempo. Do not polish the recording yet.</li><li><strong>Minutes 18–25 · Change one thing and record B.</strong> Shorten one rushed phrase, or move one entry. Keep the beat, loop and recording level the same.</li><li><strong>Minutes 25–30 · Listen and choose.</strong> Compare the two takes without reading. Write down what became clearer, what lost energy and what you would change next.</li></ol>
<p><a href="#beat-to-demo-worksheet">Use the worksheet below</a> for your own beat, section lengths and take notes. In a class, one person performs while a partner records the words they actually heard; swap roles before giving advice. Ask before sharing anyone’s recording.</p>`
  },
  {
    id: 'worked-verse-revision',
    heading: 'Worked example: leave room for the thought',
    html: `<p>These are original text and delivery suggestions, not a transcription of a finished performance. Start with this deliberately crowded third line:</p>
<blockquote><p>Last bus gone, but I still know the way<br>Rain on the glass puts a pause in the day<br>I had a whole speech that I wanted to say, but I let half of it go<br>Left room for the thought that I wanted to show</p></blockquote>
<p>Try each line in one bar at a comfortable tempo. If line three rushes, cut the explanation while keeping the action. The revised line is: <strong>“I had a whole speech; I let half of it go.”</strong> It is a candidate to test, not an automatic improvement: a dense delivery may suit a different beat.</p>
<div class="table-scroll" tabindex="0" role="region" aria-label="Original verse delivery annotations"><table><thead><tr><th scope="col">Bar</th><th scope="col">Proposed landing</th><th scope="col">What to test aloud</th></tr></thead><tbody><tr><th scope="row">1</th><td>LAST bus GONE / … WAY</td><td>Enter on beat one. Let “gone” carry the missed-bus image; leave space after “way.”</td></tr><tr><th scope="row">2</th><td>RAIN … GLASS / … DAY</td><td>Keep “rain” and “glass” intelligible. Take a breath after “day” if you need it.</td></tr><tr><th scope="row">3</th><td>WHOLE SPEECH / … GO</td><td>Try the shortened line. Use the semicolon as a small pause; do not force an extra breath into it.</td></tr><tr><th scope="row">4</th><td>LEFT ROOM … THOUGHT / … SHOW</td><td>Try entering a little later than bar one. Keep “thought” audible before the rhyme.</td></tr></tbody></table></div>
<p>Capitals mark suggested emphasis; the slash marks a proposed space, not a measured beat grid or a compulsory breath. <em>Way/day</em> and <em>go/show</em> are two rhyme pairs. The sound pattern changes halfway through, just as the lyric moves from the missed bus to the decision to say less.</p>
<p>For bars five to eight, write what the speaker does next. Change the image or reveal a consequence rather than copying the first four lines merely to fill the section. If you write in another language, keep its natural stress and your intended pronunciation; do not translate the English rhyme endings literally. Our <a href="/cadence/languages/">language directory</a> separates app packs from the three available browser dictionaries.</p>`
  },
  {
    id: 'demo-section-map',
    heading: 'Turn the verse into a small section map',
    html: `<p>A short exercise arrangement can use <strong>4 intro bars → 8 verse bars → 4 hook bars → 4 outro bars</strong>. At 90 BPM in four-beat bars, those 20 bars last about 53.3 seconds. This is an example plan, not the structure of every type beat: follow the instrumental’s actual changes before fixing your section lengths.</p>
<div class="beat-map" role="img" aria-label="Example section map: intro bars 1 to 4, verse bars 5 to 12, hook bars 13 to 16, outro bars 17 to 20"><span><strong>01–04</strong>Intro<small>Hear the beat</small></span><span><strong>05–12</strong>Verse<small>Image → decision</small></span><span><strong>13–16</strong>Hook<small>One clear thought</small></span><span><strong>17–20</strong>Outro<small>Leave an answer</small></span></div>
<p>Keep the intro instrumental if it helps you hear the entry. Use the verse to develop the scene. For a hook, try the original two-line idea “Leave a little room / let the real words through”; repeat or vary it only if it works against your beat. Let the outro expose an instrumental answer instead of forcing another lyric.</p>
<p>Write the first full downbeat as your reference point. A pickup before it, a count-in or a tempo change shifts file timestamps; the worksheet’s calculated times do not detect those things. Mark them yourself before recording or handing the session to someone else.</p>`
  },
  {
    id: 'compare-takes-and-handoff',
    heading: 'Compare two real takes, then make a usable handoff',
    html: `<p>Record your own A and B over the same loop, then use these questions to choose the next edit. For a captured app sequence, see the <a href="/cadence/type-beat-walkthrough/">type-beat walkthrough and its recording notes</a>.</p>
<div class="table-scroll" tabindex="0" role="region" aria-label="Two-take listening exercise"><table><thead><tr><th scope="col">Listen for</th><th scope="col">Take A: original</th><th scope="col">Take B: one revision</th></tr></thead><tbody><tr><th scope="row">Entry</th><td>Which word arrives late?</td><td>Did the change fix the entry or move the rush elsewhere?</td></tr><tr><th scope="row">Breath</th><td>Where does the phrase run out of air?</td><td>Can you repeat it without swallowing the ending?</td></tr><tr><th scope="row">Meaning</th><td>What image can a listener repeat back?</td><td>Did the shorter line preserve that image?</td></tr><tr><th scope="row">Energy</th><td>Which imperfect moment feels alive?</td><td>Is the clearer version still worth hearing?</td></tr></tbody></table></div>
<p>Name files so another person can find the choice: <code>last-bus_90bpm_verse_take-A</code> and <code>last-bus_90bpm_verse_take-B</code>. Use the real tempo and section name. Keep the first take, record your decision and note any pickup before bar one.</p>
<ol><li><strong>Check permission.</strong> Keep the producer’s licence or permission reference with the session. “Free beat” alone does not tell you which uses are permitted; the worksheet grants no rights to an instrumental.</li><li><strong>Keep a common start.</strong> If your recorder supports separate beat and vocal files, use the same starting reference. If it only makes a mixed demo, label it as a mix rather than a vocal stem.</li><li><strong>Open the files elsewhere.</strong> Listen outside the writing app. Check the beginning and ending, the selected take and whether the beat is present as intended.</li><li><strong>Include a short note.</strong> State tempo, version, preferred take, producer credit and the next edit. Keep original recordings until the receiving session has been checked.</li></ol>
<p>For Cadence users, the <a href="/cadence/guide/#import-audio">import-audio chapter</a> and <a href="/cadence/guide/#beat-loop">A/B loop chapter</a> cover setup; <a href="/cadence/guide/#section-recording">section recording</a>, <a href="/cadence/guide/#build-in-daw">Build in DAW</a> and <a href="/cadence/guide/#export-audio">audio export</a> explain the app controls. Cadence starts with three free notes. The full arrangement and export workflow requires Pro; the lesson and worksheet below are free and need no account.</p>`
  },
  {
    id: 'beat-to-demo-worksheet',
    heading: 'Your beat-to-demo worksheet',
    html: `<p>Fill this in while you practise. The calculator updates the section times; skip a section with 0 bars. Entries stay in this page’s memory and are not saved to your account or sent to us. <strong>Download before leaving or reloading.</strong> You can also <a href="/cadence/resources/beat-to-demo-worksheet.txt" download>download a blank text worksheet</a> without JavaScript.</p>
<form class="beat-worksheet" data-beat-worksheet aria-label="Beat-to-demo worksheet">
<div class="beat-worksheet__heading"><span>FIELD NOTES / 01</span><strong>From beat to first demo</strong><p>Listen. Write. Record. Choose.</p></div>
${textField('title', 'Song / session name', 1)}
${textField('beat', 'Beat, producer and permission reference', 2)}
${textField('intent', 'What changes in this song?', 2)}
<fieldset><legend>Section plan · four beats per bar</legend><div class="beat-plan-inputs"><label>Tempo (BPM)<input name="tempo" type="number" min="40" max="240" step="any" value="90" required></label>${[['introBars','Intro',4],['verseBars','Verse',8],['hookBars','Hook',4],['outroBars','Outro',4]].map(([name,label,value]) => `<label>${label} bars<input name="${name}" type="number" min="0" max="256" step="1" value="${value}" required></label>`).join('')}</div></fieldset>
<p class="beat-plan-status" data-plan-status role="status" aria-live="polite">Example: 20 bars · 53.3 seconds at 90 BPM. Four beats per bar; constant tempo assumed. Enable JavaScript to recalculate.</p><div data-section-plan></div>
${textField('lyrics', 'Lyrics · mark your entry words and breaths', 8)}
${textField('takeA', 'Take A · entry, breath, words heard, image remembered', 3)}
${textField('takeB', 'Take B · change one thing; what happened?', 3)}
${textField('decision', 'Decision · keep, revise and record next', 3)}
<div class="beat-worksheet__actions" data-worksheet-actions hidden><button type="button" data-download-worksheet>Download my worksheet</button><button type="button" data-print-worksheet>Print worksheet</button></div>
<p class="beat-worksheet__credit">Original exercise and worksheet by Cadence / Brand Name Changes. Copy for personal use or teaching with credit. This is not a beat licence.</p>
</form>
<p>Prefer paper? Print this page and select the worksheet pages, or use the worksheet’s Print button with JavaScript enabled. Browser print settings control headers, footers and paper size.</p>`
  }
];
