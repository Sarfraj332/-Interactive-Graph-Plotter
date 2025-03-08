export type GraphType = 
  | 'line'
  | 'bar'
  | 'scatter'
  | 'pie'
  | 'doughnut'
  | 'radar'
  | 'area'
  | 'histogram'
  | 'bubble'
  | 'step'
  | 'polar';

export interface GraphControls {
  type: GraphType;
  equation: string;
  data: string; // For non-equation graphs (comma-separated values)
  xMin: number;
  xMax: number;
  step: number;
}