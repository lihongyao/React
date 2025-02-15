import React from "react";

type ErrorBoundaryState = { hasError: boolean; error?: Error };

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("组件发生错误:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h2>发生错误，请刷新页面或联系管理员。</h2>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
