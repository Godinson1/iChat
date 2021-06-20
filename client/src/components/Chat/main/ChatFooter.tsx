import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/client";
import Picker, { IEmojiData } from "emoji-picker-react";
import { ChatAudio } from ".";
import { SEND_MESSAGE, SEND_AUDIO_MESSAGE, IChatHeaderFooter } from "../index";
import { setErrorMessage } from "../../../redux";

const ChatFooter = ({ selectedContact }: IChatHeaderFooter) => {
  const [message, setMessage] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);
  const [startRecord, setStartRecord] = useState(false);
  const [audioState, setAudioState] = useState({
    audioDetails: {
      url: "",
      blob: null,
      chunks: [],
      duration: {
        h: 0,
        m: 0,
        s: 0,
      },
    },
  });

  const dispatch = useDispatch();

  const onEmojiClick = (
    event: React.MouseEvent<Element, MouseEvent>,
    data: IEmojiData
  ) => {
    setMessage(message + `${data.emoji}`);
  };

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: () => setMessage(""),
  });

  const [sendAudioMessage] = useMutation(SEND_AUDIO_MESSAGE, {
    onError: (err) => dispatch(setErrorMessage(err.message)),
  });

  const handleSubmitMessage = () => {
    if (message.trim() !== "") {
      setOpenEmoji(false);
      sendMessage({
        variables: { to: selectedContact.contactRecipient, content: message },
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && message.trim() !== "") {
      setOpenEmoji(false);
      sendMessage({
        variables: { to: selectedContact.contactRecipient, content: message },
      });
    }
  };

  const handleAudioUpload = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const randomFilename = `ichat-audio_${Math.floor(
      Math.random() * 1000 * 5
    )}.wav`;
    const file = new File(
      [audioState.audioDetails.blob as unknown as BlobPart],
      randomFilename
    );
    setStartRecord(false);
    sendAudioMessage({
      variables: { file, to: selectedContact.contactRecipient },
    });
  };

  return (
    <div className="main-footer">
      {startRecord && (
        <ChatAudio
          handleAudioUpload={handleAudioUpload}
          selectedContact={selectedContact}
          setAudioState={setAudioState}
          audioState={audioState}
        />
      )}
      {openEmoji && (
        <div className="footer-options emoji-container">
          <div>
            <Picker
              pickerStyle={{ width: "100%", color: "red" }}
              onEmojiClick={onEmojiClick}
            />
          </div>
        </div>
      )}
      <div className="footer-container">
        <div>
          <div className="active-chats-header-options">...</div>
        </div>
        <div className="input-container">
          <div className="message-input-container">
            <input
              onKeyDown={handleKeyDown}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type to send a new message"
              value={message}
            />
          </div>
          <div onClick={handleSubmitMessage} className="send-message">
            {message.trim() !== "" ? "Send" : ""}
          </div>
        </div>
        <div
          style={{ color: openEmoji ? "rgb(78, 78, 236)" : "" }}
          onClick={() => {
            setStartRecord(false);
            setOpenEmoji(!openEmoji);
          }}
          className="emoji-icon"
        >
          &#9786;
        </div>
        <div
          style={{ color: openEmoji ? "rgb(78, 78, 236)" : "" }}
          className="audio-icon"
          onClick={() => {
            setOpenEmoji(false);
            setStartRecord(!startRecord);
          }}
        >
          {startRecord ? (
            <div className="audio-icon-send red">x</div>
          ) : (
            <img src="/images/mic.png" alt="record" />
          )}
        </div>
        {startRecord && (
          <div onClick={handleAudioUpload} className="audio-icon-send green">
            &#10003;
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatFooter;
