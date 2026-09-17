const checked = '2026-09-17';

export const articles = [
  {
    slug: 'writing-rap-lyrics-over-a-beat',
    title: 'How to Write Rap Lyrics Over a Beat',
    description: 'A practical method for finding pockets, drafting bars, testing breath, and revising rap lyrics against the beat that will carry them.',
    heading: 'Write rap lyrics that live inside the beat',
    intro: 'The page can hide timing problems. The beat cannot. This workflow starts with listening, turns rhythm into a usable map, and keeps meaning in charge while you draft and revise.',
    category: 'Improve your writing',
    sections: [
      {
        id: 'listen-before-writing',
        heading: 'Listen for the beat’s invitations',
        html: String.raw`<p>Before you write a bar, loop the beat and listen without filling every gap. Mark the moments your body already notices: the kick, snare, bass change, melodic answer, drop, and any space before a section turns over. Those moments are invitations, not obligations. A vocal can reinforce them, answer them late, or deliberately leave them exposed.</p>
<p>Count in a way you can repeat. In a common four-beat bar, say “one and two and three and four and” while the beat plays. Then replace the count with neutral sounds such as “DA-da-da / DA-da / DA.” You are discovering a pocket: a repeatable relationship between syllables and pulse. Record three nonsense-flow passes before choosing words. The most natural pass often gives you the line lengths and landing points your lyric needs.</p>
<p>Tempo changes how much room a syllable has, while the same tempo can still support straight, swung, double-time, or half-time delivery. Treat BPM as a coordinate, not a command. The useful question is: <em>where does this beat make a word feel important?</em> Berklee’s overview of <a href="https://online.berklee.edu/courses/lyric-writing-writing-lyrics-to-music">writing lyrics to music</a> likewise treats melodic phrasing, stressed beats, rhyme placement, and song form as connected decisions.</p>`
      },
      {
        id: 'build-a-flow-map',
        heading: 'Build a flow map before polishing rhymes',
        html: String.raw`<p>Write one line of marks for each bar. Use <strong>X</strong> for a strong landing, <strong>x</strong> for a lighter syllable, a dash for a held sound, and a slash for breath. A four-bar sketch might look like this:</p>
<pre><code>1  X x x X — / x X
2  X x   X x x X
3  x X x X — / X
4  X x x x X — —</code></pre>
<p>Now draft to that shape. This original example uses capitals to show the intended stresses:</p>
<blockquote><p>RAIN on the railing, I WAIT for the green<br>
NIGHT bus is crawling through GLASS and machine<br>
I CAME with a question, I LEAVE with a plan<br>
Four stops from nowhere, still KNOW who I am</p></blockquote>
<p>The end words rhyme closely enough to create continuity, but the repeated stress shape does more of the rhythmic work. Do not count syllables alone. “Machine” has two syllables with stress at the end; “railing” has two with stress at the beginning. Swapping them into the same slot can change the feel even though the count is unchanged. The guide to <a href="/cadence/resources/syllables-stress-and-flow/">syllables, stress, and flow</a> gives a deeper method for scanning this.</p>`
      },
      {
        id: 'draft-in-layers',
        heading: 'Draft in layers: intent, rhythm, then rhyme',
        html: String.raw`<p>Start each section with one plain sentence that says what changes. For example: “I miss the last train, but the delay forces me to decide whether to go back.” That sentence is not a lyric; it is a compass. List concrete nouns and verbs around it—platform, rain, screen, reverse, stall, call—then draft the first four bars without demanding a perfect rhyme in every line.</p>
<p>On the second pass, strengthen stressed words. “I am standing at the station and I do not know” carries little weight. “Last train gone; the platform says choose” puts images and action on the landings. On the third pass, add a rhyme pattern that supports the thought. Rhyme is easier to judge once the line already has a job.</p>
<p>Keep alternate endings beside the verse instead of deleting them. Cadence places Perfect, Slant, Multi-syllable, Multi-word, and Assonance rhyme families beside the lyric, and its rhyme engine runs on-device; the broader <a href="/cadence/">Cadence product page</a> documents those current features. A result is raw material, not a verdict. Reject any candidate that twists your sentence into something you would never say.</p>`
      },
      {
        id: 'test-breath-and-clarity',
        heading: 'Test breath, consonants, and clarity out loud',
        html: String.raw`<p>Perform the verse at least five times over the actual beat. On pass one, notice only late or rushed entries. On pass two, mark breaths. On pass three, listen for consonant clusters that tangle at speed. On pass four, exaggerate the stresses. On pass five, record at performance energy.</p>
<ul><li>If you run out of breath, remove a low-value phrase before increasing speed.</li><li>If two hard consonants collide, change the word order or leave a small rest.</li><li>If the rhyme is audible but the sentence is not, simplify the setup.</li><li>If every bar has identical density, create contrast by opening one bar up.</li></ul>
<p>Do not mistake difficulty for quality. A dense internal pattern can be exciting, but a short line before the hook may create more impact. Likewise, rhyming on every possible subdivision can flatten emphasis because nothing is allowed to stand apart. The beat already contains information; your vocal does not have to duplicate all of it.</p>`
      },
      {
        id: 'revise-with-recordings',
        heading: 'Revise from recordings, not memory',
        html: String.raw`<p>A written bar and a performed bar are different objects. Record a rough take, wait a few minutes, then listen once without reading. Write down only what you actually hear: the words that disappear, the line that lands early, the image you remember, and the moment your attention drops. Those notes form a better revision list than staring at the text.</p>
<p>Change one variable per pass. First fix timing, then breath, then wording, then rhyme detail. If you rewrite all four at once, you cannot tell which change improved the performance. Save a rough version before large edits so an energetic imperfect take is not lost to a tidier but flatter rewrite.</p>
<p>In Cadence, you can bring in the beat waveform, set independent A/B points, keep the lyric with vocal takes, and build a Draft Demo before moving further into the multitrack workflow. Those tools reduce app-switching; they do not decide whether a line works. Your final test remains simple: can you perform the verse repeatedly, can a listener follow its movement, and does the voice make the beat feel more complete?</p>`
      }
    ],
    sources: [
      { title: 'Lyric Writing: Writing Lyrics to Music — Berklee Online', url: 'https://online.berklee.edu/courses/lyric-writing-writing-lyrics-to-music', checked },
      { title: 'Rhyme — Poetry Foundation glossary', url: 'https://www.poetryfoundation.org/education/glossary/rhyme', checked },
      { title: 'Cadence songwriting workspace', url: 'https://brandnamechanges.com/cadence/', checked }
    ]
  },
  {
    slug: 'perfect-slant-multisyllabic-rhymes',
    title: 'Perfect, Slant, and Multisyllabic Rhymes Explained',
    description: 'Hear the difference between perfect, slant, assonance, and multisyllabic rhyme, then choose the type that serves your lyric.',
    heading: 'Choose rhymes by sound, stress, and purpose',
    intro: 'Rhyme is not a spelling contest. It is a relationship between performed sounds, and different degrees of similarity create different kinds of closure.',
    category: 'Improve your writing',
    sections: [
      {
        id: 'rhyme-begins-with-sound',
        heading: 'Rhyme begins at the stressed vowel',
        html: String.raw`<p>In a conventional perfect rhyme, the final stressed vowel and the sounds after it match, while the sound immediately before that vowel differs. <em>Light/night</em> is perfect: the long “i” and final “t” match, but the opening consonants do not. <em>Light/flashlight</em> repeats the whole word sound and is usually less satisfying because the difference is too small.</p>
<p>Spelling can mislead. <em>Move/love</em> looks related but uses different vowels; <em>blue/through</em> looks different but rhymes in many accents. The Poetry Foundation’s <a href="https://www.poetryfoundation.org/education/glossary/rhyme">rhyme glossary</a> defines rhyme through repeated syllable sounds and distinguishes end rhyme, internal rhyme, and several imperfect forms. Always say candidates aloud in the accent and delivery you intend.</p>
<p>Pronunciation dictionaries are useful maps, not universal authorities. CMU describes CMUDict as a US English pronunciation resource and notes that read-speech approximations do not capture every way native speakers pronounce a word. Its own <a href="https://cmusphinx.github.io/2014/11/cmudict-0-7b-update/">CMUDict overview</a> is a useful reminder that accent, context, singing, and performance can alter a match.</p>`
      },
      {
        id: 'perfect-rhyme',
        heading: 'Perfect rhyme creates a firm landing',
        html: String.raw`<p>Perfect rhyme is useful when you want resolution, memorability, or a clearly audible pattern. In the original couplet “I folded the <strong>map</strong> / and slept through the <strong>gap</strong>,” the stressed vowel and final consonant match. The relation is immediate, so the second line feels closed.</p>
<p>That strength can become a limitation. A chain of obvious perfect rhymes may make the listener predict the wording before the thought arrives. Avoid solving this by reaching for an unrelated word. Instead, change the grammatical route to the landing. If <em>night</em> pulls you toward a familiar <em>light</em>, move the rhyme inside the line, use a less expected image, or choose a different sound family.</p>
<p>Also listen for identical rhyme, where the same word repeats in the same sense. Repetition can be a deliberate hook, but it does not create the same turn as two different words meeting at the sound. Name the device honestly so you can decide whether the repetition is doing structural work or merely filling the slot.</p>`
      },
      {
        id: 'slant-and-assonance',
        heading: 'Slant rhyme keeps the door partly open',
        html: String.raw`<p>Slant rhyme—also called half or off rhyme—shares important sounds without completing the full perfect-rhyme pattern. There is no single universal boundary. <em>Room/storm</em> can feel related through the sustained vowel colour and closing consonants in a particular delivery; <em>glass/lost</em> may connect through consonant shape and performance even though the vowels differ.</p>
<p>Assonance focuses on repeated vowel sound, while consonance focuses on repeated consonant sound. In “slow road, no home,” the long “o” carries the chain. In “brick clock, back click,” the hard consonants provide much of the texture. These looser relations can suit uncertainty, conversation, menace, or forward motion because they echo without fully settling.</p>
<p>Do not label a weak match “slant” merely to defend it. Put both words into their complete lines, perform them at tempo, and ask whether the relationship is audible without explanation. A rhyme can be technically close and still disappear behind an unstressed delivery. Conversely, pitch, elongation, and accent may pull two imperfect words closer in a sung or rapped phrase.</p>`
      },
      {
        id: 'multisyllabic-rhyme',
        heading: 'Multisyllabic rhyme matches a longer sound shape',
        html: String.raw`<p>A multisyllabic rhyme matches across two or more syllables. The number of syllables in the written word is not enough; the matching sound and stress pattern matter. <em>Motion/ocean</em> forms a compact two-syllable match in many pronunciations. A phrase can participate too: “paper crown” might answer “take it down” when the delivery aligns their stressed vowels and tails.</p>
<p>Build longer rhymes from the anchor outward:</p>
<ol><li>Choose the most important stressed vowel: <em>crown</em>.</li><li>Collect useful sound neighbours: <em>down, ground, out, now</em>.</li><li>Add the preceding rhythm: <em>paper crown</em>.</li><li>Search for phrases with a compatible shape: <em>lay it down</em>, <em>wait around</em>.</li><li>Write complete thoughts, then keep only matches that sound natural at tempo.</li></ol>
<p>A multi-word rhyme is not automatically multisyllabic, and a multisyllabic rhyme is not automatically good. “I state it now / the paper crown” has a promising sound span but vague meaning. “You built a paper crown / rain came and weighed it down” earns the rhyme by continuing the image.</p>`
      },
      {
        id: 'choose-for-effect',
        heading: 'Choose the rhyme strength that fits the emotion',
        html: String.raw`<p>Berklee’s discussion of <a href="https://online.berklee.edu/takenote/prosody-in-music-and-songwriting/">prosody in songwriting</a> frames lyric, melody, harmony, and rhythm as choices that should support the song’s central intent. Rhyme belongs in that system. A firm perfect rhyme can support certainty. A delayed or slant answer can support instability. Breaking an established pattern can make one line feel exposed.</p>
<table><thead><tr><th>Need</th><th>Try</th><th>Watch for</th></tr></thead><tbody><tr><td>Clear hook closure</td><td>Perfect end rhyme</td><td>Predictable wording</td></tr><tr><td>Conversational verse</td><td>Slant rhyme or assonance</td><td>Connections too faint to hear</td></tr><tr><td>Dense rhythmic momentum</td><td>Multisyllabic or multi-word rhyme</td><td>Syntax bent around the rhyme</td></tr><tr><td>One line to stand apart</td><td>Break or postpone the pattern</td><td>Accidental-sounding inconsistency</td></tr></tbody></table>
<p>Cadence separates five useful search families—Perfect, Slant, Multi-syllable, Multi-word, and Assonance—so you can compare kinds of fit rather than treating every result as equivalent. The free <a href="/cadence/rhyme-finder/">browser rhyme finder</a> covers a more limited English dictionary and curated phrase bank. Both are starting points. Meaning, accent, stress, and the full performed line make the final decision.</p>`
      }
    ],
    sources: [
      { title: 'Rhyme — Poetry Foundation glossary', url: 'https://www.poetryfoundation.org/education/glossary/rhyme', checked },
      { title: 'Prosody in Music and Songwriting — Berklee Online', url: 'https://online.berklee.edu/takenote/prosody-in-music-and-songwriting/', checked },
      { title: 'CMUDict 0.7b update — CMUSphinx', url: 'https://cmusphinx.github.io/2014/11/cmudict-0-7b-update/', checked },
      { title: 'Cadence free English rhyme finder', url: 'https://brandnamechanges.com/cadence/rhyme-finder/', checked }
    ]
  },
  {
    slug: 'internal-rhymes-and-rhyme-schemes',
    title: 'Internal Rhymes and Rhyme Schemes That Stay Musical',
    description: 'Design end-rhyme and internal-rhyme patterns that guide the ear without making every line sound mechanical.',
    heading: 'Build rhyme patterns the listener can feel',
    intro: 'A rhyme scheme is more than letters at line endings. Placement, repetition, distance, and the strength of each sound decide how the pattern moves.',
    category: 'Improve your writing',
    sections: [
      {
        id: 'map-the-end-rhymes',
        heading: 'Map the end rhymes first',
        html: String.raw`<p>Label each new end sound with a letter. Four lines ending in <em>street, rain, feet, train</em> form ABAB; <em>street, feet, rain, train</em> form AABB. The letters describe recurrence, not quality. The Poetry Foundation’s <a href="https://www.poetryfoundation.org/education/glossary/rhyme">rhyme glossary</a> uses the same letter convention and distinguishes end rhyme from rhyme within a line.</p>
<p>Start with a simple map because it lets you hear deviations. The <a href="https://www.poetryfoundation.org/education/glossary/quatrain">Poetry Foundation’s quatrain entry</a> shows how four-line stanzas can support ABAB, AABB, ABCB, and other schemes. An original ABAB verse might read:</p>
<blockquote><p>The shutters shake above the <strong>street</strong> (A)<br>
I count the seconds after <strong>rain</strong> (B)<br>
The corner shop turns off its <strong>heat</strong> (A)<br>
I miss my stop and ride the <strong>train</strong> (B)</p></blockquote>
<p>The scheme creates expectation, but the images and action keep it from becoming a list of rhyming words. If you cannot state what changes across the four lines, the scheme may be disguising a static verse. Write the movement in prose first, then use the pattern to organise it.</p>`
      },
      {
        id: 'place-internal-rhymes',
        heading: 'Place internal rhymes where they shape momentum',
        html: String.raw`<p>Internal rhyme connects sounds inside a line or connects an internal word with another rhyme position. It can accelerate a phrase, make a pivot memorable, or bind a long line together. In “The <strong>late</strong> bus waits while I <strong>pace</strong> by the gate,” the repeated long vowel creates a loose internal chain before the end word.</p>
<p>Do not sprinkle internal rhyme at random. Choose recurring positions. For example, place one near beat two and another near beat four across two bars. The listener then feels a rhythmic architecture even if the exact syllable counts vary. You can annotate a draft like this:</p>
<pre><code>bar 1: x x A x / x x B
bar 2: x x A x / x x B
bar 3: x A x x / x B x
bar 4: x x A x / REST B</code></pre>
<p>Bar three shifts the placements, and bar four creates space before the final answer. The variation is audible because the first two bars established a norm. Without repetition, variation has nothing to vary from.</p>`
      },
      {
        id: 'weave-rhyme-chains',
        heading: 'Weave chains instead of stacking couplets',
        html: String.raw`<p>A verse can carry more than one sound family. Try an end-rhyme skeleton in one family and a lighter internal chain in another. This original four-line example uses end sounds in <strong>bold</strong> and internal echoes in <em>italics</em>:</p>
<blockquote><p>I <em>fold</em> the receipt, take the long way <strong>home</strong><br>
The <em>cold</em> in the seat makes the night feel <strong>wide</strong><br>
You <em>told</em> me to leave, now the whole road <strong>glows</strong><br>
I <em>hold</em> to the wheel with the truth on my <strong>side</strong></p></blockquote>
<p>The internal <em>old</em> chain gives continuity while the end words alternate looser A/B families. Because the line meanings advance—from object, to sensation, to remembered speech, to decision—the technique supports a story rather than replacing one.</p>
<p>Longer chains are most convincing when grammar remains natural. If every line uses the same inverted sentence just to expose a rhyme, vary the scheme or move a match inside the bar. A listener notices strained syntax faster than they notice the technical achievement that caused it.</p>`
      },
      {
        id: 'control-density',
        heading: 'Control density across sections',
        html: String.raw`<p>Rhyme density is the amount of audible recurrence in a span of music. More density can create propulsion or pressure; less can create intimacy, clarity, or release. Contrast often matters more than the absolute count. A tightly rhymed verse can open into a chorus with one long repeated vowel. A sparse verse can lead to a hook where every short phrase answers another.</p>
<table><thead><tr><th>Section job</th><th>Possible pattern</th><th>Reason</th></tr></thead><tbody><tr><td>Set the scene</td><td>ABCB with light internal echoes</td><td>Leaves room for detail</td></tr><tr><td>Build pressure</td><td>AABB plus a repeated internal chain</td><td>Increases recurrence</td></tr><tr><td>Deliver the hook</td><td>Short perfect-rhyme pair or repeated title</td><td>Creates a clear landing</td></tr><tr><td>Change perspective</td><td>Break the established rhyme for one line</td><td>Makes the turn audible</td></tr></tbody></table>
<p>These are options, not rules. Prosody asks whether the pattern supports the emotional and musical purpose; Berklee’s <a href="https://online.berklee.edu/takenote/prosody-in-music-and-songwriting/">overview of prosody</a> is useful when deciding whether stability or instability should dominate a section.</p>`
      },
      {
        id: 'audit-the-pattern',
        heading: 'Audit the pattern by ear',
        html: String.raw`<p>Highlight each sound family in a different colour, then perform the section without looking. Afterward, mark only the rhymes you actually heard. A rhyme may vanish because it is unstressed, swallowed, too far from its partner, or masked by the arrangement. Another may feel overemphasised because it lands at the same musical point every time.</p>
<ol><li>Read the lyric as ordinary speech and fix unnatural word order.</li><li>Perform it over the beat and circle rushed setups.</li><li>Mute or ignore the end words and check whether the sentences still matter.</li><li>Restore the rhymes and vary one expected placement.</li><li>Record two versions: precise and conversational. Keep the stronger meaning.</li></ol>
<p>Cadence can highlight rhyme relationships and place multiple rhyme families beside the lyric, as shown in its <a href="/cadence/rap-writing-app/">rap-writing workflow</a>. Use that visibility to diagnose a pattern, not to maximise the number of coloured words. The finished verse should sound intentional when nobody can see the markup.</p>`
      }
    ],
    sources: [
      { title: 'Rhyme — Poetry Foundation glossary', url: 'https://www.poetryfoundation.org/education/glossary/rhyme', checked },
      { title: 'Quatrain — Poetry Foundation glossary', url: 'https://www.poetryfoundation.org/education/glossary/quatrain', checked },
      { title: 'Prosody in Music and Songwriting — Berklee Online', url: 'https://online.berklee.edu/takenote/prosody-in-music-and-songwriting/', checked },
      { title: 'Cadence rap-writing workflow', url: 'https://brandnamechanges.com/cadence/rap-writing-app/', checked }
    ]
  },
  {
    slug: 'syllables-stress-and-flow',
    title: 'Syllables, Stress, and Flow: A Practical Lyric Guide',
    description: 'Count syllables, hear natural word stress, map strong beats, and revise lyric flow without flattening your delivery.',
    heading: 'Make the words and the music lean the same way',
    intro: 'Two lines can have the same syllable count and completely different flow. Stress, duration, rests, and placement explain the difference.',
    category: 'Improve your writing',
    sections: [
      {
        id: 'count-what-you-perform',
        heading: 'Count the syllables you actually perform',
        html: String.raw`<p>A syllable is a beat of spoken sound, but performance can compress, extend, or divide what the page suggests. <em>Every</em> may be two syllables in one delivery and three in another. A singer may stretch a one-syllable word across several notes without turning it into several lexical syllables. Count by speaking the line naturally first, then count the version you intend to perform.</p>
<p>Mark each syllable with a dot:</p>
<pre><code>The / win-dow / keeps / the / morn-ing / out
 1      2       1    1      2       1  = 8</code></pre>
<p>Now compare “The morning stays outside my window.” It may also fit eight spoken syllables, but its stresses fall differently. Syllable count helps you spot crowding and imbalance; it cannot tell you whether a line grooves. Pronunciation tools can help with unfamiliar words, but CMUSphinx notes that a <a href="https://cmusphinx.github.io/wiki/tutorialdict/">phonetic dictionary maps words to phonemes</a> and cannot eliminate the irregularities of real pronunciation.</p>`
      },
      {
        id: 'hear-natural-stress',
        heading: 'Hear natural word and sentence stress',
        html: String.raw`<p>Say the line as if you were speaking to someone across a table. Which syllables become longer, louder, clearer, or higher? In “I <strong>NEV</strong>er sent the <strong>LET</strong>ter,” the first syllable of <em>never</em> and <em>letter</em> normally carry word stress. Sentence meaning adds another layer: stressing <em>I</em>, <em>never</em>, or <em>letter</em> changes what the listener thinks you are correcting.</p>
<p>Berklee recommends preserving natural language stress unless a mismatch is deliberate; its article on the <a href="https://www.berklee.edu/berklee-now/news/berklee-riffs-natural-music-in-language">natural music in language</a> shows how melodic setting can reinforce or interfere with the intended idea. A misplaced stress is not forbidden. It simply calls attention to itself, so it should earn that attention.</p>
<p>Underline the important syllables, then remove any stressed filler. Articles and conjunctions may need rhythmic space, but a line that lands heavily on <em>the</em> or <em>and</em> while rushing its key image often feels accidental.</p>`
      },
      {
        id: 'map-musical-stress',
        heading: 'Map word stress against musical stress',
        html: String.raw`<p>Strong musical positions come from more than beat numbers. A long note, high pitch, isolated entrance, rest before a word, chord change, or drum accent can all create emphasis. Mark the musical landings with X, then align the words you want the listener to retain.</p>
<pre><code>Pulse:  1 &amp; 2 &amp; 3 &amp; 4 &amp;
Music: X     x   X     x
Lyric: RAIN on the ROOF of the LAST night BUS</code></pre>
<p>The example has more spoken stresses than major musical accents, which is normal. The useful test is whether the strongest collisions support the sentence. Try a second setting that moves <em>last</em> or <em>bus</em> across the beat. The same words can sound resigned, urgent, or defiant depending on their placement.</p>
<p>Do not force every line into identical syllable counts. A repeated rhythmic motif can tolerate substitutions, held vowels, pickups before the bar, and rests. Consistency gives the listener a frame; controlled differences keep the voice alive.</p>`
      },
      {
        id: 'repair-a-clumsy-line',
        heading: 'Repair a clumsy line without losing its meaning',
        html: String.raw`<p>Suppose the intended line is: “I was waiting in the doorway for an answer.” If it overruns the pocket, do not begin by deleting the most vivid noun. Diagnose the cause:</p>
<ul><li><strong>Too many setup syllables:</strong> “Waiting in the doorway for your answer.”</li><li><strong>Weak stress placement:</strong> “At the door, I wait for your answer.”</li><li><strong>Needed pickup:</strong> place “I was” before beat one.</li><li><strong>Needed rest:</strong> “I wait in the doorway / no answer.”</li><li><strong>Wrong melodic shape:</strong> keep the sentence and change the rhythm.</li></ul>
<p>Each repair says something slightly different. Brevity is not automatically better. Preserve the version whose tone and point of view belong to the song. Then perform the preceding and following lines too; a repair that works alone may damage the larger phrase.</p>
<p>Berklee’s <a href="https://online.berklee.edu/courses/lyric-writing-writing-lyrics-to-music">lyrics-to-music course outline</a> separates language stress, musical stress, melodic sections, and changing note values because each can be adjusted. That is a useful diagnostic model even when you work entirely by ear.</p>`
      },
      {
        id: 'practice-with-constraints',
        heading: 'Use constraints as an ear-training exercise',
        html: String.raw`<p>Loop two bars and record four versions of one sentence:</p>
<ol><li>Keep the words and move the entry point.</li><li>Keep the entry and change only pauses.</li><li>Keep the rhythm and replace low-value words.</li><li>Keep the meaning but reverse the stress contour.</li></ol>
<p>Listen back without the written lyric. Which words remain clear? Where does the phrase seem to end? Which version sounds like ordinary speech, and which creates a useful departure? This exercise teaches more than filling a syllable quota because it isolates the variables that create flow.</p>
<p>Cadence lets you load a beat waveform, set independent A/B points, and keep lyric revisions with recorded takes; those features are documented on the <a href="/cadence/">current product page</a>. Loop a difficult region and compare performances, but keep expectations practical: a visible waveform does not identify good stress for you. Your ear, intention, and repeated delivery remain the test.</p>
<p>When the line works, write down the performed version—not an idealised version that adds syllables back. The lyric sheet should help you repeat the phrasing you chose.</p>
<p>Finally, test the line without the original recording. Tap the pulse and perform it from the notation a day later. If you cannot recover the entry, breath, or held word, add a plain cue. Useful notation preserves a decision; it does not need to resemble formal sheet music.</p>`
      }
    ],
    sources: [
      { title: 'Berklee Riffs: Natural Music in Language', url: 'https://www.berklee.edu/berklee-now/news/berklee-riffs-natural-music-in-language', checked },
      { title: 'Lyric Writing: Writing Lyrics to Music — Berklee Online', url: 'https://online.berklee.edu/courses/lyric-writing-writing-lyrics-to-music', checked },
      { title: 'Building a phonetic dictionary — CMUSphinx', url: 'https://cmusphinx.github.io/wiki/tutorialdict/', checked },
      { title: 'Cadence songwriting workspace', url: 'https://brandnamechanges.com/cadence/', checked }
    ]
  },
  {
    slug: 'organise-voice-memos-into-songs',
    title: 'How to Organise Voice Memos Into Finishable Songs',
    description: 'Turn a crowded voice-memo library into named song ideas, searchable decisions, and a small queue of drafts worth developing.',
    heading: 'Turn scattered recordings into a song pipeline',
    intro: 'The goal is not a perfectly tidy archive. It is a reliable way to find the promising idea, understand what it contains, and choose its next action.',
    category: 'Finish your ideas',
    sections: [
      {
        id: 'capture-with-context',
        heading: 'Give every useful memo enough context',
        html: String.raw`<p>A default timestamp records when you captured an idea, not why it matters. Immediately after the melody or lyric, speak a short note: “slow pre-chorus, try after Paper Crown verse,” or “hook rhythm, needs words.” Ten seconds of context can save ten minutes of guessing later.</p>
<p>Use a compact title pattern when your recorder allows renaming:</p>
<pre><code>working-title — part — tempo/feel — date
Paper Crown — hook — slow swing — 17 Sep</code></pre>
<p>You do not need every field. The valuable pieces are a recognisable song name, the type of idea, and one distinguishing clue. Apple’s current <a href="https://support.apple.com/en-gb/guide/iphone/iph73bfaba07/ios">Voice Memos organisation guide</a> supports favourites and folders on iPhone; use those native tools for a first pass rather than inventing a complex database.</p>
<p>If you cannot rename while the idea is fresh, favourite it. A favourite is not an award; it means “review this.” Clear that temporary flag during a scheduled review so it remains useful.</p>`
      },
      {
        id: 'run-an-inbox-review',
        heading: 'Run a short inbox review',
        html: String.raw`<p>Once or twice a week, process new recordings in one sitting. Listen at normal speed and make one of four decisions:</p>
<ul><li><strong>Attach:</strong> this belongs to an existing song.</li><li><strong>Start:</strong> this deserves a new song draft.</li><li><strong>Incubate:</strong> interesting, but its role is unclear.</li><li><strong>Discard:</strong> duplicate, accidental, or no longer useful.</li></ul>
<p>Do not turn review into production. You are routing ideas, not finishing them. Cap the time spent on any memo; if it demands serious writing, create the song entry and give it a next action.</p>
<p>For an inherited backlog, process the newest twenty recordings first. They are more likely to match your current work and memory. Then search older dates around known writing sessions or performances. Listening to hundreds in chronological order feels thorough but can consume the energy the system is meant to protect.</p>`
      },
      {
        id: 'group-by-song',
        heading: 'Group material by song, not file type',
        html: String.raw`<p>A song may contain a hummed hook, spoken verse, beat reference, harmony stack, and production note. Keeping all “melodies” in one folder and all “lyrics” in another splits the thing you are trying to finish. Use the song as the container, then label each recording by role.</p>
<table><thead><tr><th>Recording</th><th>Role</th><th>Next action</th></tr></thead><tbody><tr><td>Paper Crown 01</td><td>Hook melody</td><td>Choose key and comfortable range</td></tr><tr><td>Paper Crown 02</td><td>Verse lyric sketch</td><td>Transcribe first eight lines</td></tr><tr><td>Paper Crown 03</td><td>Harmony option</td><td>Compare after lead take</td></tr></tbody></table>
<p>Cadence can start from an imported recording or a new take and keep audio, lyrics, beats, and song organisation together. Its <a href="/cadence/voice-memos-to-lyrics/">voice-memo transcription guide</a> describes sharing a memo or audio file into the app, running on-device transcription, and correcting the result while listening. Transcription is a draft, especially with singing, room noise, effects, or unfinished words; never treat it as authoritative.</p>`
      },
      {
        id: 'extract-decisions',
        heading: 'Extract decisions, not just transcripts',
        html: String.raw`<p>A transcript makes words searchable, but the useful output of review is a decision. After listening, write one sentence in each applicable field:</p>
<ul><li><strong>Keep:</strong> “rising three-note hook and the phrase ‘paper crown’.”</li><li><strong>Change:</strong> “verse melody sits too low after the hook.”</li><li><strong>Unknown:</strong> “need to decide whether the second voice is harmony or response.”</li><li><strong>Next:</strong> “record one complete chorus over the beat.”</li></ul>
<p>This prevents the archive from becoming a museum of fragments. The next action should be small enough to begin in one session and specific enough that you know when it is done.</p>
<p>Keep the original audio after transcription. Pitch bends, rhythmic hesitation, breath, and tone may carry the idea more accurately than words on a page. If privacy matters, check the behaviour of each tool rather than assuming all transcription is local. Cadence states that its take transcription runs on-device and that mic takes remain local unless deliberately shared; see the <a href="/privacy">Cadence privacy policy</a> for the current details.</p>`
      },
      {
        id: 'maintain-a-small-queue',
        heading: 'Maintain a small active queue',
        html: String.raw`<p>Choose no more than three active songs: one to draft, one to record, and one waiting on a decision or collaborator. Everything else can remain in the library without competing for today’s attention. When a song moves forward or is deliberately paused, promote another.</p>
<p>Use status labels that describe work rather than worth:</p>
<ol><li><strong>Seed:</strong> one compelling fragment.</li><li><strong>Draft:</strong> enough material to shape sections.</li><li><strong>Demo:</strong> a complete listenable pass exists.</li><li><strong>Handoff:</strong> ready for collaborators or deeper production.</li><li><strong>Archive:</strong> retained, but no next action.</li></ol>
<p>A monthly maintenance pass can remove duplicates, confirm backups, and archive abandoned versions. Be careful when deleting originals: local recordings may not exist elsewhere. Export or back up anything you would regret losing, and verify the copy before removing the source.</p>
<p>If a song stalls, reduce the next action rather than adding more categories. “Finish Paper Crown” is too large; “choose between hook takes A and B” or “transcribe the first verse” can begin immediately. A queue should expose decisions, not turn creative work into administration.</p>
<p>The system succeeds when you can answer three questions quickly: Which song is this? What is valuable in the recording? What happens next? Folder beauty, tag counts, and a zero-inbox streak are secondary.</p>`
      }
    ],
    sources: [
      { title: 'Organize recordings in Voice Memos on iPhone — Apple Support', url: 'https://support.apple.com/en-gb/guide/iphone/iph73bfaba07/ios', checked },
      { title: 'Cadence: turn voice memos into editable lyrics', url: 'https://brandnamechanges.com/cadence/voice-memos-to-lyrics/', checked },
      { title: 'Cadence privacy policy', url: 'https://brandnamechanges.com/privacy', checked }
    ]
  },
  {
    slug: 'lyric-draft-to-recorded-demo',
    title: 'From Lyric Draft to Recorded Demo: A Complete Workflow',
    description: 'Move a lyric from rough page to arranged, recorded, reviewed, and exportable demo without confusing polish with progress.',
    heading: 'Carry one lyric all the way to a useful demo',
    intro: 'A demo is evidence: the song can be heard from beginning to end. Build the minimum complete version first, then improve what the recording reveals.',
    category: 'Finish your ideas',
    sections: [
      {
        id: 'define-the-demo',
        heading: 'Define what this demo must prove',
        html: String.raw`<p>Choose the listener and the decision before recording. A private writing demo may need only a clear lead vocal and beat. A collaborator handoff may need the form, tempo, key, lyric, and references. A production demo may need representative harmonies and dynamics. None automatically requires a release-ready mix.</p>
<p>Write a one-sentence finish line: “A complete verse–pre-chorus–chorus demo that lets the producer judge melody, lyric, form, and energy.” This protects the session from endless polish. List must-haves separately from optional colour:</p>
<table><thead><tr><th>Must prove</th><th>Can wait</th></tr></thead><tbody><tr><td>Complete form</td><td>Final ad-libs</td></tr><tr><td>Intelligible lead</td><td>Detailed automation</td></tr><tr><td>Stable timing reference</td><td>Release mastering</td></tr><tr><td>Export that plays through</td><td>Every harmony idea</td></tr></tbody></table>
<p>This boundary is not an excuse for careless work. It focuses care on the questions the demo is meant to answer.</p>`
      },
      {
        id: 'prepare-the-lyric',
        heading: 'Prepare a performable lyric',
        html: String.raw`<p>Read the lyric as speech, then perform it over the beat. Mark breaths, pickups, held vowels, repeated words, and any line where the written form differs from the sung form. Give every section a clear label and keep alternate lines out of the main reading path.</p>
<p>Check that each section changes something. The verse might reveal events, the pre-chorus sharpen the question, and the chorus state the emotional centre. If two sections do identical work, production layers will not solve the structural repetition.</p>
<p>Rhyme and syllable tools can expose patterns, but the performance decides whether they function. The <a href="/cadence/resources/internal-rhymes-and-rhyme-schemes/">rhyme-scheme guide</a> covers pattern design; the <a href="/cadence/resources/syllables-stress-and-flow/">stress-and-flow guide</a> covers fit against music. Make structural edits before recording many takes, or you will become attached to material the song no longer needs.</p>`
      },
      {
        id: 'arrange-a-complete-pass',
        heading: 'Arrange the smallest complete pass',
        html: String.raw`<p>Lay out the whole form using section names and approximate lengths. A simple map could be: intro 4 bars, verse 16, pre-chorus 8, chorus 8, verse 16, chorus 8, bridge 8, final chorus 16. The numbers are placeholders until the listening proves them.</p>
<p>Record or import a beat or harmonic reference and run the form from start to finish. Notice where energy arrives too early, where a section outstays its lyric, and where the vocalist needs recovery. A transition can be repaired by changing length, dynamics, texture, or the lyric’s point of view; do not automatically add another instrument.</p>
<p>Cadence supports beat waveforms, independent A/B points, timed lyric sections, and a Draft Demo before its multitrack DAW stage. The current <a href="/cadence/">Cadence workflow</a> documents those features. If rebuilding a DAW session from an arrangement, read any replacement warning and preserve manual edits or exports you need; the <a href="/cadence/springtime-showers/">Springtime Showers walkthrough</a> makes that limitation explicit.</p>`
      },
      {
        id: 'record-for-decisions',
        heading: 'Record for decisions, not take count',
        html: String.raw`<p>Make a level check at the loudest intended passage. Digital clipping loses information and is difficult to repair; Audacity’s official <a href="https://manual.audacityteam.org/man/faq_recording_how_to_s.html">recording guidance</a> recommends leaving headroom rather than driving peaks to the limit. The exact control depends on your hardware and app, but the principle is consistent: a clean quiet take can be raised; clipped peaks cannot be restored reliably.</p>
<p>Record one full “map take” even if individual lines are imperfect. It reveals stamina, transitions, and emotional arc. Then record targeted passes with distinct goals:</p>
<ul><li><strong>Clarity pass:</strong> consonants, lyric intelligibility, stable timing.</li><li><strong>Emotion pass:</strong> dynamics, tone, risk, and phrasing.</li><li><strong>Repair pass:</strong> only named weak regions.</li></ul>
<p>Label takes by purpose instead of “take 7.” Comping becomes easier when you remember why a take exists. Stop when later takes repeat choices or lose energy; more files are not automatically more options.</p>`
      },
      {
        id: 'rough-mix-and-review',
        heading: 'Build a rough mix and review it away from the editor',
        html: String.raw`<p>Set the lead vocal against the accompaniment, then add only elements required to communicate the arrangement. Compare vocal processing with the dry signal at the same playback point. Effects that sound exciting in solo can blur words or push the singer behind the beat in context.</p>
<p>Multiple tracks add together and can clip even when each track is safe alone; Audacity’s <a href="https://manual.audacityteam.org/man/mixing.html">mixing documentation</a> explains why the combined level can rise and recommends reducing track gain when the mix overloads. Leave headroom and avoid judging loudness by moving the playback-volume control.</p>
<p>Export a complete listening copy and play it in at least two ordinary situations—for example headphones and a phone speaker—without watching the timeline. Write time-stamped notes, then group them into song, performance, arrangement, and mix. Fix song and performance issues before fine mix details. This is a review method, not a claim that two devices constitute professional translation testing.</p>`
      },
      {
        id: 'export-and-handoff',
        heading: 'Export a version someone else can understand',
        html: String.raw`<p>Name the file with song, version, and date: <code>paper-crown-demo-v03-2026-09-17.wav</code>. Keep a compressed listening copy if convenient and, when the next stage requires it, export aligned stems that begin at the same timeline point. Include the current lyric, tempo, key if known, arrangement notes, and a short list of open decisions.</p>
<p>Cadence’s multitrack workflow includes vocal effects, a live mixer, and demo or aligned-stem export, as described on its product page. Export does not prove the files are complete: reopen the delivered files, confirm their duration and start alignment, and listen to the beginning, one transition, and the ending.</p>
<p>Archive the demo that informed the next decision. Do not overwrite it with every later experiment. A useful demo closes one loop and opens a clearer one: rewrite the second verse, send to a collaborator, replace the guide vocal, or begin final production. If nobody can name the next decision after hearing it, the demo probably needs clearer intent rather than more polish.</p>`
      }
    ],
    sources: [
      { title: 'Cadence songwriting workspace', url: 'https://brandnamechanges.com/cadence/', checked },
      { title: 'Springtime Showers: Arrange and DAW walkthrough', url: 'https://brandnamechanges.com/cadence/springtime-showers/', checked },
      { title: 'Audacity recording guidance', url: 'https://manual.audacityteam.org/man/faq_recording_how_to_s.html', checked },
      { title: 'Mixing Audio Tracks — Audacity Manual', url: 'https://manual.audacityteam.org/man/mixing.html', checked }
    ]
  }
];
