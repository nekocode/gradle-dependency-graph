import React, { useState, useMemo } from 'react';
import { Affix, Col, List, Row } from 'antd';
import styled from 'styled-components';
import { ListItem } from './ListItem';
import { Graph } from './Graph';
import { parseDataset } from '@utils/dataset';
import { GraphDataset } from '@data/types';
import { SelectionState, SelectionContext } from '@hooks/useSelection';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { useDropzone } from 'react-dropzone';

const selectionState = new SelectionState({ nodeId: '', outEdge: true });

const HomePage: React.FC = () => {
  const [dataset, setDataset] = useState<GraphDataset>();
  // useEffect(() => {
  //   setDataset(parseDataset(fakeData));
  // }, []);

  const screens = useBreakpoint();
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    noClick: true,
    accept: 'application/json',
    onDropAccepted: async (files: File[]) => {
      const jsonStr = await files[0].text();
      try {
        const dataset = parseDataset(jsonStr);
        setDataset(dataset);
      } catch (_) {
        // do nothing
      }
    },
  });

  const style = useMemo(
    () => ({
      ...(isDragActive
        ? {
            borderColor: '#2196f3',
          }
        : {}),
      ...(isDragAccept
        ? {
            borderColor: '#00e676',
          }
        : {}),
      ...(isDragReject
        ? {
            borderColor: '#ff1744',
          }
        : {}),
    }),
    [isDragActive, isDragReject, isDragAccept],
  );

  if (!dataset) {
    return (
      <DropzoneContainer>
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <p>
            Drag and drop <strong>dep.json</strong> files here
          </p>
        </div>
      </DropzoneContainer>
    );
  }

  const content = screens.lg ? (
    <Row>
      <Col span={8}>
        <List
          size="small"
          itemLayout="vertical"
          dataSource={dataset.nodes}
          renderItem={(item) => {
            return <ListItem node={item} />;
          }}
        />
      </Col>
      <Col span={16}>
        <Affix>
          <Graph dataset={dataset} selectionState={selectionState} />
        </Affix>
      </Col>
    </Row>
  ) : (
    <div>
      <GraphContainer>
        <Graph dataset={dataset} selectionState={selectionState} />
      </GraphContainer>
      <ListContainer>
        <List
          size="small"
          itemLayout="vertical"
          dataSource={dataset.nodes}
          renderItem={(item) => {
            return <ListItem node={item} />;
          }}
        />
      </ListContainer>
    </div>
  );

  return (
    <SelectionContext.Provider value={selectionState}>
      {content}
    </SelectionContext.Provider>
  );
};

export default HomePage;

const DropzoneContainer = styled.div`
  height: 100vh;
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: #fafafa;
    color: #bdbdbd;
    outline: none;
    border-width: 2px;
    border-radius: 2px;
    border-color: #eeeeee;
    border-style: dashed;
    transition: border 0.24s ease-in-out;

    input {
      height: 100%;
    }
    p {
      padding: 50px 100px;
      display: block;
      margin: 0;
    }
  }
`;

const GraphContainer = styled.div`
  height: 50vh;
  overflow: hidden;
`;

const ListContainer = styled.div`
  height: 50vh;
  overflow: scroll;
`;
