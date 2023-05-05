import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import getRecipientEmail from "../utils/getRecipientEmail";
import Image from "next/image";

const ChatBox = ({ id, users }) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", getRecipientEmail(users, user))
  );
  const enterChat = () => {
    router.replace(`/chat/${id}`);
  };
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(users, user);
  return (
    <>
      <div
        className="flex cursor-pointer items-center gap-2 px-2 py-1 shadow-md my-0.5 border border-[#f5f5f5]"
        onClick={enterChat}
      >
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
        <div>
          <p className="text-lg font-medium">
            {recipient?.name ? recipient?.name : recipientEmail}
          </p>
          <p className="text-sm">
            {recipient?.name ? recipientEmail : recipient?.name}
          </p>
        </div>
      </div>
    </>
  );
};
export default ChatBox;
