import React, { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onClose?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  public handleReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    this.setState({ hasError: false });
    if (this.props.onClose) {
      this.props.onClose();
    } else {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="bg-slate-900 border border-red-500/40 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-black text-red-400">
              {this.props.fallbackTitle || '화면 렌더링 복구 대기 중'}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              화면 표시 중 일시적인 데이터 예외가 발생했습니다.<br />
              아래 버튼을 누르면 캐시를 초기화하고 정상 화면으로 즉시 복구됩니다.
            </p>
            {this.state.error && (
              <div className="space-y-1 text-left">
                <div className="text-[11px] font-mono text-red-300 bg-slate-950 p-2.5 rounded-lg border border-red-500/30 break-all font-bold">
                  {this.state.error.name}: {this.state.error.message}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              {this.props.onClose && (
                <button
                  onClick={this.props.onClose}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer border border-slate-700"
                >
                  창 닫기
                </button>
              )}
              <button
                onClick={this.handleReload}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                즉시 복구 및 캐시 초기화
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
