import { cadenceAdvantages } from '../comparisons/cadence-advantages.mjs';
import { mobileComparisons, mobileComparisonPath } from '../../mobile-comparisons.mjs';

const play = 'https://play.google.com/store/apps/details?id=io.cadenceapp.mobile';
const songCage = 'https://songcage.com/mobile/';
const bandLab = 'https://help.bandlab.com/hc/en-us/articles/115002945433-Track-and-Project-Duration-Limits';
const flStudio = 'https://www.image-line.com/fl-studio-mobile';

export const androidComparison = {
  slug: 'best-songwriting-apps-for-android',
  title: 'Best Songwriting Apps for Android, from Lyrics to Demo',
  heading: 'Which Android songwriting app fits your song?',
  description: 'Compare four Android songwriting apps for lyrics, beat loops, voice recording and multitrack demos. See what you can try free and what to test offline.',
  intro: 'Use Cadence if you start with an imported beat and want to write, record and arrange on the same phone. A chord sketch, band recording or instrumental production calls for a different starting point.',
  category: 'Choose your tools',
  sections: [
    {
      id: 'android-shortlist',
      heading: 'Four Android apps, four starting points',
      html: `<p>${mobileComparisons.map(item => `<a href="${mobileComparisonPath(item)}" lang="${item.lang}">${item.name}</a>`).join(' · ')}</p><p>Cadence publishes this guide. The shortlist uses vendor documentation and public listings. The exercise below is for your own device and project.</p>
<p><strong>Pick by the file you already have.</strong> A beat in Downloads and an unfinished lyric point to Cadence. A memo and a chord idea point to Song Cage. For recording layers, try BandLab. To build the beat itself, start with FL Studio Mobile. <a href="#android-free">Check the free options</a> before committing.</p>
<div class="table-scroll" tabindex="0" role="region" aria-label="Compare four Android songwriting apps"><table><thead><tr><th scope="col">App</th><th scope="col">Choose it for</th><th scope="col">Check before you commit</th></tr></thead><tbody>
<tr><th scope="row"><a href="${play}">Cadence</a></th><td>Lyrics, rhyme suggestions, an imported beat loop and takes attached to the song.</td><td>Start with three free notes. Check Pro access for full arrangement and export. Test the exact handoff in <a href="/cadence/guide/#export-audio">the stem-export guide</a>.</td></tr>
<tr><th scope="row"><a href="${songCage}">Song Cage</a></th><td>Offline capture of voice memos, words and chord sketches.</td><td>The first three ideas are free. Its Android app is the capture stage. The vendor documents arrangement and export in the web or desktop editor.</td></tr>
<tr><th scope="row"><a href="${bandLab}">BandLab</a></th><td>Building a multitrack demo or recording layers with the Studio.</td><td>BandLab documents 16 tracks per project, or 32 with Membership, with a 15-minute limit in both cases.</td></tr>
<tr><th scope="row"><a href="${flStudio}">FL Studio Mobile</a></th><td>Making a beat or building an instrumental with a piano roll, instruments and a mixer.</td><td>Check the local store offer and whether the export you need opens in your desktop setup.</td></tr>
</tbody></table></div>`,
    },
    cadenceAdvantages,
    {
      id: 'same-eight-bars',
      heading: 'A ten-minute test with the same eight bars',
      html: `<p>Bring one instrumental you have permission to use and four lines of your own. Use the same headphones and files in each candidate.</p>
<ol><li><strong>Import and loop.</strong> Set a four-bar loop. Rewrite the last line while listening, then see how quickly you can get back to the loop start.</li><li><strong>Keep two takes.</strong> Try a late landing and an on-beat landing. Close the project, reopen it and find both recordings.</li><li><strong>Reopen offline.</strong> Once your project is saved, turn on airplane mode and reopen it. Check the lyric, beat and recordings separately.</li><li><strong>Test your output.</strong> If you send a demo to a collaborator, play the exported audio. If you send stems, import them at the same start time in your DAW and check alignment.</li></ol>
<p>Write down where you had to switch apps, find an original file again or upgrade. That gives you a comparison of the workflow you actually need.</p>`,
    },
    {
      id: 'android-demo',
      heading: 'See the Cadence workflow before installing',
      html: `<p>Follow the <a href="/cadence/type-beat-walkthrough/">beat-first video and transcript</a> to see the loop and writing workflow. For controls and menu locations, use the <a href="/cadence/guide/#beat-loop">step-by-step guide</a>. Start with the same four-bar passage in the <a href="/cadence/songwriting-app-android/">Cadence Android workspace</a>.</p>`,
    },
    {
      id: 'android-free',
      heading: 'Check which free workflow gets you far enough',
      html: `<p>Song Cage makes sense if the immediate job is offline capture. BandLab is worth testing if the next step is recording several layers. Cadence is designed around an existing beat, the lyric and its takes, with the full Draft-to-DAW workflow in Pro. Compare <a href="/cadence/resources/choosing-a-songwriting-app/#free-songwriting-apps">free-plan limits across platforms</a> or see the <a href="/cadence/resources/best-songwriting-apps-for-iphone/">iPhone and iPad comparison</a>.</p>`,
    },
  ],
  sources: [
    ['Cadence for Android · Google Play', play],
    ['Song Cage Mobile · Song Cage', songCage],
    ['Track and project limits · BandLab', bandLab],
    ['FL Studio Mobile · Image-Line', flStudio],
  ].map(([title, url]) => ({title, url, checked: '2026-11-23'})),
};
