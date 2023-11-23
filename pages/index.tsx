import React from "react";
import Header from "../components/Header";
import TrainerResults from "../components/TrainerResults";

export default function Home() {
  return (
    <div className="container">
      <Header title={'手影...'} version={'v1.xx'}/>
      <TrainerResults />
    </div>
  );
}

