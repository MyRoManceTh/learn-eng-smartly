import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * App-wide error boundary. Without this, any render-time throw (including a
 * lazy-chunk fetch that 404s after a new deploy) white-screens the entire app
 * with no recovery path. Here we catch it and offer a reload.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Surface for monitoring; replace with a real logger/Sentry when available.
    console.error("Unhandled render error:", error, info.componentStack);
  }

  private handleReload = (): void => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-rose-50 to-pink-50">
        <div className="text-center space-y-4 max-w-sm">
          <span className="text-5xl">😿</span>
          <h2 className="text-lg font-bold font-thai">เกิดข้อผิดพลาด</h2>
          <p className="text-sm text-muted-foreground font-thai">
            มีบางอย่างผิดพลาด ลองโหลดหน้าใหม่อีกครั้งนะ
          </p>
          <button
            onClick={this.handleReload}
            className="px-5 py-2.5 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white text-sm font-bold shadow-lg hover:scale-105 transition-transform font-thai"
          >
            โหลดใหม่
          </button>
        </div>
      </div>
    );
  }
}
