import { gridCell, gridContainer, gridRow } from './Grid.css';

type Props = {
  data: string[][];
};

export function Grid({ data }: Props) {
  return (
    <div className={gridContainer}>
      {data.map((row, rowIndex) => (
        <div key={rowIndex} className={gridRow}>
          {row.map((value, colIndex) => (
            <div key={colIndex} className={gridCell}>
              {value}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
