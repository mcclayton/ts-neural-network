import { style } from '@vanilla-extract/css';

export const gridContainer = style({
  display: 'grid',
  gridGap: '2px',
});

export const gridRow = style({
  display: 'flex',
});

export const gridCell = style({
  width: '30px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #ccc',
});
