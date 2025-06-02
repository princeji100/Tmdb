import { Component } from 'react';
import PropTypes from 'prop-types';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import { motion as m } from 'framer-motion';

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            isRetrying: false
        };
        this.resetErrorBoundary = this.resetErrorBoundary.bind(this);
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({ errorInfo });

        // Call onError prop if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    resetErrorBoundary() {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            isRetrying: false
        });
    }

    handleRetry = async () => {
        this.setState({ isRetrying: true });
        try {
            this.resetErrorBoundary();
            // Optionally reload the page
            // await window.location.reload();
        } finally {
            this.setState({ isRetrying: false });
        }
    };

    render() {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="min-h-[400px] flex items-center justify-center bg-zinc-900/50 rounded-xl p-8"
                >
                    <div className="text-center">
                        <div className="inline-block p-3 bg-red-500/10 rounded-full mb-4">
                            <AlertOctagon className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-2xl text-white mb-4">Something went wrong</h2>
                        <p className="text-gray-400 mb-6">
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>
                        <div className="space-y-4">
                            <button
                                onClick={this.handleRetry}
                                disabled={this.state.isRetrying}
                                className="px-6 py-3 bg-yellow-500 text-black rounded-full 
                                    hover:bg-yellow-400 transition-all duration-300
                                    focus:outline-none focus:ring-2 focus:ring-yellow-500 
                                    focus:ring-offset-2 disabled:opacity-50 
                                    disabled:cursor-not-allowed flex items-center 
                                    justify-center gap-2 min-w-[150px]"
                            >
                                {this.state.isRetrying ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        <span>Retrying...</span>
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="w-4 h-4" />
                                        <span>Try again</span>
                                    </>
                                )}
                            </button>
                            {this.state.errorInfo && (
                                <button
                                    onClick={() => console.log(this.state.errorInfo)}
                                    className="text-sm text-gray-400 hover:text-gray-300"
                                >
                                    View error details
                                </button>
                            )}
                        </div>
                    </div>
                </m.div>
            );
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
    fallback: PropTypes.element,
    onError: PropTypes.func
};

