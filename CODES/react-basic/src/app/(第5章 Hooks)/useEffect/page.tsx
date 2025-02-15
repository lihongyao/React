"use client";
import React from "react";

export default function page() {
  const [userId, setUserId] = React.useState(1);
  const [data, setData] = React.useState<Record<string, any> | null>(null);
  React.useEffect(() => {
    const getData = async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      const json = await response.json();
      if (!ignore) setData(json);
    };

    let ignore = false;
    getData();
    
    return () => {
      ignore = true;
    };
  }, [userId]);

  return (
    <div className="p-4">
      <p>Name: {data?.name}</p>
      <p>Email: {data?.email}</p>
      <button className="border mt-2 px-4 bg-blue-500 text-white" onClick={() => setUserId(userId + 1)}>
        Next
      </button>
    </div>
  );
}
