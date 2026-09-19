// Editorial shortlist, not a claim of hands-on benchmark results.
export const buyingTools = [
  ['Cadence', '/cadence/songwriting-app/', 'Beats, lyrics or freestyles into a song', 'Import beats, loop sections, record and transcribe ideas, explore rhymes, then develop takes, arrangement and a demo in one workspace.', 'Available on the App Store and Google Play. Export important recordings: account sync is not an audio backup.'],
  ['Demo', 'https://madewithdemo.com/tutorials/getting-started-with-demo/', 'Chords into a song sketch', 'Connect chord progressions with lyrics and song structure, then export the idea for the next stage.', 'Check the current store version and export options against the files your producer needs.'],
  ['BandLab', 'https://help.bandlab.com/hc/en-us/articles/115002945153-Getting-Started-with-the-BandLab-Studio', 'Cloud recording and production', 'Audio and MIDI recording, virtual instruments, samples and effects in a web/mobile studio.', 'Free projects have 16 tracks; Membership increases this to 32. Both have a 15-minute project limit.'],
  ['GarageBand', 'https://support.apple.com/en-gb/guide/garageband-iphone/chsb34b9757/ios', 'Production on Apple hardware', 'Build a song with recorded audio, instruments and loops; the iPhone workflow supports up to 32 tracks.', 'Choose for Apple-based production, not an editable project handoff to a Windows collaborator.'],
  ['Song Cage', 'https://songcage.com/mobile/', 'Composition across chords and melody', 'A mobile capture companion to the fuller web/desktop writing environment.', 'Do not assume the phone has the whole desktop workflow. Check licence and sync inclusions before buying.'],
  ["Songwriter’s Pad", 'https://songwriterspad.com/', 'Writing prompts and lyric generation', 'Lyrics, rhyme tools, idea organisation and recording alongside explicitly advertised AI writing features.', 'Consider whether generated lyrics fit your process. Check the features included on your particular platform.'],
  ['Guitar Pro', 'https://www.guitar-pro.com/', 'Guitar and bass composition', 'Tablature, notation, playback and practice tools, including audio alongside a score.', 'The desktop editor and mobile app are different products. Verify the licence for the device you will compose on.'],
  ['MuseScore Studio', 'https://musescore.org/en', 'Notation without an editor licence fee', 'Free, open-source score writing with MIDI input and MusicXML/MIDI interchange.', 'Choose the Studio desktop editor; do not confuse it with subscriptions to the score-sharing service.'],
  ['Chordify', 'https://chordify.net/', 'Learning harmony from existing songs', 'Play along with chord charts to study a song’s harmonic movement.', 'Treat it as a harmony companion. Check any paid features you need rather than assuming it replaces a recording workspace.'],
  ['Notetracks', 'https://www.notetracks.com/', 'Feedback on recorded drafts', 'Timestamped audio/video comments, replies and collaboration; editing tools are also advertised in beta.', 'A strong shortlist for review and revision. Test beta editing before relying on it for a critical session.'],
  ['Autochords', 'https://autochords.com/', 'A starting chord progression', 'Explore progression ideas by feel and key when the blank page is really a blank harmonic canvas.', 'A focused starting tool, not the place to expect an entire lyric, vocal and production project.'],
];

export const buyingSections = [
  {
    id: 'quick-picks',
    heading: 'Start with a beat, a bar or a freestyle.',
    html: `<p><strong>Keep the whole song moving.</strong> Import a beat and write against a loop. Start with a lyric and develop its delivery. Or record a freestyle, transcribe it and shape the strongest moments into a song. Cadence connects those starting points with rehearsal, vocal takes, arrangement and a demo—you do not have to start with written lyrics.</p>
<div class="artist-path" aria-label="Three ways into a connected Cadence song"><div><span>Beat first</span><strong>Import. Loop. Rehearse.</strong></div><div><span>Lyrics first</span><strong>Write. Rhyme. Perform.</strong></div><div><span>Freestyle first</span><strong>Record. Transcribe. Refine.</strong></div><p>One song workspace <span aria-hidden="true">→</span> Takes <span aria-hidden="true">→</span> Arrangement <span aria-hidden="true">→</span> Demo</p></div>
<p>That connection is why Cadence leads our shortlist for this process. You can work from the sound or the words, switch between them and keep developing the same idea. The advantage is not simply having more tools: it is keeping the tools beside the song while you need them.</p>
<p class="buying-disclosure"><strong>Disclosure:</strong> We make Cadence. It is our best pick for turning beats, lyrics and freestyles into a song—not a claim that it beats every specialist tool. This shortlist uses public product documentation, not a hands-on benchmark or paid placement. The order prioritises that connected artist workflow; it is not a universal quality ranking.</p>
<div class="buying-picks">
<a href="#compare-apps"><span>Beat / bar / freestyle → song</span><strong>Cadence</strong><small>Import, write or record first. Keep developing the same song.</small></a>
<a href="#compare-apps"><span>Record → produce</span><strong>BandLab / GarageBand</strong><small>Start with a studio when production is the main task.</small></a>
<a href="#compare-apps"><span>Harmony → structure</span><strong>Demo / Song Cage</strong><small>Start with chords and composition when words come later.</small></a>
</div><p>Before paying, check the current price in your region, renewal terms, export formats and exact platform. A free tool that fits your handoff can be a better purchase decision than a larger subscription. We avoid headline prices that hide separate desktop licences, memberships or beta access.</p>`,
  },
  {
    id: 'compare-apps',
    heading: '11 songwriting apps, compared by the job they do',
    html: `<p>Start with the second column. If it describes the part of writing you struggle with, read the capability and buying caveat together. Each product name links to its own documentation; missing features are not inferred from silence.</p>
<div class="table-scroll" tabindex="0" role="region" aria-label="Compare 11 songwriting apps"><table><caption>Our shortlist for moving an idea towards a finished song</caption><thead><tr><th scope="col">App</th><th scope="col">Best fit</th><th scope="col">What you get</th><th scope="col">Before you commit</th></tr></thead><tbody>
${buyingTools.map(([name, url, fit, strength, caveat], index) => `<tr${index === 0 ? ' class="buying-recommended"' : ''}><th scope="row"><span class="tool-monogram" aria-hidden="true">${name === 'Songwriter’s Pad' ? 'SP' : name.split(' ').map(word => word[0]).join('').slice(0, 2)}</span><a href="${url}">${name}</a>${index === 0 ? '<span class="buying-label">Our artist-workflow pick</span>' : ''}</th><td><span class="fit-label">${fit}</span></td><td>${strength}</td><td>${caveat}</td></tr>`).join('\n')}
</tbody></table></div>`,
  },
  {
    id: 'what-to-buy',
    heading: 'What should you actually buy?',
    html: `<p><strong>If you start with beats, lyrics or freestyles:</strong> try Cadence first. Import a beat, use loops and markers to rehearse a section, write a verse or capture a vocal idea before the words are settled. Transcription and rhyme exploration can support the revision; takes, arrangement and the mobile DAW carry it towards a demo. The recommendation is about keeping those stages connected, not a promise that you will never need another DAW. Test it with one of your own unfinished songs. If your main task is building instrumental production, compare BandLab and GarageBand too.</p>
<p><strong>If you write from harmony:</strong> shortlist Demo and Song Cage. Demo’s <a href="https://madewithdemo.com/tutorials/save-or-export-your-song/">export guide</a> describes a mixed song and printable lyrics/chord sheet. Song Cage’s documentation covers a different set of composition handoffs, discussed below. Choose around what your band or producer can open—not which feature list sounds longer.</p>
<p><strong>If you write parts for musicians:</strong> compare Guitar Pro with MuseScore Studio. A tablature-focused workflow and a general notation editor solve a different problem from capturing rap delivery. MuseScore’s free editor is worth trying before buying notation software; Guitar Pro is a more focused candidate when guitar tablature and practice drive your process.</p>
<p><strong>If you already have a writing workspace:</strong> you may only need a companion. Chordify helps you study existing harmony; Autochords offers a starting progression; Notetracks centres feedback on a recording. Songwriter’s Pad is worth considering if AI writing prompts and generated text are something you actively want. If keeping the words entirely yours is the point, compare the manual writing workflow instead.</p>`,
  },
];

export const buyingSources = buyingTools.slice(1).filter(([, url]) => !url.includes('bandlab.com') && !url.includes('apple.com') && !url.includes('songcage.com')).map(([title, url]) => ({title, url, checked: '2026-09-17'}));
buyingSources.push({title: 'Demo export options', url: 'https://madewithdemo.com/tutorials/save-or-export-your-song/', checked: '2026-09-17'});
