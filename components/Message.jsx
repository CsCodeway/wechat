import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import moment from "moment/moment";
import Image from "next/image";

const Message = ({ user, message }) => {
  const [userLoggedIn] = useAuthState(auth);
  const isMine = userLoggedIn.email === user;

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
            <>
              <Image
                className="bg-white"
                src={message.imageURL}
                width={200}
                height={200}
                alt=""
              />
              <p className="pt-2 pl-1">{message.message}</p>
            </>
          ) : (
            <p>{message.message}</p>
          )}
          <p className=" pt-1 text-[11px] bottom-0 text-right right-0">
            {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
          </p>
        </div>
      </div>
    </>
  );
};

export default Message;
