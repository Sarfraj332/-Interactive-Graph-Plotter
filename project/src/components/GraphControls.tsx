import React from 'react';
import { Download, FileType, HelpCircle, LineChart } from 'lucide-react';
import { GraphType, GraphControls as GraphControlsType } from '../types';

interface Props {
  controls: GraphControlsType;
  onChange: (controls: GraphControlsType) => void;
  onExport: (type: 'png' | 'pdf') => void;
}

const graphTypes: GraphType[] = [
  'line',
  'bar',
  'scatter',
  'pie',
  'doughnut',
  'radar',
  'area',
  'histogram',
  'bubble',
  'step',
  'polar'
];

const equationBasedTypes = ['line', 'area', 'scatter', 'bubble', 'step'];

const commonEquations = [
  'sin(x)',
  'cos(x)',
  'tan(x)',
  'x^2',
  'x^3',
  'log(x)',
  'exp(x)',
  '1/x',
  'sqrt(x)',
  'abs(x)',
  'floor(x)',
  'ceil(x)',
];

const sampleData = [
  '10, 20, 30, 40, 50',
  '15, 25, 10, 35, 20',
  '100, 200, 150, 300, 250',
  '5, 15, 10, 20, 25',
];

export function GraphControls({ controls, onChange, onExport }: Props) {
  const isEquationBased = equationBasedTypes.includes(controls.type);

  const handleChange = (field: keyof GraphControlsType, value: string | number) => {
    if (typeof value === 'string' && ['xMin', 'xMax', 'step'].includes(field)) {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return;
      onChange({ ...controls, [field]: numValue });
    } else {
      onChange({ ...controls, [field]: value });
    }
  };

  return (
    <div className="p-6 bg-[#1f2937] rounded-lg space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <LineChart className="w-6 h-6 text-cyan-400" />
          <h2>Graph Controls</h2>
        </div>
        <div className="text-sm text-gray-400">
          by ZN SARFRAJ
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Graph Type</label>
          <select
            value={controls.type}
            onChange={(e) => handleChange('type', e.target.value as GraphType)}
            className="w-full bg-[#2d3748] border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            {graphTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)} Graph
              </option>
            ))}
          </select>
        </div>

        {isEquationBased ? (
          <div>
            <label className="block text-sm font-medium mb-1">Equation (in terms of x)</label>
            <input
              type="text"
              value={controls.equation}
              onChange={(e) => handleChange('equation', e.target.value)}
              placeholder="e.g., sin(x), x^2, log(x)"
              className="w-full bg-[#2d3748] border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 mb-2"
            />
            <div className="flex flex-wrap gap-2">
              {commonEquations.map((eq) => (
                <button
                  key={eq}
                  onClick={() => handleChange('equation', eq)}
                  className={`px-2 py-1 text-sm rounded-md transition-colors ${
                    controls.equation === eq
                      ? 'bg-cyan-400 text-black'
                      : 'bg-[#2d3748] hover:bg-[#374151]'
                  }`}
                >
                  {eq}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-1">Data (comma-separated values)</label>
            <input
              type="text"
              value={controls.data}
              onChange={(e) => handleChange('data', e.target.value)}
              placeholder="e.g., 10, 20, 30, 40, 50"
              className="w-full bg-[#2d3748] border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 mb-2"
            />
            <div className="flex flex-wrap gap-2">
              {sampleData.map((data) => (
                <button
                  key={data}
                  onClick={() => handleChange('data', data)}
                  className={`px-2 py-1 text-sm rounded-md transition-colors ${
                    controls.data === data
                      ? 'bg-cyan-400 text-black'
                      : 'bg-[#2d3748] hover:bg-[#374151]'
                  }`}
                >
                  Sample {sampleData.indexOf(data) + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {isEquationBased && (
          <div>
            <label className="block text-sm font-medium mb-2">X-Axis Range</label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Min</label>
                <input
                  type="number"
                  value={controls.xMin}
                  onChange={(e) => handleChange('xMin', e.target.value)}
                  className="w-full bg-[#2d3748] border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Max</label>
                <input
                  type="number"
                  value={controls.xMax}
                  onChange={(e) => handleChange('xMax', e.target.value)}
                  className="w-full bg-[#2d3748] border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Step</label>
                <input
                  type="number"
                  value={controls.step}
                  onChange={(e) => handleChange('step', e.target.value)}
                  step="0.1"
                  min="0.1"
                  className="w-full bg-[#2d3748] border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Export Options</label>
          <div className="flex gap-4">
            <button
              onClick={() => onExport('png')}
              className="flex items-center gap-2 px-4 py-2 bg-[#2d3748] border border-cyan-400 rounded-md hover:bg-[#374151] transition-colors"
            >
              <Download className="w-4 h-4" />
              PNG
            </button>
            <button
              onClick={() => onExport('pdf')}
              className="flex items-center gap-2 px-4 py-2 bg-[#2d3748] border border-cyan-400 rounded-md hover:bg-[#374151] transition-colors"
            >
              <FileType className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>

        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors">
          <HelpCircle className="w-4 h-4" />
          Show Help
        </button>
      </div>
    </div>
  );
}