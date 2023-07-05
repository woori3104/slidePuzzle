import React from 'react';
import styled from 'styled-components';
import PuzzlePiece from './PuzzlePiece';

const Row = styled.div`
  display: flex;
`;

interface PuzzleRowProps {
  row: (number | null | string)[];
  rowIndex:number
}

const PuzzleRow: React.FC<PuzzleRowProps> = ({ row, rowIndex }) => {
  console.log({row})
  return (
    <Row>
      {row.map((piece, index) => (
        <PuzzlePiece key={index} piece={piece} colIndex={index} rowIndex={rowIndex} />
      ))}
    </Row>
  );
};

export default PuzzleRow;
