import FrontPage from "@components/FrontPage";
import React from "react";
import Head from "next/head"

export default function Home():JSX.Element {
  return (
    <>
    <Head>
      <title>WCA Mapping Utils</title>
    </Head>
    <main>
      <FrontPage/>
      <div className="absolute right-0 bottom-0 w-1/2 h-1/2" id="locationStats"></div>
    </main>
    </>
  );
}
