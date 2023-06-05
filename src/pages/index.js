import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import Main from "../../components/Main";
import { useEffect, useState } from "react";

export default function Home() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!showContent) {
    return (
      <div>
        <Main />
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>WeChat</title>
        <meta name="description" content="Wechat - CsCodeway" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex">
        <div>{showContent ? <Sidebar /> : null}</div>
        <div className="hidden sm:flex items-center w-full justify-center h-screen">
          <p className="text-gray-300 font-medium text-4xl ">W E - C H A T</p>
        </div>
      </main>
    </>
  );
}
