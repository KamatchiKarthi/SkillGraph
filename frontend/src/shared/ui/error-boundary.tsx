import { Component, type ErrorInfo, type ReactNode } from 'react';
import { StatePanel } from './state-panel';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    message: '',
  };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error.message || 'Something went wrong',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('UI error boundary', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <StatePanel
          tone="danger"
          title="Unexpected UI error"
          message={this.state.message}
          actionLabel="Reload page"
          onAction={() => window.location.reload()}
        />
      );
    }
    return this.props.children;
  }
}
