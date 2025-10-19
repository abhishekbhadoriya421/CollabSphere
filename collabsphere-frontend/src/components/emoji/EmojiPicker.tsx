import React from "react";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";

interface Props {
    handleCloseEmoji: () => void
    handleSelectEmoji: (emoji: EmojiClickData) => void
}

const EmojiPickerComponent: React.FC<Props> = ({ handleCloseEmoji, handleSelectEmoji }) => {
    return (
        <div
            className="absolute bottom-14 left-0 bg-white border rounded-xl shadow-lg z-50 overflow-hidden"
            style={{ width: "320px", height: "380px" }}
        >
            {/* Header with Close Button */}
            <div className="flex justify-between items-center px-3 py-2 border-b bg-gray-50">
                <span className="font-semibold text-gray-600">Select Emoji</span>
                <button
                    onClick={() => handleCloseEmoji()}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ✖
                </button>
            </div>

            {/* Emoji Picker Body */}
            <div className="overflow-y-auto" style={{ height: "340px" }}>
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