import React from "react";
import { Recorder } from "react-voice-recorder";
import { IChatAudio } from "../index";

const ChatAudio = ({
  selectedContact,
  handleAudioUpload,
  setAudioState,
  audioState,
}: IChatAudio) => {
  //Methods for handlers
  const handleAudioStop = (data: any) => {
    console.log(data);
    const randomFilename = `ichat-audio_${Math.floor(
      Math.random() * 1000 * 5
    )}.wav`;
    const file = new File([data.blob], randomFilename);
    setAudioState({ audioDetails: file });
  };

  return (
    <div className="footer-options audio-container">
      <Recorder
        record={true}
        title={`You are about to send a voice note to @${selectedContact.contactRecipient}`}
        audioURL={audioState.audioDetails.url}
        handleAudioStop={(data: any) => handleAudioStop(data)}
        handleAudioUpload={(data: any) => handleAudioUpload(data)}
      />
    </div>
  );
};

export default ChatAudio;
