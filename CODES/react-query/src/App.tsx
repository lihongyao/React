import { useQuery } from "@tanstack/react-query";

export default function App() {
  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () => fetch("https://api.github.com/repos/TanStack/query").then((res) => res.json()),
  });
  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong> &nbsp;
      <strong>✨ {data.stargazers_count}</strong> &nbsp;
      <strong>🍴 {data.forks_count}</strong>
    </div>
  );
}
