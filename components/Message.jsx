import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import moment from "moment/moment";
import Image from "next/image";
import { useState } from "react";
import { XIcon } from "@heroicons/react/outline";

const Message = ({ user, message }) => {
  const [userLoggedIn] = useAuthState(auth);
  const isMine = userLoggedIn.email === user;

  const [showPopup, setShowPopup] = useState(false);
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <>
      <div className={`flex py-2 ${isMine ? "justify-end" : "justify-start"}`}>
        <div
          className={`inline-block p-2 rounded-lg max-w-[350px] ${
            isMine
              ? "bg-blue-500 text-white rounded-br-none"
              : "bg-gray-200 text-gray-800 rounded-bl-none"
          }`}
        >
          {message.imageURL ? (
            <Image
              onClick={togglePopup}
              className="bg-white cursor-pointer"
              src={message.imageURL}
              width={200}
              height={200}
              alt=""
            />
          ) : (
            ""
          )}
          {message.audioURL ? <audio src={message.audioURL} controls /> : ""}
          <p>{message.message}</p>
          <p className=" pt-1 text-[11px] bottom-0 text-right right-0">
            {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
          </p>
        </div>
      </div>
      {showPopup && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-[1000] bg-black bg-opacity-60 flex flex-col justify-center items-center p-1 opacity-100 transition">
          <button
            className="text-white fixed top-20 right-20 z-[1000] flex text-xl"
            onClick={togglePopup}
          >
            <XIcon width={35} height={35} />
          </button>
          <Image src={message.imageURL} width={350} height={350} alt="" />
        </div>
      )}
    </>
  );
};

export default Message;
