import { useState } from "react";

export default function App() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <h1>Knightfall</h1>

            <button onClick={() => setCount((prev) => prev + 1)}>
                {count}
            </button>
        </div>
    );
}
