import { FunctionComponent } from "react";
import { Mark } from "../../types/index";
import { css , ClassNames } from "@emotion/react"; 
import { square } from "./styled";

type SquareProps = {
    value: Mark;
    onSquareClick: () => void;
}

export const Square: FunctionComponent<SquareProps> = ({ value, onSquareClick }: SquareProps) => {
    return (
        <ClassNames>
            {({ css }) => (
            <button className={css(square)} onClick={onSquareClick}>
                {value}
            </button>
            )}
        </ClassNames>
    );
}