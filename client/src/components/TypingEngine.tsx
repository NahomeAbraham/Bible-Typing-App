import React, { useState, useEffect, useRef } from 'react';

interface VerseData {
  book: string;
  chapter: number;
  verseNum: number;
  text: string;
}

const TypingEngine: React.FC = () => {
  const [verseData, setVerseData] = useState<VerseData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch a random verse from our Express backend
  const fetchRandomVerse = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('http://localhost:5001/api/verse/random');
      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }
      const data: VerseData = await res.json();
      setVerseData(data);
      resetState();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while fetching the verse.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load a verse when the component first mounts
  useEffect(() => {
    fetchRandomVerse();
  }, []);

  // Auto-focus input when ready
  useEffect(() => {
    if (!loading && !isFinished) {
      inputRef.current?.focus();
    }
  }, [loading, isFinished]);

  const resetState = () => {
    setUserInput("");
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const currentVerseText = verseData?.text || "";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (!startTime && val.length > 0) {
      setStartTime(Date.now());
    }

    if (val.length <= currentVerseText.length) {
      setUserInput(val);
      calculateStats(val);

      if (val === currentVerseText) {
        setIsFinished(true);
      }
    }
  };

  const calculateStats = (currentInput: string) => {
    let correctChars = 0;
    for (let i = 0; i < currentInput.length; i++) {
      if (currentInput[i] === currentVerseText[i]) correctChars++;
    }
    const acc = (correctChars / currentInput.length) * 100 || 100;
    setAccuracy(Math.floor(acc));

    if (startTime) {
      const timeElapsed = (Date.now() - startTime) / 60000;
      const wordsTyped = currentInput.length / 5;
      setWpm(Math.floor(wordsTyped / timeElapsed));
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-12 bg-slate-900 rounded-xl border border-slate-800 text-center">
        <p className="text-blue-400 font-semibold text-lg animate-pulse">
          Fetching scripture from the backend...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-red-950/40 rounded-xl border border-red-800 text-center">
        <p className="text-red-400 font-semibold mb-2">Error connecting to server</p>
        <p className="text-slate-400 text-sm mb-4">{error}</p>
        <button
          onClick={fetchRandomVerse}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-semibold transition-colors"
        >
          Try Reconnecting
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="max-w-3xl mx-auto p-8 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 cursor-text"
    >
      {/* Verse Reference Tag */}
      {verseData && (
        <div className="mb-6 flex justify-between items-center border-b border-slate-800 pb-3">
          <span className="text-sm font-semibold tracking-wide text-blue-400 uppercase">
            {verseData.book} {verseData.chapter}:{verseData.verseNum} (KJV)
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              fetchRandomVerse();
            }}
            className="text-xs text-slate-400 hover:text-white px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
          >
            Random Verse ↻
          </button>
        </div>
      )}

      {/* Stats display */}
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

      {/* Typing Display Area */}
      <div className="relative text-2xl leading-relaxed font-mono mb-8 select-none">
        <div className="text-slate-700">
          {currentVerseText}
        </div>

        <div className="absolute top-0 left-0">
          {userInput.split('').map((char, index) => {
            const isCorrect = char === currentVerseText[index];
            return (
              <span
                key={index}
                className={isCorrect ? "text-emerald-400" : "text-red-500 bg-red-900/30"}
              >
                {currentVerseText[index]}
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
          <div className="flex justify-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetState();
              }}
              className="px-5 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors font-semibold"
            >
              Retry Verse
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                fetchRandomVerse();
              }}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors font-semibold"
            >
              Next Verse →
            </button>
          </div>
        </div>
      )}

      {!isFinished && (
        <p className="text-slate-500 text-sm text-center italic mt-4">
          Click anywhere in this box and start typing to begin...
        </p>
      )}
    </div>
  );
};

export default TypingEngine;