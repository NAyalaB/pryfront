import React from "react";
import Image from "next/image";
import Link from "next/link";

const AnimacionLogo = () => {
  return (
    <div className="flex flex-col justify-center items-center mt-6 mb-6">
      <h1 className="mt-4 mb-16 font-sacramento text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-center">
        Gourmet Affair
      </h1>
      <div
        aria-label="container-imagen"
        className="relative flex justify-center items-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto"
      >
        <Link href="/home">
          <Image
            className="w-full h-full object-contain drop-shadow-custom animate-rotate-y cursor-pointer"
            src="/assets/logoCocinero2.png"
            alt="Logo"
            width={300}
            height={230}
            layout="intrinsic"
          />
        </Link>
      {/*   <div
          aria-label="botton"
          className="flex justify-center items-center w-[80%] h-[20px] absolute bottom-[-10px] bg-gray-500 rounded-full shadow-inset-custom"
        >
          <div className="w-[60%] h-[15px] bg-gray-300 rounded-full shadow-inset-custom blur-[10px]"></div>
        </div> */}
      </div>
    </div>
  );
};

export default AnimacionLogo;
