const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const cors = require('cors');
const os = require('os');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors());

app.post('/generate-pdf', (req, res) => {
  const latexCode = req.body.code;
  if (!latexCode) return res.status(400).json({ error: "Missing 'code' in request body." });

  const tempDir = path.join(os.tmpdir(), `latex-${uuidv4()}`);
  fs.mkdirSync(tempDir);
  const texFile = path.join(tempDir, 'document.tex');
  const pdfFile = path.join(tempDir, 'document.pdf');

  fs.writeFileSync(texFile, latexCode);

  try {
    // Compile LaTeX to PDF
    execSync(`pdflatex -interaction=nonstopmode document.tex`, {
      cwd: tempDir,
      stdio: 'ignore', // no console spam
    });

    res.sendFile(pdfFile, () => {
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

  } catch (error) {
    console.error('LaTeX compilation error');

    // Read the .log file for error details
    const logFile = path.join(tempDir, 'document.log');
    let log = 'Compilation failed.';

    if (fs.existsSync(logFile)) {
      log = fs.readFileSync(logFile, 'utf8');
    } else if (error.stderr) {
      log = error.stderr.toString();
    }

    res.status(500).json({
      error: 'Failed to compile LaTeX',
      log: log.slice(-5000), // send last 5k chars only
    });

    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
