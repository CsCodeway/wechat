import Head from "next/head";
import logo from "../../public/logo.png";
import Image from "next/image";
// import { Button } from "@mui/material";
import { auth, provider } from "../../firebase";

const Login = () => {
  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert);
  };
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <Head>
          <title>Login</title>
        </Head>
        <div className="flex flex-col items-center justify-center gap-y-20">
          <Image src={logo} alt="" height={150} width={150} />
          <button className="bg-blue-400 rounded-full text-white px-4 py-2 text-lg font-medium flex items-center justify-center" onClick={signIn} >
            Sign in with google
          </button>
        </div>
      </div>
    </>
  );
};
export default Login;
