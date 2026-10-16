import unittest
from scripts.search_report import summarise
class SearchReport(unittest.TestCase):
 def test_aggregates_without_inventing_installs(self):
  rows=[dict(route='/cadence/',source='google',event='view',store='none',count='4'),dict(route='/cadence/',source='google',event='store',store='google',count='2')]
  self.assertEqual(summarise(rows),[dict(route='/cadence/',source='google',views=4,apple_store_clicks=0,google_store_clicks=2)])
 def test_bad_dimensions_and_negative_counts_fail(self):
  for event,store,count in [('install','google','1'),('view','none','-1'),('view','apple','1')]:
   with self.assertRaises(ValueError):summarise([dict(route='/cadence/',source='direct',event=event,store=store,count=count)])
