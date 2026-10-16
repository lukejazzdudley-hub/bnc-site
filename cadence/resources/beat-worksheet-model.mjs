const names = ['Intro', 'Verse', 'Hook', 'Outro'];

export function calculateSections(tempo, lengths) {
  const bpm = Number(tempo);
  if (String(tempo).trim() === '' || !Number.isFinite(bpm) || bpm < 40 || bpm > 240) {
    throw new Error('Enter a tempo from 40 to 240 BPM.');
  }
  if (!Array.isArray(lengths) || lengths.length !== names.length) {
    throw new Error('Enter all four section lengths in bars.');
  }
  const bars = lengths.map(value => {
    const count = Number(value);
    if (String(value).trim() === '' || !Number.isInteger(count) || count < 0 || count > 256) {
      throw new Error('Use whole bar counts from 0 to 256; 0 skips a section.');
    }
    return count;
  });
  if (!bars.some(Boolean)) throw new Error('Include at least one bar.');
  let total = 0;
  const sections = bars.flatMap((count, index) => {
    if (!count) return [];
    const start = total;
    total += count;
    return [{name: names[index], bars: count, startBar: start + 1, endBar: total, startSeconds: start * 240 / bpm, endSeconds: total * 240 / bpm}];
  });
  return {sections, bars: total, seconds: total * 240 / bpm, bpm};
}

export function worksheetText(values) {
  const plan = calculateSections(values.tempo, values.bars);
  const field = key => String(values[key] ?? '').trim() || '________________';
  return `BEAT-TO-DEMO WORKSHEET
${field('title')}

Beat / producer / permission reference: ${field('beat')}
What changes in the song: ${field('intent')}
Tempo: ${plan.bpm} BPM. Four beats per bar; constant tempo assumed.
${plan.sections.map(s => `${s.name}: bars ${s.startBar}–${s.endBar} (${s.startSeconds.toFixed(1)}–${s.endSeconds.toFixed(1)} seconds)`).join('\n')}
Total: ${plan.bars} bars / ${plan.seconds.toFixed(1)} seconds.

LYRICS / ENTRY POINTS / BREATHS
${field('lyrics')}

TAKE A — entry, breath, words heard, image remembered
${field('takeA')}

TAKE B — same beat and level; change one thing
${field('takeB')}

DECISION — keep / revise / next take
${field('decision')}

HANDOFF CHECK
[ ] Beat permission checked separately for intended use
[ ] Beat and vocal start from the same reference point
[ ] Exported files opened and checked outside the writing app
[ ] Tempo, version, producer credit and take choice written down

This worksheet is not a beat licence. Check the producer's terms.
Original exercise and worksheet: Cadence / Brand Name Changes.
Copy for personal use or teaching with credit.
https://brandnamechanges.com/cadence/resources/writing-rap-lyrics-over-a-beat/
`;
}
