import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]

class SearchIntentNovember(unittest.TestCase):
    def test_pidgin_practice_is_static_and_honest(self):
        page = (ROOT / 'cadence/languages/nigerian-pidgin/index.html').read_text()
        self.assertIn('id="write-a-pidgin-verse"', page)
        self.assertIn('How to write a Nigerian Pidgin verse and hook', page)
        self.assertIn('You write the lyrics', page)
        self.assertIn('Tok Pisin', page)
        for anchor in ('beat-loop', 'voice-memos', 'languages'):
            self.assertIn('/cadence/guide/#' + anchor, page)

    def test_resource_hub_links_to_existing_tools_and_workflows(self):
        page = (ROOT / 'cadence/resources/index.html').read_text()
        for route in ('languages/nigerian-pidgin', 'fr/dictionnaire-rimes',
                      'es/diccionario-rimas', 'production-notes-sample-library',
                      'offline-music-player', 'songwriting-habit-tracker',
                      'mobile-daw-songwriting'):
            self.assertIn('href="/cadence/' + route + '/', page)
