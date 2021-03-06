import DataSet from '@antv/data-set';
import { GraphDataset } from '../data/types';

export function parseDataset(jsonStr: string): GraphDataset {
  const data = JSON.parse(jsonStr);
  const ds = new DataSet();
  const dv = ds.createView().source(data, {
    type: 'graph',
  });
  dv.transform({
    type: 'diagram.arc',
    marginRatio: 0.5,
    // sortBy: 'frequency',
  });

  const nodeIndexMap = new Map<string, number>();
  let i = 0;
  for (const node of dv.nodes) {
    node.index = i++;
    node.selected = false;
    nodeIndexMap.set(node.id, node.index);
  }
  i = 0;
  for (const edge of dv.edges) {
    edge.index = i++;
    edge.sourceIndex = nodeIndexMap.get(edge.source) ?? 0;
    edge.targetIndex = nodeIndexMap.get(edge.target) ?? 0;
    edge.selected = false;
  }

  return dv;
}
