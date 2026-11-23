const cadence = 'https://brandnamechanges.com/cadence/guide/';
const berklee = 'https://assets.online.berklee.edu/handbooks/berklee-online-songwriting-handbook.pdf';
const source = (title, url) => ({title, url, checked: '2026-11-23'});
const section = (id, heading, html) => ({id, heading, html: html.trim()});

export const adjacentWritingGuides = [
  {
    slug: 'organize-song-drafts',
    title: 'Song Draft Organizer: Lyrics, Beats and Voice Memos',
    heading: 'Organize your song drafts so you can finish one',
    description: 'Unify lyric drafts, beat files and voice memos in a song draft organizer. Copy a one-song template and sort unfinished songs by their next action.',
    intro: 'Start by making one unfinished song easy to reopen. Put its latest lyric beside the original recording and leave one specific instruction for your next session.',
    category: 'Finish your ideas',
    sections: [
      section('one-folder-per-song', 'Give each unfinished song one home', `
<p>Use the same working title for your notes, recordings and beat. When two ideas share a beat, give them different song names and preserve the original instrumental. Choose the latest lyric as the version to revise, then move older copies into a dated folder. Keep the original voice memo even if you replace its transcript.</p>
<p>If your starting point is a recording, follow the <a href="/cadence/voice-memos-to-lyrics/">voice-memo-to-lyrics workflow</a>. Keep the original file and your corrected lyric beside each other so you can check words against your delivery.</p>`),
      section('song-draft-template', 'Copy this song draft organizer template', `
<pre><code>Working title:
Stage: idea / lyric draft / recorded demo / ready to share
Latest lyric:
Beat or original recording:
Keep these takes:
Rights or collaborator notes:
Next action:</code></pre>
<p><strong>Example:</strong> Night Bus is a lyric draft. The verse works over the instrumental. Take 2 has the best delivery. The next action is “record two versions of the first chorus line over bars 9–12.” Write an action you can begin as soon as the project opens.</p>`),
      section('sort-by-next-step', 'Sort unfinished songs by next action', `
<p>Set a ten-minute timer and triage five projects. Mark the ones that only need a lyric edit, those waiting for a take, and those ready to share. Pick a single task that fits your available time. If a song stalls because its beat or permission is missing, leave a note so you can resolve the blocker instead of rewriting a working verse.</p>
<p>Keep a preferred take and one useful alternate. For major lyric changes, save a dated copy. Before sharing, listen to the exported demo itself and confirm it matches the lyric you intend to send.</p>`),
      section('app-or-folder', 'Choose a folder or an app with audio attached', `
<p>A folder and text file work well if you mostly need to find things again. An app helps if you repeatedly need to play a beat while editing lyrics or compare takes from the same draft. In Cadence, <a href="${cadence}#start">start one song in the Library</a>, then <a href="/cadence/guide/#import-audio">bring in your audio</a>. For the handoff, check what <a href="/cadence/guide/#settings-backup">lyric export and recording backups</a> you need. Keep copies of your important audio outside the project.</p>`),
    ],
    sources: [source('Cadence feature walkthrough', cadence + '#start')],
  },
  {
    slug: 'how-to-write-a-song-hook',
    title: 'How to Write a Song Hook That Fits Your Beat',
    heading: 'How to write a hook for a song or rap verse',
    description: 'Turn one idea into a lyric hook. Work through an original four-bar example and test timing, repetition and melody against the beat.',
    intro: 'A hook is the part that catches the ear. It can be the chorus’s strongest line, a melody, or a repeated rhythm. For a lyric hook, start with one thought you want the listener to carry away.',
    category: 'Improve your writing',
    sections: [
      section('find-the-thought', 'Find the thought worth repeating', `
<p>Write one sentence of plain speech. For example, “I left the light on because I still thought you would come back.” Shorten it to a line that says enough on its own. “Leave the light on” has a simple stress pattern and leaves the verse room to explain why. The <a href="${berklee}">Berklee Online Songwriting Handbook</a> includes a title-first approach to finding a chorus and melody.</p>`),
      section('four-bar-hook', 'Build four bars from one line', `
<blockquote><p>Leave the light on<br>The last bus is gone<br>Leave the light on<br>I can’t turn it off</p></blockquote>
<p>Try one lyric line per bar on a loop. In the first take, begin “Leave” on beat one. In the second, put “Leave the” just before the bar and land “light” on beat one. Keep the same tempo and melody so you can hear the change. If the third line feels predictable, leave a rest after “light” or change the note under “on.”</p>`),
      section('hook-versus-chorus', 'Give the hook and chorus different jobs', `
<p>The hook is the bit you remember. The chorus is the repeated section that can carry it. Here, “Leave the light on” is the hook and the four bars make a short chorus. You could also use the phrase once at the end of each verse, or let an instrumental answer it. Use the <a href="/cadence/song-structure/">song structure guide</a> to decide where the listener should hear it again.</p>`),
      section('record-the-hook', 'Record it and check what you remember', `
<p>Record two versions. Step away briefly, then sing back the part you remember before replaying the takes. If the hook disappears, try cutting one syllable or repeating the same rhythm the second time it appears. Compare the versions with the <a href="/cadence/syllable-counter/">line-by-line syllable counter</a>, then follow the <a href="/cadence/type-beat-walkthrough/">beat-first walkthrough</a> to test the revised line in Cadence.</p>`),
    ],
    sources: [source('Songwriting Handbook · Berklee Online', berklee)],
  },
];
