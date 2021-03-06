import React, { useEffect, useRef } from 'react';
import { Chart, registerInteraction, View } from '@antv/g2';
import { GraphDataset, Node } from '@data/types';
import { Selection, SelectionState } from '@hooks/useSelection';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

const ID = 'dep-graph-1';

registerInteraction('custom-cursor', {
  showEnable: [
    { trigger: 'point:mouseenter', action: 'cursor:pointer' },
    { trigger: 'point:mouseleave', action: 'cursor:default' },
  ],
});

export const Graph: React.FC<{
  dataset: GraphDataset;
  selectionState: SelectionState;
}> = ({ dataset, selectionState }) => {
  const screens = useBreakpoint();
  const chartRef = useRef<Chart>();
  const nodeViewRef = useRef<View>();
  const edgeViewRef = useRef<View>();

  useEffect(() => {
    const chart = new Chart({
      container: ID,
      autoFit: true,
      width: undefined,
      height: document.body.clientHeight,
      padding: 60,
    });
    chart.legend(false);
    chart.animate(false);
    chart.tooltip({
      showTitle: false,
    });
    chart.scale({
      x: {
        nice: true,
        sync: true,
      },
      y: {
        nice: true,
        sync: true,
      },
    });
    chart.interaction('custom-cursor');

    const edgeView = chart.createView();
    edgeView.coordinate('polar').reflect('y');
    edgeView.axis(false);
    edgeView
      .edge()
      .position('x*y')
      .shape('arc')
      .style('selected', (selected) => {
        return {
          opacity: selected ? 0.5 : 0,
          stroke: '#1890ff',
        };
      })
      .tooltip(false);

    const nodeView = chart.createView();
    nodeView.coordinate('polar').reflect('y');
    nodeView.axis(false);
    nodeView
      .point()
      .position('x*y')
      .shape('circle')
      .size('value')
      .color('id')
      .style({
        fields: ['selected'],
        callback: (selected: boolean) => {
          return {
            fillOpacity: selected ? 1 : 0.3,
            opacity: selected ? 1 : 0.3,
            lineWidth: 1,
            stroke: selected ? 'black' : 'grey',
          };
        },
      })
      .label('name*selected', (name, selected) => {
        return {
          content: name,
          labelEmit: true,
          style: {
            fill: 'black',
            opacity: selected ? 1 : 0.3,
          },
        };
      });

    chartRef.current = chart;
    nodeViewRef.current = nodeView;
    edgeViewRef.current = edgeView;
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) {
      return;
    }

    chart.changeSize(
      screens.lg ? document.body.clientWidth * 0.6 : document.body.clientWidth,
      screens.lg ? document.body.clientHeight : document.body.clientHeight / 2,
    );
    chart.render();
  }, [screens.lg]);

  useEffect(() => {
    const chart = chartRef.current;
    const nodeView = nodeViewRef.current;
    const edgeView = edgeViewRef.current;
    if (!chart || !nodeView || !edgeView) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onNodeClick = (ev: any) => {
      if (!ev.data || !ev.data.data) {
        return;
      }

      const selectedNode = ev.data.data as Node;
      window.location.hash = selectedNode.id;
      selectionState.setValue((current) => ({
        nodeId: selectedNode.id,
        outEdge: current.nodeId !== selectedNode.id ? true : !current.outEdge,
      }));
    };
    chart.on('point:click', onNodeClick);

    const listener = (state: Selection) => {
      const { nodeId, outEdge } = state;

      let selectedNode: Node | undefined;
      for (const node of dataset.nodes) {
        if (node.id === nodeId) {
          selectedNode = node;
          continue;
        }
        node.selected = false;
        for (const edge of node.outEdges) {
          edge.selected = false;
        }
        for (const edge of node.inEdges) {
          edge.selected = false;
        }
      }

      if (selectedNode) {
        if (outEdge) {
          selectedNode.selected = true;
        } else {
          selectedNode.selected = false;
          for (const edge of selectedNode.inEdges) {
            dataset.nodes[edge.sourceIndex].selected = true;
          }
        }
        for (const edge of selectedNode.outEdges) {
          edge.selected = outEdge;
        }
        for (const edge of selectedNode.inEdges) {
          edge.selected = !outEdge;
        }
      }

      nodeView.changeData(dataset.nodes);
      edgeView.changeData(dataset.edges);
      chart.render();
    };
    selectionState.addListener(listener);

    if (!edgeView.getData()) {
      nodeView.data(dataset.nodes);
      edgeView.data(dataset.edges);
    } else {
      nodeView.changeData(dataset.nodes);
      edgeView.changeData(dataset.edges);
    }
    chart.render();

    return () => {
      selectionState.removeListener(listener);
    };
  }, [dataset, selectionState]);

  return <div id={ID}></div>;
};
