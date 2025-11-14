import {type Dispatch, type SetStateAction, useEffect, useState} from 'react';

function QuestionAnswer({fingerCount, setAnswers}: { fingerCount: number, setAnswers: Dispatch<SetStateAction<number>> }) {
    const [question, setQuestion] = useState<{ a: number, b: number, tip: "add" | "sub" }>();
    const [bgColor, setBgColor] = useState<"red" | "blue" | "green">("green");
    const [lastAnswer, setLastAnswer] = useState<number>(0);
    const questionGenerator = () => {
        const a = Math.floor(Math.random() * 5);
        const b = Math.floor(Math.random() * 5);
        if (a + b > 5) {
            if (a > b) {
                if (a - b == lastAnswer) return questionGenerator();
                return setQuestion({a, b, tip: "sub"});
            } else {
                if (b - a == lastAnswer) return questionGenerator();
                return setQuestion({a: b, b: a, tip: "sub"},
                );
            }
        } else {
            if (a + b == lastAnswer) return questionGenerator();
            return setQuestion({a, b, tip: "add"});
        }
    };
    const answerCheck = (ans: number, a: number, b: number, tip: "add" | "sub") => {
        let cans;
        if (tip == "add") cans=a + b;
        else cans= a - b;
        if(cans==ans){
            setLastAnswer(ans)
        }
        return cans==ans
    };

    useEffect(() => {
        if (bgColor == 'green') {
            setBgColor('blue');
            questionGenerator();
        }
    }, [bgColor]);

    useEffect(() => {
        if (fingerCount >= 0 && question) {
            const bool = answerCheck(fingerCount, question.a, question.b, question?.tip);
            setBgColor(bool ? 'green' : 'red');
            setAnswers(prev => prev + 1);
        }
    }, [fingerCount, setAnswers]);
    return (
        <div
            className={`w-full max-w-lg p-10 rounded-3xl shadow-xl text-center 
                transition-all duration-300 text-4xl font-bold 
                ${bgColor === "green" ? "bg-green-300" :
                bgColor === "red" ? "bg-red-300" :
                    "bg-blue-300"}`}
        >
            <h1 className="text-2xl font-semibold text-gray-700">
                Detected Fingers:
            </h1>
            <p className="text-6xl mt-2 text-gray-900">{fingerCount}</p>

            <h2 className="text-2xl mt-6 text-gray-700">Solve:</h2>

            {question && (
                <p className="text-6xl mt-4 text-gray-900">
                    {question.a} {question.tip === "sub" ? "-" : "+"} {question.b}
                </p>
            )}
        </div>

    );
}

export default QuestionAnswer;