import pathlib
import unittest
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parents[1]


class WorksheetParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.names = []
        self.headings = []
        self.scripts = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('input', 'textarea'):
            self.names.append(attrs.get('name'))
        if tag == 'section':
            self.headings.append(attrs.get('id'))
        if tag == 'script' and 'src' in attrs:
            self.scripts.append(attrs['src'])


class BeatLessonContract(unittest.TestCase):
    def test_complete_static_lesson_has_worked_revision_and_worksheet(self):
        html = (ROOT / 'cadence/resources/writing-rap-lyrics-over-a-beat/index.html').read_text()
        parsed = WorksheetParser()
        parsed.feed(html)
        for anchor in ['beat-to-demo-lesson', 'worked-verse-revision', 'demo-section-map', 'compare-takes-and-handoff', 'beat-to-demo-worksheet']:
            self.assertIn(anchor, parsed.headings)
            self.assertIn(f'href="#{anchor}"', html)
        for name in ['title', 'beat', 'intent', 'tempo', 'introBars', 'verseBars', 'hookBars', 'outroBars', 'lyrics', 'takeA', 'takeB', 'decision']:
            self.assertIn(name, parsed.names)
        self.assertIn('I had a whole speech; I let half of it go.', html)
        self.assertIn('full arrangement and export workflow requires Pro', html)
        self.assertIn('are not saved to your account or sent to us', html)
        self.assertIn('/cadence/resources/beat-worksheet.mjs', parsed.scripts)

    def test_blank_download_is_real_and_does_not_need_javascript(self):
        path = ROOT / 'cadence/resources/beat-to-demo-worksheet.txt'
        text = path.read_text()
        self.assertIn('TAKE A', text)
        self.assertIn('TAKE B', text)
        self.assertIn('53.3', text)
        self.assertIn('not a beat licence', text)

    def test_printable_pdf_is_linked_and_has_pdf_header(self):
        pdf = (ROOT / 'cadence/resources/beat-to-demo-worksheet.pdf').read_bytes()
        self.assertTrue(pdf.startswith(b'%PDF-'))
        html = (ROOT / 'cadence/resources/writing-rap-lyrics-over-a-beat/index.html').read_text()
        self.assertIn('href="/cadence/resources/beat-to-demo-worksheet.pdf" download', html)

    def test_enhancement_has_no_network_or_persistent_storage(self):
        script = (ROOT / 'cadence/resources/beat-worksheet.mjs').read_text()
        for forbidden in ['fetch(', 'XMLHttpRequest', 'localStorage', 'sessionStorage', 'innerHTML', 'sendBeacon', 'indexedDB']:
            self.assertNotIn(forbidden, script)


if __name__ == '__main__':
    unittest.main()
