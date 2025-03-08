import React, { useState } from 'react';
import { GraphControls as GraphControlsComponent } from './components/GraphControls';
import { Graph } from './components/Graph';
import { GraphControls } from './types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function App() {
  const [controls, setControls] = useState<GraphControls>({
    type: 'line',
    equation: 'sin(x)',
    data: '10, 20, 30, 40, 50',
    xMin: -10,
    xMax: 10,
    step: 0.1,
  });

  const handleExport = async (type: 'png' | 'pdf') => {
    const graphElement = document.querySelector('.graph-container');
    if (!graphElement) return;

    const canvas = await html2canvas(graphElement as HTMLElement);

    if (type === 'png') {
      const link = document.createElement('a');
      link.download = 'graph.png';
      link.href = canvas.toDataURL();
      link.click();
    } else {
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 100);
      pdf.save('graph.pdf');
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1b26] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold neon-text mb-2">Graph Plotter</h1>
          <p className="text-gray-400">Plot and visualize mathematical equations in real-time</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <GraphControlsComponent
              controls={controls}
              onChange={setControls}
              onExport={handleExport}
            />
          </div>
          <div className="lg:col-span-2 graph-container">
            <Graph controls={controls} />
          </div>
        </div>

        <footer className="text-center text-sm text-gray-500">
          <p>Graph Plotter App © 2025 | Built with HTML, CSS, JavaScript by ZN SARFRAJ</p>
        </footer>
      </div>
    </div>
  );
}

export default App;