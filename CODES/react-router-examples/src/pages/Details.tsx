import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Details() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleBack = () => {
    if (window.confirm("您有未完成的考试，确定要离开吗？")) {
      navigate(-1); // 返回上一页
    }
  };

  return (
    <div>
      <h2>表单页面</h2>
      <button onClick={handleBack}>回退</button>
    </div>
  );
}
