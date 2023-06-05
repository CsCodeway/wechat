import Image from "next/image";
import {
  ArrowLeftIcon,
  InformationCircleIcon,
  PhoneIcon,
  PlusCircleIcon,
  VideoCameraIcon,
} from "@heroicons/react/solid";
import { useEffect, useRef, useState } from "react";
import {
  ArrowCircleRightIcon,
  EmojiHappyIcon,
  MicrophoneIcon,
  PhotographIcon,
} from "@heroicons/react/outline";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import getRecipientEmail from "../utils/getRecipientEmail";
import Message from "./Message";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import ReactScrollableFeed from "react-scrollable-feed";
import TimeAgo from "timeago-react";
import { v4 as uuidv4 } from "uuid";
import EmojiPicker, { SuggestionMode } from "emoji-picker-react";
import MicRecorder from "mic-recorder-to-mp3";
import Head from "next/head";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const ChatScreen = ({ chat, messages }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const [user] = useAuthState(auth);
  const [text, setText] = useState("");
  const filepickerRef = useRef(null);
  const [imageToPost, setImageToPost] = useState(null);
  const router = useRouter();
  const chatRef = useRef();
  const [showPopup, setShowPopup] = useState(false);
  const [messageSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );
  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );
  const showMessages = () => {
    if (messageSnapshot) {
      return messageSnapshot.docs.map((message) => {
        return (
          <Message
            key={message.id}
            user={message.data().user}
            message={{
              ...message.data(),
              timestamp: message.data().timestamp?.toDate().getTime(),
            }}
          />
        );
      });
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const handleOnEnter = async (e) => {
    e.preventDefault();
    const messageData = {
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: text,
      user: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
    };

    if (imageToPost) {
      // Upload image to Firebase Storage
      const storageRef = firebase.storage().ref("chats");
      const imageRef = storageRef.child(`${router.query.id}/${uuidv4()}.jpg`);
      const imageSnapshot = await imageRef.putString(imageToPost, "data_url");

      // Add image URL to message data
      messageData.imageURL = await imageSnapshot.ref.getDownloadURL();

      removeImage();
      setShowPopup(false);
    }

    if (audioBlob) {
      // Upload audio to Firebase Storage
      const storageRef = firebase.storage().ref("chats");
      const audioRef = storageRef.child(`${router.query.id}/${uuidv4()}.mp3`);
      const audioSnapshot = await audioRef.put(audioBlob);

      // Add audio URL to message data
      messageData.audioURL = await audioSnapshot.ref.getDownloadURL();

      setAudioBlob(null);
      setIsRecording(false);
    }

    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .add(messageData);

    setText("");
  };

  const handleStartRecording = () => {
    Mp3Recorder.start().then(() => {
      setIsRecording(true);
      setIsBlinking(true);
    });
  };

  const handleStopRecording = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        setAudioBlob(blob);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setIsRecording(false);
        setIsBlinking(false);
      });
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);

  const scrollToBottom = () => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addImageToPost = (e) => {
    const reader = new FileReader();
    const maxSize = 10 * 1024 * 1024; // 5MB

    if (e.target.files[0]) {
      const fileSize = e.target.files[0].size;

      if (fileSize > maxSize) {
        alert("File size is too large");
        return;
      }

      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setImageToPost(readerEvent.target.result);
    };
  };

  const removeImage = () => {
    setImageToPost(null);
  };

  const sendIndex = () => {
    router.replace(`/`);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const onEmojiClick = (data) => {
    setText(text + data.emoji);
  };

  return (
    <>
      <Head>
        <title>{recipient?.name ? recipient?.name : recipientEmail}</title>
        <meta name="description" content="wechat" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=1, maximum-scale=1"
        />
      </Head>
      <div className="flex flex-col h-screen flex-1">
        <div className="flex items-center p-2 bg-white border border-[#f5f5f5] top-0 sticky">
          <ArrowLeftIcon
            width={25}
            height={25}
            className="mx-2 flex lg:hidden cursor-pointer"
            onClick={sendIndex}
          />
          {recipient?.photoURL ? (
            <Image
              src={recipient.photoURL}
              width={55}
              height={55}
              alt=""
              className="bg-[#F5F5F5] rounded-full"
            />
          ) : (
            <div className="bg-[#F5F5F5] w-10 h-10 rounded-full flex justify-center items-center text-xl font-medium">
              {recipientEmail.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex justify-center flex-col flex-1 ml-3">
            <p className="text-xl font-medium max-sm:text-sm">
              {recipient?.name ? recipient?.name : recipientEmail}
            </p>
            <div className="flex gap-1 text-sm ml-1 max-sm:text-[10px]">
              {recipientSnapshot ? (
                <>
                  <p>Last active: </p>
                  <p>
                    {recipient?.lastSeen.toDate() ? (
                      <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                    ) : (
                      "Unavailable"
                    )}
                  </p>
                </>
              ) : (
                <p>Loading last active...</p>
              )}
            </div>
          </div>
          <div className="flex gap-3 text-blue-500">
            <PhoneIcon height={30} width={30} className="cursor-pointer" />
            <VideoCameraIcon
              height={30}
              width={30}
              className="cursor-pointer"
            />
            <InformationCircleIcon
              height={30}
              width={30}
              className="cursor-pointer"
            />
          </div>
        </div>
        <div
          className="flex-1 items-center justify-center overflow-y-auto px-5 pt-3 h-full"
          ref={chatRef}
        >
          <ReactScrollableFeed>{showMessages()}</ReactScrollableFeed>
          {showPopup && (
            <div className="fixed bottom-0 ">
              <EmojiPicker
                theme="auto"
                onEmojiClick={onEmojiClick}
                suggestedEmojisMode={SuggestionMode.RECENT}
              />
            </div>
          )}
        </div>
        <form
          className="relative flex items-center bg-white text-blue-600 border border-t-[#f5f5f5] custom-input-emoji"
          style={{
            height: "calc(100vh - 4rem)",
            position: "sticky",
            bottom: 0,
          }}
        >
          <PlusCircleIcon width={40} height={40} className="cursor-pointer" />
          <PhotographIcon
            width={40}
            height={40}
            className="cursor-pointer"
            onClick={() => filepickerRef.current.click()}
          />
          <input
            ref={filepickerRef}
            type="file"
            onChange={addImageToPost}
            accept="image/*"
            hidden
          />
          {imageToPost && (
            <div
              onClick={removeImage}
              className="flex flex-col p-2 filter-none hover:brightness-110 transition duration-150 transform hover:scale-105 cursor-pointer"
            >
              <img className="h-10 object-contain" src={imageToPost} alt="/" />
              <p className="text-xs text-red-500 text-center">Remove</p>
            </div>
          )}
          <EmojiHappyIcon
            height={40}
            width={40}
            className="cursor-pointer"
            onClick={togglePopup}
          />
          <textarea
            rows={1}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message"
            className="w-full px-4 py-2 border text-gray-700 border-gray-100 text-lg rounded-full outline-none resize-none"
            // style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
          />
          {text.trim() || imageToPost || audioBlob ? (
            <ArrowCircleRightIcon
              type="submit"
              onClick={handleOnEnter}
              width={40}
              height={40}
              className="cursor-pointer bg-[#f5f5f5] rounded-full"
            />
          ) : (
            ""
          )}
          {isRecording ? (
            <div
              className={`cursor-pointer text-sm pl-3 pr-0 ${
                isBlinking ? "blink" : ""
              }`}
              onClick={handleStopRecording}
            >
              Stop recording
            </div>
          ) : (
            <MicrophoneIcon
              width={37}
              height={37}
              className="cursor-pointer"
              onClick={handleStartRecording}
            />
          )}
        </form>
      </div>
    </>
  );
};
export default ChatScreen;
