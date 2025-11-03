import { useQuery } from "@tanstack/react-query";

export default function App() {
  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () => fetch("https://jsonplaceholder.typicode.com/posts").then((res) => res.json()),
  });
  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;
  console.log(data);

  return (
    <div>
      {data.map((item: { title: string; body: string }) => (
        <div>
          <h5>{item.title}</h5>
          <p>{item.body}</p>
        </div>
      ))}
    </div>
  );
}
