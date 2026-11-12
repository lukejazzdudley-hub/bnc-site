// Check individual offers without implying that the entire 11-app guide was retested.
export const freeOptions = {
  id: 'free-songwriting-apps',
  heading: 'Free songwriting apps: what can you actually finish?',
  html: `<p><strong>For free recording and production, compare BandLab and GarageBand. For free score writing, try MuseScore Studio.</strong> Cadence and Song Cage offer a limited free start. Choose around the work you need to finish: writing a verse, recording a demo and composing a score are different jobs.</p>
<p>Offers below were checked against the linked product information on <strong>12 November 2026</strong>. Free software, a limited free plan and a time-limited trial are separated here. Availability and compatibility can vary by device and storefront. We make Cadence; these are documented offers, not independent test scores.</p>
<div class="table-scroll" tabindex="0" role="region" aria-label="Free songwriting apps and plan limits"><table><caption>Five options: free access, platform and the next limit</caption><thead><tr><th scope="col">App / platform</th><th scope="col">Free access</th><th scope="col">Choose it for</th><th scope="col">Check before starting</th></tr></thead><tbody>
<tr><th scope="row"><a href="https://help.bandlab.com/hc/en-us/articles/115002945433-Track-and-Project-Duration-Limits">BandLab</a><br>Web, Android, iPhone</th><td>Free Studio projects: up to 16 tracks and 15 minutes.</td><td>Recording and producing a multitrack song.</td><td>Optional Membership increases tracks to 32; the 15-minute limit remains. Other paid extras are separate from the free studio.</td></tr>
<tr><th scope="row"><a href="https://apps.apple.com/us/app/garageband/id408709785">GarageBand</a><br>iPhone, iPad</th><td>Free Apple app; recording supports up to 32 tracks.</td><td>Instruments, loops and recorded audio on compatible Apple hardware.</td><td>This mobile listing is for iPhone and iPad. Check device compatibility; do not choose it for an Android phone.</td></tr>
<tr><th scope="row"><a href="https://musescore.org/en">MuseScore Studio</a><br><a href="https://musescore.org/en/download">Windows, Mac, Linux</a></th><td>Free, open-source notation editor.</td><td>Composing a score and exchanging MusicXML or MIDI.</td><td>The Studio editor is distinct from score-sharing subscriptions. It serves notation rather than a lyric-and-vocal workspace.</td></tr>
<tr><th scope="row"><a href="/cadence/songwriting-app/">Cadence</a><br>Android, iPhone, iPad</th><td>Start with three free notes.</td><td>Lyrics and rhyme exploration beside beats and recorded ideas.</td><td>Pro unlocks unlimited new work and the complete Draft-to-DAW workflow, including arrangement and export. Check the current in-app offer.</td></tr>
<tr><th scope="row"><a href="https://songcage.com/shop/">Song Cage</a><br>Phone, browser, iPad; desktop trial</th><td>Three phone ideas; one song in the browser or on iPad.</td><td>Trying a chord, lyric and melody composition workflow.</td><td>Full access is a paid unlock. Its 14-day desktop trial is different from the limited free phone/browser offer.</td></tr>
</tbody></table></div>
<h3>Which free songwriting app should I use on my device?</h3>
<p><strong>Android:</strong> start with BandLab for a free recording studio, or try Cadence’s three-note start for writing lyrics to beats. <a href="/cadence/songwriting-app-android/">Compare the Android artist workflow</a> before committing to a plan.</p>
<p><strong>iPhone or iPad:</strong> compare GarageBand for instruments and production with Cadence for a connected lyric, beat and vocal workspace. Cadence’s full arrangement/export workflow requires Pro today.</p>
<p><strong>Computer or browser:</strong> compare BandLab for a cloud studio, MuseScore Studio for desktop notation, and Song Cage’s one-song browser offer for composition. They solve different parts of songwriting.</p>
<h3>Can I write lyrics online for free without installing an app?</h3>
<p>Use our free browser rhyme dictionaries in <a href="/cadence/rhyme-finder/">English</a>, <a href="/cadence/es/diccionario-rimas/" lang="es">Spanish</a> or <a href="/cadence/fr/dictionnaire-rimes/" lang="fr">French</a>. No account is needed. They help you find sound matches; you write the lyrics. These are separate browser tools, not the complete Cadence app or its full rhyme engine.</p>
<h3>Is Cadence completely free?</h3>
<p>No. The current app starts with three free notes; Pro unlocks unlimited new work and the complete Draft-to-DAW workflow. Paying only for cloud storage and use across multiple devices is an <strong>upcoming</strong> pricing direction, not today’s offer. No release date is promised here.</p>
<p>Before paying for any app, make one disposable song fragment and test the export you actually need. A free download alone does not tell you whether you can finish or hand off a song. <a href="#run-a-one-song-trial">Use the five-step one-song trial</a>, or <a href="#compare-apps">compare all 11 apps by workflow</a>.</p>`,
};

export const freeSources = [
  ['BandLab free and Membership track limits', 'https://help.bandlab.com/hc/en-us/articles/115002945433-Track-and-Project-Duration-Limits'],
  ['GarageBand mobile App Store listing', 'https://apps.apple.com/us/app/garageband/id408709785'],
  ['MuseScore Studio free editor', 'https://musescore.org/en'],
  ['MuseScore Studio supported desktop downloads', 'https://musescore.org/en/download'],
  ['Song Cage free access and paid licences', 'https://songcage.com/shop/'],
].map(([title, url]) => ({title, url, checked: '2026-11-12'}));
