import { css } from "@emotion/react";

export const boardRow = css`
  display: grid;
  grid-template-columns: repeat(3, 50px);
  grid-template-rows: repeat(3, 50px);
  &:after {
    clear: both;
    content: "";
    display: table;
  }
`

export const status = css`
  margin-bottom: 10px;
`