import React from 'react';
interface Props {
    count: number;
    setCount: React.Dispatch<React.SetStateAction<number>>
    total: (a: number, b: number) => number;
}
export const Count = ({ count, setCount, total }: Props) => {
    console.log(total(1, 2))
    return <button
        type="button"
        className="counter"
        onClick={() => setCount((count) => count + 1)}
    >
        Count is {count}
    </button>
}

