import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../firebase";
import getRecipientEmail from "../../../utils/getRecipientEmail";
import ChatScreen from "../../../components/ChatScreen";
import Sidebar from "../../../components/Sidebar";
import { useCollection } from "react-firebase-hooks/firestore";

const Chat = ({ chat, messages }) => {
  const [user] = useAuthState(auth);
  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);

  return (
    <>
      <div>
        <title>
          Chat with - ({recipient?.name ? recipient?.name : recipientEmail})
        </title>
      </div>
        <div className="flex">
          <div className="hidden lg:flex">
            <Sidebar />
          </div>
          <ChatScreen chat={chat} messages={messages} />
        </div>
    </>
  );
};
export default Chat;

export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id);

  // prep the messages on the server
  const messagesRes = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();
  const messages = messagesRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));
  // prep the chat
  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}
