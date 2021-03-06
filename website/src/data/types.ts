export interface GraphDataset {
  nodes: Node[];
  edges: Edge[];
}

export interface Node {
  index: number;
  id: string;
  name: string;
  inEdges: Edge[];
  outEdges: Edge[];
  selected: boolean;
}

export interface Edge {
  index: number;
  source: string;
  sourceIndex: number;
  target: string;
  targetIndex: number;
  selected: boolean;
}
