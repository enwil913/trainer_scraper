import Head from "next/head";
import React from "react";
import TrainerResults from "../components/TrainerResults";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Trainer Scraper</title>
        <meta
          name="description"
          content="Trainers"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <TrainerResults />
    </div>
  );
}

