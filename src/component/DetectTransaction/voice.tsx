import { Mic, MicOff, Send, Loader2 } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition, } from "react-speech-recognition";
import { useEffect, useState } from "react";
import { test } from '../../services/gemini-chat'
import { useCategoryStore } from '../../store/useCategoryStore';

import toast from "react-hot-toast";

import type { ICreateTransaction } from '../../types/Transactions'
interface VoiceTransactionProps {
    onParsed?: (data: ICreateTransaction ) => void;
}

export default function VoiceTransaction({ onParsed }: VoiceTransactionProps) {
    const { categories } = useCategoryStore();
    const { listening, browserSupportsSpeechRecognition, resetTranscript, finalTranscript } = useSpeechRecognition();
    const [text, setText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    if (!browserSupportsSpeechRecognition) {
        return <p>Trình duyệt không hỗ trợ nhận diện giọng nói</p>;
    }
    useEffect(() => {
        if (finalTranscript) {
            setText(finalTranscript);
        }
    }, [finalTranscript]);

    const handleVoiceInput = async () => {
        try {
            if (listening) {
                SpeechRecognition.stopListening();
            } else {
                resetTranscript();
                await SpeechRecognition.startListening({
                    language: "vi-VN",
                    continuous: false,
                });
            }
        } catch (error) {
            toast.error("Không thể sử dụng microphone");
        }
    };
    const handleSend = async () => {
        setIsAnalyzing(true);
        try {
            const aiText = await test(text, categories);
            const cleanedText = aiText.result
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();

            const data = JSON.parse(cleanedText);

            console.log("AI Response:", data);
            console.log("AI Response:", typeof (data));
            onParsed?.(data);
            toast.success("Phân tích thành công!");
        } catch (err) {
            console.error(err);
            toast.error("Có lỗi xảy ra khi phân tích.");
        } finally {
            setIsAnalyzing(false);
        }
    };
    return (
        <div className="flex flex-col gap-2 p-3 border border-zinc-800 rounded-xl w-full max-w-4xl mx-auto my-2">
            {/* Top row: mic + status */}
            <div className="flex items-center justify-between ">
                <button
                    disabled={isAnalyzing}
                    type="button"
                    onClick={handleVoiceInput}
                    className={` w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 
                        ${listening ? "bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse" : "border border-zinc-700 hover:border-zinc-500"}`}>
                    {listening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>


                <input disabled={isAnalyzing} type="text" className="ml-2 w-full bg-transparent outline-none text-sm text-state-900" value={text} onChange={(e) => setText(e.target.value)} placeholder={listening ? "Đang lắng nghe..." : "Nhập hoặc nói..."} />
                {isAnalyzing ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <Send onClick={() => { handleSend() }} size={18} className={text.trim() ? "translate-x-[1px]" : ""} />
                )}
            </div>
            {isAnalyzing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

                    <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-zinc-900 border border-zinc-700 shadow-xl">

                        <Loader2 size={28} className="animate-spin text-blue-400" />

                        <p className="text-sm text-zinc-200">
                            Đang phân tích với AI...
                        </p>

                        <p className="text-xs text-zinc-400">
                            Vui lòng chờ trong giây lát
                        </p>
                    </div>

                </div>
            )}
        </div>
    );
}