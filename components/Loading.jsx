import BarLoader from "react-spinners/BarLoader";
import logo from "../public/logo.png";
import Image from "next/image";

const Loading = () => {
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div>
          <title>Loading...</title>
        </div>
        <div className="flex flex-col gap-y-20 items-center justify-center">
          <Image src={logo} alt="" width={150} height={150} />
          <BarLoader color="#6b79ca" width={150} />
        </div>
      </div>
    </>
  );
};
export default Loading;
