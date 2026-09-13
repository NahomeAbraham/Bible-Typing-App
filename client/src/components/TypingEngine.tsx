import React, { useState, useEffect, useRef } from 'react';

const SAMPLE_VERSE = "In the beginning God created the heaven and the earth.";

const TypingEngine: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (!startTime && val.length > 0) {
      setStartTime(Date.now());
    }

    if (val.length <= SAMPLE_VERSE.length) {
      setUserInput(val);
      calculateStats(val);

      if (val === SAMPLE_VERSE) {
        setIsFinished(true);
      }
    }
  };

  const calculateStats = (currentInput: string) => {
    let correctChars = 0;
    for (let i = 0; i < currentInput.length; i++) {
      if (currentInput[i] === SAMPLE_VERSE[i]) correctChars++;
    }
    const acc = (correctChars / currentInput.length) * 100 || 100;
    setAccuracy(Math.floor(acc));

    if (startTime) {
      const timeElapsed = (Date.now() - startTime) / 60000;
      const wordsTyped = currentInput.length / 5;
      setWpm(Math.floor(wordsTyped / timeElapsed));
    }
  };

  const reset = () => {
    setUserInput("");
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-slate-900 rounded-xl shadow-2xl border border-slate-800">
      <div className="flex justify-between mb-8">
        <div className="text-center">
          <p className="text-slate-400 text-sm uppercase tracking-widest">WPM</p>
          <p className="text-3xl font-bold text-blue-400">{wpm}</p>
        </div>
        <div className="text-center">
          <p className="text-slate-400 text-sm uppercase tracking-widest">Accuracy</p>
          <p className="text-3xl font-bold text-emerald-400">{accuracy}%</p>
        </div>
      </div>

      <div className="relative text-2xl leading-relaxed font-mono mb-8 select-none">
        <div className="text-slate-700">
          {SAMPLE_VERSE}
        </div>

        <div className="absolute top-0 left-0">
          {userInput.split('').map((char, index) => {
            const isCorrect = char === SAMPLE_VERSE[index];
            return (
              <span
                key={index}
                className={isCorrect ? "text-emerald-400" : "text-red-500 bg-red-900/30"}
              >
                {SAMPLE_VERSE[index]}
              </span>
            );
          })}
        </div>
      </div>

      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        disabled={isFinished}
        className="opacity-0 absolute"
      />

      {isFinished && (
        <div className="mt-6 text-center animate-bounce">
          <p className="text-emerald-400 font-bold mb-4 text-xl">
            Well done! Praise God. 🙏
          </p>
          <button
            onClick={reset}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors font-semibold"
          >
            Try Again
          </button>
        </div>
      )}

      {!isFinished && (
        <p className="text-slate-500 text-sm text-center italic mt-4">
          Start typing the verse above to begin...
        </p>
      )}
    </div>
  );
};

export default TypingEngine;