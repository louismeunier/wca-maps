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
    </main>
    </>
  );
}
