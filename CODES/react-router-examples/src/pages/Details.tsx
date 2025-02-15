import { useBlocker, useNavigate } from "react-router";

const Page = () => {
  const blocker = useBlocker(() => {
    return false;
  });
  const navigate = useNavigate();
  return (
    <div>
      <h2>表单页面</h2>
      <button onClick={() => navigate(-1)}>回退</button>
    </div>
  );
};

export default Page;
