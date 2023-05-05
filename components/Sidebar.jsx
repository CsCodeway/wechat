import {
  DotsHorizontalIcon,
  PencilAltIcon,
  SearchIcon,
} from "@heroicons/react/outline";
import { VideoCameraIcon } from "@heroicons/react/solid";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import * as EmailValidator from "email-validator";
import ChatBox from "./ChatBox";
import { useRouter } from "next/router";
import Image from "next/image";

const Sidebar = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  const createChat = () => {
    const inputPrompt = prompt("Enter email");
    if (!inputPrompt) return null;
    if (
      EmailValidator.validate(inputPrompt) &&
      !chatAlreadyExists(inputPrompt) &&
      inputPrompt !== user.email
    ) {
      db.collection("chats").add({
        users: [user.email, inputPrompt],
      });
    }
  };

  const chatAlreadyExists = (recipientEmail) =>
    !!chatsSnapshot?.docs.find((chat) =>
      chat.data().users.find((user) => user === recipientEmail)
    );

  const handleSignOut = () => {
    auth.signOut();
    router.replace("/");
  };

  return (
    <div className="flex flex-col w-[350px] overflow-hidden h-[100vh] border-r border-[#f5f5f5]">
      <div className="flex flex-col pb-3">
        <div className="flex p-3">
          <p className="flex-1 text-2xl">Chats</p>
          <div className="flex space-x-2">
            
          <Image
            src={user.photoURL}
            width={40}
            height={40}
            alt=""
            className="bg-[#F5F5F5] rounded-full cursor-pointer"
          />
    
            <PencilAltIcon
              onClick={createChat}
              height={40}
              width={40}
              className="bg-[#F5F5F5] rounded-full p-2 cursor-pointer"
            />
            <DotsHorizontalIcon
              onClick={handleSignOut}
              height={40} 
              width={40}
              className="bg-[#F5F5F5] rounded-full p-2 cursor-pointer"
            />
          </div>
        </div>
        <div className="flex items-center bg-gray-200 rounded-full pl-2 mx-4">
          <SearchIcon height={20} width={20} />
          <input
            type="text"
            placeholder="Search Messenger"
            className="flex ml-2 items-center h-9 bg-transparent outline-none placeholder-gray-500 dark:text-black flex-shrink"
          />
        </div>
      </div>
      <div className="flex flex-col overflow-y-scroll h-[100vh]">
        {/* list of chats */}
        {chatsSnapshot?.docs.map((chat) => {
          return (
            <ChatBox key={chat.id} id={chat.id} users={chat.data().users} />
          );
        })}
      </div>
    </div>
  );
};
export default Sidebar;
