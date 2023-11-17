import Head from "next/head";
import React from "react";
import Schedule from "../components/Schedule";
import TrainerResults from "../components/TrainerResults";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Trainer Scraper</title>
        <meta
          name="description"
          content="Trainer Result"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <TrainerResults />
    </div>
  );
}

