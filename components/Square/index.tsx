import { FunctionComponent } from "react";
import { Mark } from "../../types/index";
import { css , ClassNames } from "@emotion/react";
import { square } from "./styled";

type SquareProps = {
    value: Mark;
    onSquareClick: () => void;
}

export const Square: FunctionComponent<SquareProps> = ({ value, onSquareClick }: SquareProps) => {
    const mark: string[]= ['X' , 'O'];
    const markCheck: boolean = mark.includes(String(value));
    const hoverStyle = !markCheck ? css`
        &:hover {
            background: #FFEDCF;
        }
    ` : '';


    return (
        <ClassNames>
            {({ css }) => (
            <button className={css`${square} ${hoverStyle}`} onClick={onSquareClick}>
                {value}
            </button>
            )}
        </ClassNames>
    );
}