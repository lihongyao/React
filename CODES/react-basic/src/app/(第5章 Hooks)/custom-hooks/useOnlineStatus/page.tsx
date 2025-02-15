"use client";

import { useOnlineStatus } from "@/hooks";
import React from "react";

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? "✅ Online" : "❌ Disconnected"}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  const handleSaveClick = () => {
    console.log("✅ Progress saved");
  };

  return (
    <button disabled={!isOnline} onClick={handleSaveClick} className="bg-blue-500 text-white px-2">
      {isOnline ? "Save progress" : "Reconnecting..."}
    </button>
  );
}

export default function Page() {
  return (
    <div>
      <StatusBar />
      <SaveButton />
    </div>
  );
}
