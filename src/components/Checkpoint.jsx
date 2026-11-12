import { useState } from 'react';
import './Checkpoint.css';

// "Predict first" question shown in Class mode. The teacher reveals the answer.
export default function Checkpoint({ question, answer }) {
    const [revealed, setRevealed] = useState(false);

    return (
        <div className="checkpoint-box">
            <div className="checkpoint-label">Predict first</div>
            <p className="checkpoint-question">{question}</p>
            {revealed ? (
                <p className="checkpoint-answer">{answer}</p>
            ) : (
                <button type="button" className="checkpoint-reveal" onClick={() => setRevealed(true)}>
                    Reveal answer
                </button>
            )}
        </div>
    );
}
