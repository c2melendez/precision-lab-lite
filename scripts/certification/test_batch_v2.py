import tempfile
import unittest
from pathlib import Path
from batch_v2 import observations,row_state,sources,fixture,ROOT,trig_fixture,trig_matches

class BatchV2Tests(unittest.TestCase):
    def test_real_sources_and_fixture(self):
        self.assertEqual(len(sources(ROOT)),9)
        self.assertEqual(len(fixture(ROOT)[0]),153)

    def test_trig_source_and_mapping(self):
        rows,digest=trig_fixture(ROOT)
        self.assertEqual(len(rows),324)
        ids={r["id"] for r in rows}
        self.assertEqual(trig_matches("test_it_hi_01_numeric",ids),{"IT-HI-01"})
        self.assertEqual(trig_matches("EV-D-01 and EV-D-02",ids),{"EV-D-01","EV-D-02"})
        self.assertEqual(trig_matches("IT-HI-99",ids),set())
        xml='<testsuite><testcase name="matrix contains IT-HI-01"/><testcase name="test_numeric[IT-HI-02-expression]"><skipped/></testcase><testcase name="IT-HI-03"><failure/></testcase></testsuite>'
        with tempfile.TemporaryDirectory() as temp:
            path=Path(temp)/"report.xml"
            path.write_text(xml)
            mapped,other=observations(path,ids,"TR324")
        self.assertEqual(row_state(mapped["IT-HI-01"]),"REVIEW_NO_MAPPED_TEST")
        self.assertEqual(row_state(mapped["IT-HI-02"]),"REVIEW_SKIPPED")
        self.assertEqual(row_state(mapped["IT-HI-03"]),"FAIL_OBSERVED")
        self.assertEqual(len(other),1)

    def test_conservative_mapping(self):
        xml = """<testsuites><testsuite>
        <testcase classname="tests/matricesMvA01to25.audit.test.ts" name="Group MV-A-01..25 &gt; MV-A-04 evaluates"/>
        <testcase name="MV-A-01 evaluates"/>
        <testcase name="test_mv_a_02_result"><failure/></testcase>
        <testcase name="test_mv_a_03_result"><skipped/></testcase>
        <testcase name="MV-A-01 retry"><error/></testcase>
        <testcase name="MV-A-02 and MV-A-03 summary"/>
        <testcase name="source integrity"/>
        </testsuite></testsuites>"""
        with tempfile.TemporaryDirectory() as temp:
            path=Path(temp)/"report.xml"
            path.write_text(xml)
            rows,other=observations(path,["MV-A-01","MV-A-02","MV-A-03","MV-A-04","MV-A-05"])
        self.assertEqual(row_state(rows["MV-A-01"]),"FAIL_OBSERVED")
        self.assertEqual(row_state(rows["MV-A-02"]),"FAIL_OBSERVED")
        self.assertEqual(row_state(rows["MV-A-03"]),"REVIEW_SKIPPED")
        self.assertEqual(row_state(rows["MV-A-04"]),"REVIEW_TEST_OK")
        self.assertEqual(row_state(rows["MV-A-05"]),"REVIEW_NO_MAPPED_TEST")
        self.assertEqual(len(other),2)
        self.assertEqual(row_state([{"status":"TEST_OK_OBSERVED"}]),"REVIEW_TEST_OK")

if __name__=="__main__":
    unittest.main()
