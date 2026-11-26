import tempfile
import unittest
from pathlib import Path
from batch_v2 import observations,row_state,sources,fixture,ROOT

class BatchV2Tests(unittest.TestCase):
    def test_real_sources_and_fixture(self):
        self.assertEqual(len(sources(ROOT)),9)
        self.assertEqual(len(fixture(ROOT)[0]),153)

    def test_conservative_mapping(self):
        xml = """<testsuites><testsuite>
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
            rows,other=observations(path,["MV-A-01","MV-A-02","MV-A-03","MV-A-04"])
        self.assertEqual(row_state(rows["MV-A-01"]),"FAIL_OBSERVED")
        self.assertEqual(row_state(rows["MV-A-02"]),"FAIL_OBSERVED")
        self.assertEqual(row_state(rows["MV-A-03"]),"REVIEW_SKIPPED")
        self.assertEqual(row_state(rows["MV-A-04"]),"REVIEW_NO_MAPPED_TEST")
        self.assertEqual(len(other),2)
        self.assertEqual(row_state([{"status":"TEST_OK_OBSERVED"}]),"REVIEW_TEST_OK")

if __name__=="__main__":
    unittest.main()
