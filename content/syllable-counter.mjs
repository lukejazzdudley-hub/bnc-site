export const syllableCounter = {
  slug: 'syllable-counter',
  title: 'Free Syllable Counter for Lyrics and Rap | Cadence',
  heading: 'Syllable counter for lyrics and rap',
  description: 'Paste an English verse and count syllables line by line. See alternative pronunciation counts and unfamiliar words to check by ear.',
  intro: 'Count syllables across a verse, then hear how the lines land on your beat. This free English tool runs in your browser.',
  counter: true,
  body: `<section class="tool syllable-tool" aria-label="Count syllables by line">
<form id="syllable-form" hidden><div><label for="lyric-lines">Paste your lyrics</label><textarea id="lyric-lines" rows="5" maxlength="6000" aria-describedby="syllable-help" required></textarea></div>
<p id="syllable-help">Use up to 80 lines. Your lyrics stay in this browser session.</p>
<div class="actions"><button type="submit">Count syllables</button><button id="syllable-example" type="button" data-syllable-example="The last train left at midnight&#10;I heard the drums through the rain">Try equal counts</button><button type="button" data-syllable-example="The fire fades&#10;I hear the 808">Try a range and a number</button></div></form>
<noscript><p>Enable JavaScript to count your own verse. The worked example below is available now.</p></noscript>
<p id="syllable-status" role="status"></p><ol id="syllable-results" aria-label="Syllables by line"></ol></section>
<section class="content" id="worked-example"><h2>Try the rhythm of these two lines</h2><dl class="syllable-worked"><div><dt>The last train left at midnight</dt><dd>7 syllables</dd></div><div><dt>I heard the drums through the rain</dt><dd>7 syllables</dd></div></dl><p>Both lines have seven syllables. Try holding “train” in the first and “rain” in the second. Listen to how differently the same count can fit the beat. A lyric line counts as one row here. A musical bar depends on the timing of your performance.</p><h3>When the count needs your ear</h3><dl class="syllable-worked"><div><dt>The fire fades</dt><dd>3–4 syllables</dd></div><div><dt>I hear the 808</dt><dd>3 known syllables</dd></div></dl><p>“Fire” has one- and two-syllable pronunciations in the dictionary. Read “808” the way you would perform it, such as “eight-oh-eight,” and add that count yourself.</p></section>
<section class="content" id="how-counting-works"><h2>How the count handles pronunciation</h2><p>The counter counts vowel sounds in the public English pronunciation data used by our <a href="/cadence/rhyme-finder/">rhyme finder</a>, based on the <a href="https://www.speech.cs.cmu.edu/cgi-bin/cmudict">CMU Pronouncing Dictionary</a>. Where the dictionary has more than one syllable count for a word, the result shows a range. Unfamiliar words and numerals are marked separately, so the displayed count is a subtotal. Dialect, contractions and sung delivery can change what you hear.</p><p>Read your <a href="/cadence/resources/syllables-stress-and-flow/">syllables, stresses and pauses</a> against an instrumental, or <a href="/cadence/guide/#syllables">turn on the in-app counter while writing</a>.</p></section>`,
  faqs: [
    {question: 'Does this tool upload my lyrics?', answer: 'The pronunciation dictionary downloads on the first count. The text is processed in a browser worker and is not uploaded or stored by this tool.'},
    {question: 'How many syllables fit in a rap bar?', answer: 'It depends on tempo, subdivisions, pickups, rests and delivery. Compare the line counts with a recording over the actual beat.'},
  ],
};
