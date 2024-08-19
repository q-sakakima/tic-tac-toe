import { FunctionComponent } from "react";
import { Mark } from "../../types/index";
import { css , ClassNames } from "@emotion/react";
import { square, hoverStyle } from "./styled";

type SquareProps = {
    value: Mark;
    onSquareClick: () => void;
}

export const Square: FunctionComponent<SquareProps> = ({ value, onSquareClick }: SquareProps) => {
    const mark: string[]= ['X' , 'O'];
    const markCheck: boolean = mark.includes(String(value));

    return (
        <ClassNames>
            {({ css }) => (
            <button className={css`${square} ${!markCheck ? hoverStyle : ''}`} onClick={onSquareClick}>
                {value}
            </button>
            )}
        </ClassNames>
    );
}