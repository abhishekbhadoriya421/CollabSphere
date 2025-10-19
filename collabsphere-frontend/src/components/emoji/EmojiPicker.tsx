import React from "react";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

const EmojiPicker: React.FC = () => {
    return (
        <div className="absolute bottom-12 right-0 z-50">
            <Picker
            />
        </div>
    );
}

export default EmojiPicker;