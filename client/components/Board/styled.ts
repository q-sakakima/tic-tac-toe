import { css } from '@emotion/react';

export const boardRow = css`
  display: grid;
  &:after {
    clear: both;
    content: '';
    display: table;
  }
`;

export const boardRow3x3 = css`
  grid-template-columns: repeat(3, 50px);
  grid-template-rows: repeat(3, 50px);
`;

export const boardRow4x4 = css`
  grid-template-columns: repeat(4, 50px);
  grid-template-rows: repeat(4, 50px);
`;

export const status = css`
  margin-bottom: 10px;
`;
