import {useEffect, useRef, useState} from "react";
import QuestionAnswer from './components/question-answer.tsx';
import WebCam from './components/web-cam.tsx';

function App() {
    const [fingerCount, setFingerCount] = useState<number>(0);
    const [answers, setAnswers] = useState<number>(0);
    const [time, setTime] = useState<number>(0);
    const [highestAnswers, setHighestAnswers] = useState<number>(0);
    const [playing, setPlaying] = useState<boolean>(false);
    const timerRef = useRef<number|undefined>(undefined);
    const play = () => {
        if (playing) return;
        if(timerRef.current) clearTimeout(timerRef.current);
        setPlaying(true);
        setTime(10);
        setAnswers(0);
        timerRef.current = setInterval(() => {
            setTime(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timerRef.current);
    };
    useEffect(() => {
        if (time == 0) {
            setPlaying(false);
            setHighestAnswers(Math.max(answers, highestAnswers));
        }
    }, [time]);
    return (
        <main className="h-screen w-screen bg-gray-100 flex flex-col text-gray-900">

            {/* Header */}
            <header className="w-full py-4 bg-white shadow flex justify-center gap-12 text-xl font-semibold">
                <div className="flex items-center gap-2">
                    ⏳
                    <span className="font-mono bg-gray-200 px-3 py-1 rounded">
                        {time}s
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    ✅ Correct:
                    <span className="font-mono bg-green-200 px-3 py-1 rounded">
                        {answers}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    🏆 Record:
                    <span className="font-mono bg-yellow-200 px-3 py-1 rounded">
                        {highestAnswers}
                    </span>
                </div>
            </header>

            {/* GAME AREA */}
            {playing ? (
                <div className="flex flex-row flex-1 overflow-hidden">

                    {/* QUESTION SIDE */}
                    {playing && <div className="flex-1 flex justify-center items-center p-6">
                        <QuestionAnswer
                            fingerCount={fingerCount}
                            setAnswers={setAnswers}
                        />
                    </div>}

                    {/* CAMERA SIDE */}
                    <div className="flex-1 flex justify-center items-center bg-gray-200">
                        <WebCam setFingerCount={setFingerCount}/>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col flex-1 justify-center items-center text-center">
                    {highestAnswers !== 0 ? (
                        <>
                            <p className="text-4xl font-bold">⏰ Time is over!</p>

                            {highestAnswers==answers && (
                                <p className="text-5xl mt-4 bg-yellow-300 px-5 py-2 rounded-xl font-semibold shadow">
                                    New Record 🎉
                                </p>
                            )}

                            <p className="text-green-600 mt-6 text-3xl font-semibold">
                                Your score: {answers}
                                <br/>
                                Record: {highestAnswers}
                            </p>
                        </>):<div>
                        <p className='text-blue-500 font-semibold text-5xl'>
                            Welcome to Math and Camera game :)</p>
                        <p className='text-3xl my-4 text-gray-700'>
                            In 10 seconds how many simple math questions can u solve?
                            <br/>
                            Show the answer to the camera with your fingers ✌️, use only one hand.
                            <br/>
                            Do not show your other hand on the camera
                        </p>
                    </div>}

                    <button
                        className="mt-10 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xl shadow"
                        onClick={() => {
                            setPlaying(false);
                            play();
                        }}
                    >
                        Play
                    </button>
                </div>
            )}

        </main>
    );
}

export default App;
