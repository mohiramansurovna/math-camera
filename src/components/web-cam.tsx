import {useEffect, useRef} from 'react';
import Webcam from 'react-webcam';
import {HandLandmarker, FilesetResolver, type HandLandmarkerResult} from "@mediapipe/tasks-vision";

function WebCam({setFingerCount}: { setFingerCount: (fingerCount: number) => void }) {
    const webcamRef = useRef<Webcam | null>(null);
    let lastValue = 0;
    let stableValue = 0;
    let lastChangeTime = Date.now();
    const updateStableFinger = (value: number) => {
        if (value !== lastValue) {
            lastValue = value;
            lastChangeTime = Date.now();
        }
        const now = Date.now();
        if (now - lastChangeTime >= 1000) {
            if (stableValue !== lastValue) {
                stableValue = lastValue;
                setFingerCount(stableValue);
            }
        }
    };
    useEffect(() => {
        let handLandmarker: HandLandmarker | null = null;
        const loadModel = async () => {
            const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm");
            handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {modelAssetPath: "/models/hand_landmarker.task"},
                runningMode: "VIDEO",
                numHands: 1,
            });
            startDetection(handLandmarker);
        };
        loadModel();
    }, []);
    const startDetection = (handLandmarker: HandLandmarker) => {
        const detectFrame = () => {
            if (webcamRef.current?.video && webcamRef.current.video.readyState === 4) {
                const video = webcamRef.current.video;
                const results: HandLandmarkerResult = handLandmarker.detectForVideo(video, performance.now());
                if (results.landmarks?.length) {
                    const count = countFingers(results.landmarks[0]);
                    updateStableFinger(count);
                }
            }
            setTimeout(detectFrame, 100);
        };
        detectFrame();
    };
    const countFingers = (lms: { x: number; y: number; z: number }[]) => {
        const tips = [8, 12, 16, 20];
        const pips = [6, 10, 14, 18];
        let count = 0;
        for (let i = 0; i < 4; i++) {
            if (lms[tips[i]].y < lms[pips[i]].y) count++;
        }
        if (lms[4].x > lms[3].x) count++;
        return count;
    };
    return (
        <Webcam ref={webcamRef} width={400} height={356} className="w-[400px] h-[356px] rounded-xl shadow-lg border border-gray-300 object-cover"/>);
}

export default WebCam;