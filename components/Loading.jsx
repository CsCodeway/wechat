import BarLoader from "react-spinners/BarLoader";
import logo from "../public/logo.png";
import Image from "next/image";
import Head from "next/head";

const Loading = () => {
  return (
    <>
    <Head>
        <title>Loading...</title>
        <meta name="description" content="wechat" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=1, maximum-scale=1"
        />
      </Head>
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col gap-y-20 items-center justify-center">
          <Image src={logo} alt="" width={150} height={150} />
          <BarLoader color="#6b79ca" width={150} />
        </div>
      </div>
    </>
  );
};
export default Loading;
