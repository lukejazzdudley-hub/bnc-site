"""Release evidence must fail visibly when app labels move or disappear."""
import tempfile
import unittest
from pathlib import Path
from scripts.check_feature_guide_sources import check

class GuideSourceCheckTest(unittest.TestCase):
    def test_source_changes_require_guide_review(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / 'screen.tsx'
            source.write_text('Open rhyme inspector')
            evidence = {'files': {'screen.tsx': ['rhyme inspector']}}
            self.assertEqual(check(root, evidence), [])
            source.write_text('Open rhyme search')
            self.assertIn('no longer contains', check(root, evidence)[0])
            source.unlink()
            self.assertIn('Missing source', check(root, evidence)[0])
