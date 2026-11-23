export const pageOpenings = {
  'best-songwriting-app-ios-android': {
    title: 'Follow a song through the workspace',
    action: ['compare-the-workflows', 'Compare the apps'],
    next: ['/cadence/springtime-showers/', 'Watch arrangement and export'],
    html: `<dl class="opening-timeline">
      <div><dt>Find the performance</dt><dd><a href="/cadence/type-beat-walkthrough/">Watch a beat become a recorded draft</a>. Listen to what changes between the two deliveries.</dd></div>
      <div><dt>Prepare the handoff</dt><dd><a href="/cadence/springtime-showers/">Watch a project move from Arrange to the DAW</a>. Look for where the takes land before export.</dd></div>
    </dl><p class="opening-note">Two separate demonstrations. Arrangement and export require Pro in the current release.</p>`,
  },
  'best-songwriting-apps-for-iphone': {
    title: 'Start with a Voice Memo',
    action: ['iphone-comparison', 'Compare five iPhone apps'],
    next: ['/cadence/resources/organise-voice-memos-into-songs/', 'Organise your voice memos'],
    html: `<p class="opening-lyric">Hum a chorus into Voice Memos. Save a copy to Files.</p>
    <dl class="opening-rows"><div><dt>Writing test</dt><dd>Bring that memo into the project. Can you find the lyric while the melody plays?</dd></div>
    <div><dt>iPad handoff</dt><dd>Open a copy on iPad. Check that the audio arrived along with the words.</dd></div></dl>`,
  },
  'best-songwriting-apps-for-android': {
    title: 'The Android offline check',
    action: ['android-shortlist', 'Compare Android apps'],
    next: ['/cadence/songwriting-app-android/', 'Explore Cadence for Android'],
    html: `<p>Use a beat saved to your phone’s Downloads folder. Check each step as you try it.</p>
    <ul class="opening-checks">
      <li><label><input type="checkbox"> Find the beat through the file picker.</label></li>
      <li><label><input type="checkbox"> Save a short take, then close the project.</label></li>
      <li><label><input type="checkbox"> In airplane mode, reopen the draft and play both the beat and the take.</label></li>
    </ul><p class="opening-note">Use a test project before bringing an existing song into a new app.</p>`,
  },
  'types-of-rhyme': {
    title: 'One rhyme can have two labels',
    action: ['rhyme-chart', 'See the rhyme chart'],
    next: ['/cadence/rhyme-finder/', 'Find a rhyme for your line'],
    html: `<p class="opening-lyric">“The <mark>light</mark> hit the <mark>night</mark> bus.”</p>
    <dl class="opening-grid"><div><dt>Sound · perfect</dt><dd>Light and night share the stressed vowel and its ending.</dd></div>
    <div><dt>Placement · internal</dt><dd>The match happens before “bus,” inside the line.</dd></div></dl>
    <p class="opening-note">Read it again with a pause after “light.” The sound stays the same, but the landing changes.</p>`,
  },
  'multi-word-rhymes': {
    title: 'Tap the two stressed sounds',
    action: ['two-bar-exercise', 'Write two bars'],
    next: ['/cadence/rhyme-finder/', 'Look up phrase rhymes'],
    html: `<table class="opening-stress"><thead><tr><th scope="col">First tap</th><th scope="col">Second tap</th></tr></thead>
    <tbody><tr><td>night</td><td>train</td></tr><tr><td>light</td><td>rain</td></tr></tbody></table>
    <p>Say each row over two taps. In the second column, the R sits in the onset before the shared AY-N sound. Try “late train” next. Only the second tap still matches.</p>`,
  },
  'assonance-vs-consonance': {
    title: 'Keep one sound and change the rest',
    action: ['compare-on-beat', 'Try it over a beat'],
    next: ['/cadence/resources/internal-rhymes-and-rhyme-schemes/', 'Build a rhyme pattern across a verse'],
    html: `<dl class="opening-rows opening-sounds"><div><dt>Assonance · repeating OH</dt><dd>“Sl<mark>ow</mark> b<mark>oa</mark>ts r<mark>o</mark>ll h<mark>o</mark>me.”</dd></div>
    <div><dt>Consonance · repeating K</dt><dd>“A qui<mark>ck</mark> <mark>c</mark>li<mark>ck</mark> in the lo<mark>ck</mark>.”</dd></div></dl>
    <details><summary>Try swapping a word</summary><p>Swap “boats” for “trains,” then “lock” for “door.” Hear which link drops out in each line.</p></details>`,
  },
  'organize-song-drafts': {
    title: 'Give a stalled song one next move',
    action: ['song-draft-template', 'Get the full draft template'],
    next: ['/cadence/resources/lyric-draft-to-recorded-demo/', 'Take a lyric draft through to a demo'],
    html: `<div class="opening-project"><p>Kitchen Light <span>Working title</span></p>
    <dl class="opening-rows"><div><dt>Keep</dt><dd>Phone memo with the chorus melody</dd></div>
    <div><dt>Decide</dt><dd>Should the last chorus repeat twice?</dd></div>
    <div><dt>Next session</dt><dd>Record one take with each ending.</dd></div></dl></div>
    <details><summary>View the blank template</summary><p>Working title · Keep · Decide · Next session. Choose one action you can finish in one sitting.</p></details>`,
  },
  'how-to-write-a-song-hook': {
    title: 'Build a four-bar hook',
    action: ['record-the-hook', 'Write and test a hook'],
    next: ['/cadence/syllable-counter/', 'Check the rhythm of your hook'],
    html: `<ol class="opening-bars">
    <li>Leave the light on</li><li>Let “on” ring</li><li>I’m almost home</li><li>Leave the light on</li></ol>
    <details><summary>Try a different entrance</summary><p>Sing “leave” on beat one, then try it on the last beat of the count-in. Keep the rest unchanged. Pick the version that’s easier to repeat from memory.</p></details>`,
  },
};
