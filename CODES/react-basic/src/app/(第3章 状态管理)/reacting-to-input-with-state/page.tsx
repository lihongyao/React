"use client";
import React from "react";

enum Status {
  typing = "typing",
  submitting = "submitting",
  success = "success",
}
export default function Page() {
  const [answer, setAnswer] = React.useState("");
  const [error, setError] = React.useState<Error | null>(null);
  const [status, setStatus] = React.useState<Status>(Status.typing);

  const submitForm = async (answer: string): Promise<void> => {
    // 模拟接口请求
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let shouldError = answer.toLowerCase() !== "成都";
        if (shouldError) {
          reject(new Error("猜的不错，但答案不对。再试试看吧！"));
        } else {
          resolve();
        }
      }, 1500);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(Status.submitting);
    try {
      await submitForm(answer);
      setStatus(Status.success);
    } catch (err: unknown) {
      setStatus(Status.typing);
      setError(err as Error);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
  };

  if (status === Status.success) {
    return <h1 className="m-4">答对了！</h1>;
  }

  return (
    <div className="m-4">
      <h2>城市测验</h2>
      <p>哪个城市有把空气变成饮用水的广告牌？</p>
      <form onSubmit={handleSubmit}>
        <textarea 
          value={answer} 
          onChange={handleTextareaChange} 
          disabled={status === "submitting"} 
          className="border border-black" 
          rows={1} 
        />
        <br />
        <button disabled={answer.length === 0 || status === "submitting"}>提交</button>
      </form>
      {status === "submitting" && <p>提交中...</p>}
      {error !== null && <p className="Error">{error.message}</p>}
    </div>
  );
}
