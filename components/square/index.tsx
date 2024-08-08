import { FunctionComponent } from "react";
import { Mark } from "../../types/index";

type SquareProps = {
    value: Mark;
    onSquareClick: () => void;
}

export const Square: FunctionComponent<SquareProps> = ({ value, onSquareClick }: SquareProps) => {
    return (
        <>
            <button className="square" onClick={onSquareClick}>
                {value}
            </button>
        </>
    );
}