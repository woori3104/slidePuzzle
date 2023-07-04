import React from 'react';
import styled from 'styled-components';
import PuzzlePiece from './PuzzlePiece';

const Row = styled.div`
  display: flex;
`;

interface PuzzleRowProps {
  row: (number | null)[];
}

const PuzzleRow: React.FC<PuzzleRowProps> = ({ row }) => {
  return (
    <Row>
      {row.map((piece, colIndex) => (
        <PuzzlePiece key={colIndex} piece={piece} />
      ))}
    </Row>
  );
};

export default PuzzleRow;
