import { Component } from 'react';
import PropTypes from 'prop-types';
import { AlertOctagon, RefreshCw, Home, Bug, Wifi, Server } from 'lucide-react';
import { motion as m } from 'framer-motion';

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            isRetrying: false,
            errorType: 'unknown',
            retryCount: 0
        };
        this.resetErrorBoundary = this.resetErrorBoundary.bind(this);
    }

    static getDerivedStateFromError(error) {
        const errorType = ErrorBoundary.classifyError(error);
        return { hasError: true, error, errorType };
    }

    static classifyError(error) {
        const message = error?.message?.toLowerCase() || '';
        
        if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
            return 'network';
        }
        if (message.includes('api') || message.includes('http') || message.includes('server')) {
            return 'api';
        }
        if (message.includes('chunk') || message.includes('loading')) {
            return 'chunk';
        }
        if (message.includes('undefined') || message.includes('null') || message.includes('cannot read')) {
            return 'javascript';
        }
        return 'unknown';
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
            isRetrying: false,
            errorType: 'unknown',
            retryCount: 0
        });
    }

    handleRetry = async () => {
        const { retryCount, errorType } = this.state;
        
        if (retryCount >= 3) return;

        this.setState({ 
            isRetrying: true, 
            retryCount: retryCount + 1 
        });

        try {
            // Smart retry based on error type
            switch (errorType) {
                case 'chunk':
                    window.location.reload();
                    break;
                case 'network':
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    break;
                case 'api':
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    break;
                default:
                    await new Promise(resolve => setTimeout(resolve, 1000));
            }
            this.resetErrorBoundary();
        } catch (error) {
            console.error('Retry failed:', error);
            this.setState({ isRetrying: false });
        }
    };

    getErrorIcon = () => {
        switch (this.state.errorType) {
            case 'network': return Wifi;
            case 'api': return Server;
            case 'chunk': return RefreshCw;
            case 'javascript': return Bug;
            default: return AlertOctagon;
        }
    };

    getErrorMessage = () => {
        const { errorType } = this.state;
        
        switch (errorType) {
            case 'network':
                return {
                    title: 'Connection Problem',
                    description: 'Please check your internet connection and try again.'
                };
            case 'api':
                return {
                    title: 'Service Unavailable',
                    description: 'Our servers are having trouble. Please try again in a moment.'
                };
            case 'chunk':
                return {
                    title: 'App Update Required',
                    description: 'A new version is available. Please refresh to get the latest updates.'
                };
            case 'javascript':
                return {
                    title: 'Something Went Wrong',
                    description: 'An unexpected error occurred in the application.'
                };
            default:
                return {
                    title: 'Unexpected Error',
                    description: this.state.error?.message || 'An unexpected error occurred'
                };
        }
    };

    render() {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            const ErrorIcon = this.getErrorIcon();
            const errorMessage = this.getErrorMessage();
            const { retryCount, isRetrying, errorType } = this.state;
            const maxRetries = 3;

            return (
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="min-h-[400px] flex items-center justify-center bg-zinc-900/50 rounded-xl p-8"
                >
                    <div className="text-center max-w-md mx-auto">
                        {/* Error Icon */}
                        <div className={`inline-block p-4 rounded-full mb-6 ${
                            errorType === 'network' ? 'bg-blue-500/10' :
                            errorType === 'api' ? 'bg-orange-500/10' :
                            errorType === 'chunk' ? 'bg-purple-500/10' :
                            'bg-red-500/10'
                        }`}>
                            <ErrorIcon className={`w-8 h-8 ${
                                errorType === 'network' ? 'text-blue-500' :
                                errorType === 'api' ? 'text-orange-500' :
                                errorType === 'chunk' ? 'text-purple-500' :
                                'text-red-500'
                            }`} />
                        </div>

                        {/* Error Message */}
                        <h2 className="text-2xl font-bold text-white mb-3">
                            {errorMessage.title}
                        </h2>
                        <p className="text-gray-400 mb-8">
                            {errorMessage.description}
                        </p>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            {/* Retry Button */}
                            {retryCount < maxRetries && (
                                <button
                                    onClick={this.handleRetry}
                                    disabled={isRetrying}
                                    className="px-6 py-3 bg-yellow-500 text-black rounded-full 
                                        hover:bg-yellow-400 transition-all duration-300
                                        focus:outline-none focus:ring-2 focus:ring-yellow-500 
                                        focus:ring-offset-2 focus:ring-offset-zinc-900
                                        disabled:opacity-50 disabled:cursor-not-allowed 
                                        flex items-center justify-center gap-2 min-w-[150px] mx-auto"
                                >
                                    {isRetrying ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            <span>Retrying...</span>
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-4 h-4" />
                                            <span>Try again ({maxRetries - retryCount} left)</span>
                                        </>
                                    )}
                                </button>
                            )}

                            {/* Alternative Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="px-4 py-2 bg-zinc-700 text-white rounded-lg 
                                        hover:bg-zinc-600 transition-colors duration-200
                                        flex items-center justify-center gap-2"
                                >
                                    <Home className="w-4 h-4" />
                                    <span>Go Home</span>
                                </button>

                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-4 py-2 bg-zinc-700 text-white rounded-lg 
                                        hover:bg-zinc-600 transition-colors duration-200
                                        flex items-center justify-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    <span>Reload Page</span>
                                </button>
                            </div>

                            {/* Error Details (Development) */}
                            {import.meta.env.DEV && this.state.errorInfo && (
                                <details className="mt-6 text-left">
                                    <summary className="text-sm text-gray-400 hover:text-gray-300 cursor-pointer">
                                        🐛 View error details (Dev)
                                    </summary>
                                    <div className="mt-3 p-4 bg-zinc-800/50 rounded-lg text-xs">
                                        <div className="mb-2">
                                            <strong className="text-yellow-500">Type:</strong> {errorType}
                                        </div>
                                        <div className="mb-2">
                                            <strong className="text-yellow-500">Message:</strong>
                                            <pre className="text-red-400 whitespace-pre-wrap mt-1">
                                                {this.state.error?.message}
                                            </pre>
                                        </div>
                                    </div>
                                </details>
                            )}

                            {/* Max Retries Reached */}
                            {retryCount >= maxRetries && (
                                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <p className="text-sm text-red-300">
                                        Maximum retries reached. Please reload the page or contact support.
                                    </p>
                                </div>
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

