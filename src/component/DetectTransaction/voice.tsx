import toast from "react-hot-toast";
import { Mic, MicOff } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition, } from "react-speech-recognition";

export default function VoiceTransaction() {
    const { transcript, listening, browserSupportsSpeechRecognition, resetTranscript, } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <p>Trình duyệt không hỗ trợ nhận diện giọng nói</p>;
    }

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

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-2 rounded-lg border ${listening ? "bg-red-500 text-white" : "border-zinc-800"
                    }`}>
                {listening ? (<MicOff size={18} />) : (<Mic size={18} />)}
            </button>

            {transcript && (<p className="text-sm">  {transcript} </p>
            )}
        </div>
    );
}