import { css } from '@emotion/react';

export const boardRow4x4 = css`
  display: grid;
  grid-template-columns: repeat(4, 50px);
  grid-template-rows: repeat(4, 50px);
  &:after {
    clear: both;
    content: '';
    display: table;
  }
`;

export const status = css`
  margin-bottom: 10px;
`;
