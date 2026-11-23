import { cadenceAdvantages } from '../comparisons/cadence-advantages.mjs';
import { mobileComparisons, mobileComparisonPath } from '../../mobile-comparisons.mjs';
const checked = '2026-11-23';
const poetry = 'https://www.poetryfoundation.org/education/glossary/Rhyme';
const vowels = 'https://www.poetryfoundation.org/education/glossary/assonance';
const guide = slug => '/cadence/resources/' + slug + '/';
const types = guide('types-of-rhyme');
const phrase = guide('multi-word-rhymes');
const sound = guide('assonance-vs-consonance');
const source = (title, url) => ({ title, url, checked });
const section = (id, heading, html) => ({ id, heading, html: html.trim() });

export const newGuides = [
  {
    slug: 'types-of-rhyme',
    title: 'Types of Rhyme in Songs and Rap, With Examples',
    heading: 'Types of rhyme you can hear in a lyric',
    description: 'Hear the difference between perfect, slant, eye, internal and phrase rhymes. Compare original examples and choose a rhyme that fits your lyric.',
    intro: 'Light and night share a sound. Love and move share a spelling. Where you put the match and where you land the stress change what a listener hears.',
    category: 'Improve your writing',
    sections: [
      section('rhyme-chart', 'Compare rhyme types by sound and placement', `
<p>The <a href="${poetry}">Poetry Foundation rhyme glossary</a> distinguishes the sound relationship, the position in the line and the stress pattern. A rhyme can belong to more than one of these groups.</p>
<div class="table-scroll" tabindex="0" role="region" aria-label="Types of rhyme and examples"><table><thead><tr><th scope="col">Type</th><th scope="col">Example</th><th scope="col">Listen for</th></tr></thead><tbody>
<tr><th scope="row">Perfect</th><td>light / night</td><td>The stressed vowel and the sounds after it match.</td></tr>
<tr><th scope="row">Slant or near</th><td>shape / keep</td><td>The final P matches while the stressed vowels differ.</td></tr>
<tr><th scope="row">Eye</th><td>love / move</td><td>The spelling looks alike, but the vowel sounds differ.</td></tr>
<tr><th scope="row">Internal</th><td>“The light hit the night bus.”</td><td>A match occurs inside the line.</td></tr>
<tr><th scope="row">End</th><td>“I dimmed the light / and waited for the night.”</td><td>The matching words sit at the ends of lines.</td></tr>
<tr><th scope="row">Double or feminine</th><td>timing / climbing</td><td>A stressed rhyme followed by an unstressed syllable.</td></tr>
<tr><th scope="row">Multi-word</th><td>night train / light rain</td><td>The sound pattern spans more than one word.</td></tr>
</tbody></table></div>`),
      section('write-and-revise', 'Change one landing and hear what changes', `
<blockquote><p>I saw your coat by the landing light<br>Still on the hook at the edge of night</p></blockquote>
<p>Read that version, then replace the second line with “Still on the hook, just out of sight.” The tight sound match stays. The image moves from time of day to something the singer almost misses. For a looser ending, try “Still on the hook where the hallway hides.” Put each version over the same two bars. Listen for which ending makes the image clearest and where the last stressed vowel lands.</p>
<p>Try another ending in the <a href="/cadence/rhyme-finder/">English rhyme finder</a>, then judge it in your own accent.</p>`),
      section('stress-and-placement', 'Choose placement before adding more rhymes', `
<p>Try “The light hit the night bus” as one line, then split it into “I left the light / and caught the bus that night.” The sound pair stays the same. In the first version the listener gets a quick return mid-line. In the second they wait for the next line ending. Use internal matches to add movement and choose end matches where you want the listener to remember the landing.</p>
<p>A single stressed ending like “light / night” releases on its last syllable. “Timing / climbing” leaves an unstressed syllable after the stressed match. Where the melody needs a held vowel and a short release, that second shape can fit more naturally. Test the words at the same tempo before choosing.</p>`),
      section('go-deeper', 'Choose what to practise next', `
<ul><li><a href="${phrase}">Multi-word rhymes</a> for phrases that span word boundaries.</li><li><a href="${sound}">Assonance and consonance</a> for sound patterns inside a line.</li><li><a href="${guide('perfect-slant-multisyllabic-rhymes')}">Perfect, slant and multisyllabic rhymes</a> for matching stress across syllables.</li><li><a href="${guide('internal-rhymes-and-rhyme-schemes')}">Internal rhymes and rhyme schemes</a> for building patterns across a verse.</li></ul>`),
    ],
    sources: [source('Rhyme glossary · Poetry Foundation', poetry)],
  },
  {
    slug: 'multi-word-rhymes',
    title: 'Multi-Word Rhymes: Phrase Examples for Rap and Lyrics',
    heading: 'How to write multi-word rhymes',
    description: 'Build phrase rhymes across word boundaries with stressed-syllable examples, a two-bar revision exercise and a guide to checking your delivery.',
    intro: 'In “night train” and “light rain,” both stressed vowels repeat. The words make different images, and the performance ties the two phrases together.',
    category: 'Improve your writing',
    sections: [
      section('phrases-and-stress', 'Follow the phrase across the word boundary', `
<p>A multi-word rhyme uses more than one word on at least one side. Multisyllabic describes how many syllables participate. “Timing / climbing” has two matching syllables without needing a phrase. “Night train / light rain” spreads the match across words. Start with the stressed sounds, as described in the <a href="${poetry}">Poetry Foundation rhyme glossary</a>, and listen through the entire ending.</p>
<ul><li><strong>Cold air / gold hair</strong> repeats the OH sound and the ending “air,” with a different onset on the last word. It is useful as an ear exercise even if you would never use both phrases in one song.</li><li><strong>Last call / cracked wall</strong> is looser. The first vowel and the final “all” connect, while the consonants between them differ. The first vowel can also vary by accent.</li><li><strong>Back seat / track meet</strong> aligns two stressed vowels and differs at the word onsets.</li></ul>`),
      section('two-bar-exercise', 'Rewrite two bars without losing the scene', `
<blockquote><p>I caught the last train with your keys in my hand<br>You said you’d call when you knew where you’d land</p></blockquote>
<p>Move the first image to the end and see if the second line can answer it:</p>
<blockquote><p>Your keys in my coat on the last train<br>Two stops from home in the fast lane</p></blockquote>
<p>Stress LAST and TRAIN, then FAST and LANE. The second vowels match closely. Now ask whether “fast lane” belongs in a train scene. Return to a single-word ending if the phrase forces an image out of the song. Record each version over the same loop. The rhyme is doing its job when the listener can still picture what happened.</p>`),
      section('phrase-check', 'Check whether the rhyme survives the performance', `
<p>Tap once on each intended stress before you put the words over the beat. If a connecting word lands louder than the word you meant to stress, move the phrase earlier or leave more room before it. A pair that sounds close when read slowly can pull apart once contracted or sung. Compare the same two bars with a single-word rhyme and keep the version whose rhythm is easiest to repeat.</p>`),
      section('find-candidates', 'Find candidates for both stressed sounds', `
<p>Start with the last stressed word, shortlist endings, then work backwards to the earlier stress. Use the <a href="/cadence/rhyme-finder/">English rhyme finder</a> for word candidates and its limited phrase bank, or open <a href="/cadence/guide/#rhyme-inspector">Multi-word suggestions in Cadence’s Rhyme Inspector</a>. For sound and placement terminology, see the <a href="${types}">types of rhyme chart</a>.</p>`),
    ],
    sources: [source('Rhyme glossary · Poetry Foundation', poetry)],
  },
  {
    slug: 'assonance-vs-consonance',
    title: 'Assonance vs Consonance in Songs: Examples and Exercises',
    heading: 'Hear assonance and consonance in your lyrics',
    description: 'Compare repeated vowels and consonants with original lyric examples. Use sound repetition inside a bar and check it against a beat.',
    intro: '“Wide white lights” repeats an eye vowel. “A stack of cracked clocks” repeats a K sound. You can carry a sound through a line even when the line endings do something else.',
    category: 'Improve your writing',
    sections: [
      section('hear-the-difference', 'Repeat a vowel or repeat a consonant', `
<p><a href="${vowels}">Assonance</a> is repetition of vowel sounds. In “slow boats roll home,” the stressed OH sound connects the words while the endings change. Consonance repeats consonant sounds, as in “a quick click in the lock,” where K keeps coming back. If the stressed vowel and the rest of the ending match closely, the same passage may also contain a <a href="${types}#rhyme-chart">perfect or near rhyme</a>.</p>`),
      section('compare-on-beat', 'Read the same idea three ways', `
<ol><li><strong>Plain:</strong> “I took the road back to the house.”</li><li><strong>Vowel-led:</strong> “I drove home slow through the smoke.”</li><li><strong>Consonant-led:</strong> “I cut back quick before the clock struck.”</li></ol>
<p>Record all three against the same loop. In the vowel-led line, try stretching “home.” In the consonant-led line, let the K sounds fall on the beat, then move one between beats. If the words start to tangle, remove one repeated consonant and compare. These are options for directing attention. You can use both patterns or leave a line plain so a later repeat stands out.</p>`),
      section('where-the-sound-repeats', 'Try sound repetition without repeating the ending', `
<p>“Slow boats roll home / I watched them from the pier” keeps the OH sound in the first line and leaves the second ending open. “A quick click in the lock / then the whole room went still” uses a cluster of K sounds before the pause. Leave the line endings alone and move one repeated sound closer to the action. Listen for whether the change directs attention to the image or merely makes the line busier.</p>`),
      section('check-your-accent', 'Check the recording in your own accent', `
<p>A written match can disappear at performance speed. Mark the stressed syllables, record twice and listen with the lyric hidden. Try the <a href="/cadence/rhyme-finder/">English rhyme finder</a> for candidates or follow the lesson on <a href="${guide('syllables-stress-and-flow')}">syllables, stress and flow</a> to revise the delivery.</p>`),
    ],
    sources: [source('Assonance glossary · Poetry Foundation', vowels)],
  },
];

const cadence = 'https://apps.apple.com/gb/app/cadence-lyrics-rhymes/id6778554520';
const songRight = 'https://apps.apple.com/us/app/songright-songwriting-studio/id6760428538';
const demo = 'https://apps.apple.com/us/app/demo-songwriting-studio/id1563264178';
const songWriter = 'https://apps.apple.com/us/app/song-writer-write-note-lyrics/id422227894';
const garageBand = 'https://support.apple.com/guide/garageband-iphone/welcome/ios';
newGuides.push({
  slug: 'best-songwriting-apps-for-iphone',
  title: 'Best Songwriting Apps for iPhone and iPad, by Workflow',
  heading: 'Choose a songwriting app for your iPhone workflow',
  description: 'Compare Cadence, SongRight, Demo, Song-Writer and GarageBand for writing lyrics, looping beats, charting chords, recording and exporting on iOS.',
  intro: 'Choose based on how your songs begin. If you write lyrics to an imported beat and want to keep your takes with the draft, start with Cadence. If you start with chords, instruments or charts, compare the alternatives below.',
  category: 'Choose your tools',
  sections: [
    cadenceAdvantages,
    section('iphone-comparison', 'Compare five iPhone songwriting apps', `
<p>${mobileComparisons.map(item => `<a href="${mobileComparisonPath(item)}" lang="${item.lang}">${item.name}</a>`).join(' · ')}</p><p>Cadence publishes this guide. The comparison uses public product documentation and store listings. Test the features you need on your device before committing to a project or plan.</p>
<div class="table-scroll" tabindex="0" role="region" aria-label="Compare iOS songwriting apps"><table><thead><tr><th scope="col">App</th><th scope="col">Start here if you need</th><th scope="col">What to try on your phone</th></tr></thead><tbody>
<tr><th scope="row"><a href="${cadence}">Cadence</a></th><td>Lyrics and rhymes beside an imported beat, with recorded takes and an arrangement path</td><td>Loop four bars, write over them, save two takes and compare them. Then inspect the <a href="/cadence/guide/#export-audio">mix and stems workflow</a>.</td></tr>
<tr><th scope="row"><a href="${songRight}">SongRight</a></th><td>Song notes and mobile demo recording</td><td>For rhymes, its listing documents English and Spanish. <a href="/cadence/resources/best-songwriting-app-ios-android/#rhyme-language-coverage">Cadence supports both plus 19 more options</a>. Compare how each app takes a recorded idea through to export.</td></tr>
<tr><th scope="row"><a href="${demo}">Demo</a></th><td>Playable chord progressions and ideas you can build into an audio demo</td><td>Loop a progression, add a voice part and check which mix, MIDI or chord-sheet export you need.</td></tr>
<tr><th scope="row"><a href="${songWriter}">Song-Writer</a></th><td>Chords above lyrics, section recordings and Nashville numbers</td><td>Chart a verse and check how the chord picker, diagrams and printed chart fit your session.</td></tr>
<tr><th scope="row"><a href="${garageBand}">GarageBand</a></th><td>Touch Instruments, audio recording and track-based production</td><td>Build an instrumental and record a vocal. Check how you want to keep the lyric within reach.</td></tr>
</tbody></table></div><p>SongRight and Song-Writer are separate apps. Check each storefront for device compatibility, current pricing and export access.</p>`),
    section('write-on-iphone', 'How to write a song on iPhone', `
<ol><li><strong>Bring one idea.</strong> Start a draft with four lines, a Voice Memo or an instrumental you have permission to use.</li><li><strong>Loop the section.</strong> In Cadence, load the beat and set two <a href="/cadence/guide/#beat-loop">loop points</a>. Try the line ending out loud and adjust it before recording.</li><li><strong>Keep two takes.</strong> Record a straight delivery and one with a different rhythmic landing. Listen back and save the strongest line with its take.</li><li><strong>Check the handoff.</strong> If you finish in another DAW, check whether you need a single demo or aligned stems. Open a test export before moving your main project.</li></ol>
<p>See the <a href="/cadence/type-beat-walkthrough/">beat-first walkthrough with video and transcript</a>, or <a href="${cadence}">view Cadence on the App Store</a>.</p>`),
    section('same-session', 'Compare the apps with one ten-minute session', `
<p>Use the same four lines, spoken memo and instrumental in each app. Time how long it takes to have the words and the recording together. Record two deliveries, then reopen the project and find both versions. If your phone is often offline, save the project first and repeat the reopen test in airplane mode.</p>
<p>Finish by testing your actual handoff: a producer may need aligned stems, while a bandmate might need a chord chart. Write down any extra app or plan you needed. Android users can run the same exercise with our <a href="/cadence/resources/best-songwriting-apps-for-android/">Android songwriting app comparison</a>.</p>`),
    section('what-to-test-on-ipad', 'Check the same session on iPad', `
<p>If you write on iPhone and finish on iPad, use the same small project on both devices before relying on that workflow. Check whether you can view the words beside the audio, find an earlier take, and open a test export. Test project and audio transfer separately. A lyric appearing on a second device does not prove that the recordings arrived with it. If you mostly finish at a desk, verify the exported file in the DAW you use there.</p>`),
    section('free-ios-options', 'What can you do for free?', `
<p>GarageBand is Apple’s free recording and instrument workspace. Cadence currently starts with three free notes. Pro unlocks unlimited new work and the full Draft-to-DAW workflow, including exports. To decide what you can finish without paying, see the <a href="${guide('choosing-a-songwriting-app')}#free-songwriting-apps">free songwriting app and plan comparison</a>. Check the current in-app offer before paying.</p>`),
  ],
  sources: [
    source('Cadence · App Store', cadence), source('SongRight · App Store', songRight),
    source('Demo · App Store', demo), source('Song-Writer · App Store', songWriter),
    source('GarageBand for iPhone · Apple user guide', garageBand),
  ],
});
