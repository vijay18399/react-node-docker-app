import { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [code, setCode] = useState("% Write your LaTeX here...");

  const handleGenerate = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/generate-pdf',
        { code },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>LaTeX Editor</h2>
      <textarea
        style={{ width: '100%', height: '400px', fontFamily: 'monospace', fontSize: '14px' }}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={handleGenerate} style={{ marginTop: '20px' }}>
        Generate PDF
      </button>
    </div>
  );
}
