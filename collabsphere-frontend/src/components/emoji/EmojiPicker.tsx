import React, { useRef } from "react";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { useClickOutside } from "../customHooks/useClickOutside";

interface Props {
    handleCloseEmoji: () => void
    handleSelectEmoji: (emoji: EmojiClickData) => void
}

const EmojiPickerComponent: React.FC<Props> = ({ handleCloseEmoji, handleSelectEmoji }) => {
    const pickerRef = useRef<HTMLDivElement>(null);
    useClickOutside(pickerRef, () => handleCloseEmoji());

    return (
        <div
            className="absolute bottom-14 left-0 bg-white border rounded-xl shadow-lg z-50 overflow-hidden"
            style={{ width: "320px", height: "380px" }}
        >
            <div
                ref={pickerRef}
                className="overflow-y-auto hover:out-of-range:"
                style={{ height: "340px" }}>
                <EmojiPicker
                    onEmojiClick={(emojiData: EmojiClickData) => {
                        handleSelectEmoji(emojiData);
                    }}
                    width="100%"
                    height="100%"
                />
            </div>
        </div>
    );
}

export default EmojiPickerComponent;