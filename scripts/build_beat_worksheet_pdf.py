"""Build the two-page printable lesson worksheet (requires ReportLab)."""
import argparse
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor

ROOT = Path(__file__).resolve().parents[1]
PAGE_W, PAGE_H = A4
LEFT, RIGHT = 48, PAGE_W - 48
WIDTH = RIGHT - LEFT
INK, MUTED, RULE = map(HexColor, ('#111820', '#46515c', '#c3cad0'))


def build(output):
    output = Path(output)
    output.parent.mkdir(parents=True, exist_ok=True)
    pdf = canvas.Canvas(str(output), pagesize=A4, invariant=1)
    pdf.setTitle('Beat-to-demo worksheet | Cadence')
    pdf.setAuthor('Cadence / Brand Name Changes')
    pdf.setSubject('Free songwriting exercise: section map, lyric draft and take comparison')

    def text(x, y, value, size=10, font='Helvetica', color=INK):
        pdf.setFillColor(color)
        pdf.setFont(font, size)
        pdf.drawString(x, y, value)

    def line(y, x=LEFT, end=RIGHT):
        pdf.setStrokeColor(RULE)
        pdf.setLineWidth(.5)
        pdf.line(x, y, end, y)

    def ruled(label, top, count=3, step=23):
        text(LEFT, top, label, 10, 'Helvetica-Bold')
        for i in range(count):
            line(top - 20 - i * step)

    def header(number, subtitle):
        text(LEFT, PAGE_H - 44, 'CADENCE / FIELD NOTES', 9, 'Helvetica-Bold', MUTED)
        pdf.setFont('Helvetica', 9)
        pdf.drawRightString(RIGHT, PAGE_H - 44, f'{number} / 2')
        line(PAGE_H - 57)
        text(LEFT, PAGE_H - 94, subtitle, 27, 'Times-Roman')

    def footer():
        line(64)
        text(LEFT, 47, 'Copy for personal use or teaching with credit. This is not a beat licence.', 8, color=MUTED)
        text(LEFT, 33, 'Full lesson: brandnamechanges.com/cadence/resources/writing-rap-lyrics-over-a-beat/', 7, color=MUTED)
        pdf.linkURL('https://brandnamechanges.com/cadence/resources/writing-rap-lyrics-over-a-beat/', (LEFT, 28, RIGHT, 43), relative=0)

    header(1, 'From beat to first demo')
    text(LEFT, 726, 'A 30-minute writing exercise. Any permitted instrumental. Any recorder.', 10, color=MUTED)
    ruled('Song / session name', 693, 1)
    ruled('Beat, producer and permission reference', 646, 1)
    ruled('What changes in this song?', 599, 2)
    text(LEFT, 510, 'SECTION PLAN', 9, 'Helvetica-Bold', MUTED)
    text(LEFT + 145, 510, 'Tempo: __________ BPM     Beats per bar: __________', 10)
    columns = [LEFT, LEFT + 100, LEFT + 222, LEFT + 346]
    for x, label in zip(columns, ['Section', 'Number of bars', 'Entry / time', 'Purpose']):
        text(x, 480, label, 9, 'Helvetica-Bold')
    for i, name in enumerate(['Intro', 'Verse', 'Hook', 'Outro']):
        y = 450 - i * 31
        text(LEFT, y, name, 10)
        for x in columns[1:]:
            line(y - 5, x, min(x + 112, RIGHT))
    text(LEFT, 319, 'Example: 4 + 8 + 4 + 4 bars at 90 BPM, four beats per bar = 53.3 seconds.', 9, color=MUTED)
    text(LEFT, 303, 'Check the actual beat: pickups, count-ins and tempo changes alter timestamps.', 9, color=MUTED)
    text(LEFT, 270, '30-MINUTE ROUTE', 9, 'Helvetica-Bold', MUTED)
    for y, value in zip([246, 219, 192, 165, 138], [
        '00-05  Listen and count. Find the first full bar and a repeatable loop.',
        '05-10  Choose one thought. Speak it against the beat before finding rhymes.',
        '10-18  Draft four bars. Record take A at the actual tempo.',
        '18-25  Change one phrase or entry. Keep the loop and level; record take B.',
        '25-30  Listen without reading. Keep, revise and write down the next decision.',
    ]):
        text(LEFT, y, value, 10)
    text(LEFT, 96, 'Use your own language and natural stress. Leave room for the thought.', 10, 'Times-Italic')
    footer()
    pdf.showPage()

    header(2, 'Write. Record. Choose.')
    text(LEFT, 726, 'Capitals: emphasis. Slash: a proposed space. Test both against your beat.', 10, color=MUTED)
    ruled('Lyric draft / entry words / breaths', 691, 7, 23)
    text(LEFT, 494, 'Original revision example:', 9, 'Helvetica-Bold', MUTED)
    text(LEFT, 477, 'I had a whole speech that I wanted to say, but I let half of it go', 10)
    text(LEFT, 460, 'Try: I had a whole speech; I let half of it go.', 11, 'Times-Italic')
    ruled('Take A: late entries, breath, words heard, image remembered', 425, 3)
    ruled('Take B: change one thing; did clarity and energy improve?', 315, 3)
    ruled('Decision: keep / revise / next take', 205, 2)
    text(LEFT, 120, 'HANDOFF CHECK', 9, 'Helvetica-Bold', MUTED)
    text(LEFT, 103, '[ ] Permission checked   [ ] Common start   [ ] Files opened elsewhere', 9)
    text(LEFT, 87, '[ ] Tempo, producer credit, preferred take and version noted', 9)
    footer()
    pdf.save()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, default=ROOT / 'cadence/resources/beat-to-demo-worksheet.pdf')
    build(parser.parse_args().output)
