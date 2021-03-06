import React from 'react';

import {
  createSharedStateContext,
  useSharedState,
  SharedState,
} from '@nekocode/use-shared-state';

export interface Selection {
  nodeId: string;
  outEdge: boolean;
}

export class SelectionState extends SharedState<Selection> {}

export const SelectionContext = createSharedStateContext<Selection>(
  new SelectionState({ nodeId: '', outEdge: true }),
);

export const useSelection = (
  shouldUpdate?: boolean | ((current: Selection, prev: Selection) => boolean),
): [
  Selection,
  React.Dispatch<React.SetStateAction<Selection>>,
  SharedState<Selection>,
] => {
  return useSharedState(SelectionContext, shouldUpdate);
};
