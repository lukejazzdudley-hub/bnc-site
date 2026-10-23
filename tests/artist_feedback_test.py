from pathlib import Path
from html.parser import HTMLParser
import unittest

ROOT = Path(__file__).resolve().parents[1]

class FeedbackParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_feedback = False
        self.quotes = 0
        self.captions = 0
        self.links = []
        self.text = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'section' and attrs.get('id') == 'artist-feedback':
            self.in_feedback = True
        if self.in_feedback:
            self.quotes += tag == 'blockquote'
            self.captions += tag == 'figcaption'
            if tag == 'a': self.links.append(attrs['href'])
    def handle_endtag(self, tag):
        if tag == 'section': self.in_feedback = False
    def handle_data(self, data):
        if self.in_feedback: self.text.append(data)

class ArtistFeedbackTest(unittest.TestCase):
    def test_static_anonymous_feedback_has_disclosure_and_working_destinations(self):
        html = (ROOT / 'cadence/index.html').read_text()
        parser = FeedbackParser(); parser.feed(html)
        self.assertEqual(parser.quotes, 3)
        self.assertEqual(parser.captions, 3)
        text = ' '.join(parser.text)
        self.assertEqual(text.count('Anonymous'), 3)
        self.assertNotIn('@', text)
        self.assertIn('complimentary access', text)
        self.assertIn('lightly edited', text)
        self.assertNotIn('aggregateRating', html)
        self.assertNotIn('reviewRating', html)
        for href in parser.links:
            self.assertTrue((ROOT / href.lstrip('/') / 'index.html').is_file())
