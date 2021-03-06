import { useSelection } from '@hooks/useSelection';
import { Node } from '@data/types';
import { List } from 'antd';
import React from 'react';

export const ListItem: React.FC<{
  node: Node;
}> = ({ node }) => {
  const [selection, setSelection] = useSelection((current, prev) => {
    return current.nodeId === node.id || prev.nodeId === node.id;
  });
  const isSelected = node.id === selection.nodeId;
  const isOutEdge = selection.outEdge;

  return (
    <List.Item
      key={node.id}
      actions={[
        <a
          key={`${node.id}-out`}
          onClick={() => {
            setSelection({ nodeId: node.id, outEdge: true });
          }}
          style={{
            background: isSelected && isOutEdge ? 'black' : 'transparent',
            color: isSelected && isOutEdge ? 'white' : undefined,
          }}
        >
          Depends on: {node.outEdges.length}
        </a>,
        <a
          key={`${node.id}-in`}
          onClick={() => {
            setSelection({ nodeId: node.id, outEdge: false });
          }}
          style={{
            background: isSelected && !isOutEdge ? 'black' : 'transparent',
            color: isSelected && !isOutEdge ? 'white' : undefined,
          }}
        >
          Be depended on: {node.inEdges.length}
        </a>,
      ]}
    >
      <List.Item.Meta
        title={
          <a id={node.id} href={'#' + node.id}>
            {node.name}
          </a>
        }
        description={node.id}
      />
    </List.Item>
  );
};
