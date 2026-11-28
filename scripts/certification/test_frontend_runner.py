"""Exercise the actual shared shell runner without network or real npm."""
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

RUNNER = Path(__file__).with_name("frontend-runner.sh")

class FrontendRunnerTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root=Path(self.tmp.name)
        self.script=self.root/"scripts/certification/frontend-runner.sh"
        self.script.parent.mkdir(parents=True)
        shutil.copyfile(RUNNER,self.script)
        self.frontend=self.root/"frontend"
        self.frontend.mkdir()
        for cwd in (self.root,self.frontend):
            (cwd/"package.json").write_text("{}")
            (cwd/"package-lock.json").write_text("{}")
        self.bin=self.root/"bin"
        self.bin.mkdir()
        for name,source in {
            "npm": '#!/bin/bash\nif [[ "$1" == "--version" ]]; then echo 10.0.0; exit 0; fi\nprintf "%s\\n" "$*" >> "$CALLS"\nexit "${NPM_STATUS:-0}"\n',
            "node": "#!/bin/bash\necho v22.0.0\n",
            "git": "#!/bin/bash\necho 0123456789abcdef0123456789abcdef01234567\n",
        }.items():
            p=self.bin/name
            p.write_text(source)
            p.chmod(0o755)
        self.calls=self.root/"calls"
        self.env=dict(os.environ,PATH=str(self.bin)+":"+os.environ["PATH"],CALLS=str(self.calls))

    def invoke(self,*phase,cwd=None,**env):
        return subprocess.run(["bash",str(self.script),*phase],cwd=cwd or self.frontend,env=dict(self.env,**env),capture_output=True,text=True)

    def test_all_phases_both_layouts(self):
        for cwd in (self.root,self.frontend):
            for phase in ("install","typecheck","test","build"):
                with self.subTest(cwd=cwd,phase=phase):
                    result=self.invoke(phase,cwd=cwd)
                    self.assertEqual(result.returncode,0,result.stderr)
                    self.assertIn("Lockfile SHA256:",result.stdout)
        self.assertEqual(self.calls.read_text().splitlines(),["ci","run typecheck","test","run build"]*2)

    def test_failure_propagates(self):
        self.assertEqual(self.invoke("test",NPM_STATUS="17").returncode,17)

    def test_unknown_extra_or_missing_phase_rejected(self):
        for args in ((),("install","test"),("exec arbitrary",)):
            self.assertEqual(self.invoke(*args).returncode,64)
        self.assertFalse(self.calls.exists())

    def test_other_working_directory_rejected(self):
        self.assertEqual(self.invoke("test",cwd=self.bin).returncode,65)
        self.assertFalse(self.calls.exists())

    def test_missing_lockfile_rejected(self):
        (self.frontend/"package-lock.json").unlink()
        self.assertEqual(self.invoke("test").returncode,66)
        self.assertFalse(self.calls.exists())
