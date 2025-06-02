export const PageLoader = () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-500 border-t-transparent"></div>
    </div>
);

export const ContentLoader = () => (
    <div className="w-full h-full flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
    </div>
);

export const ButtonLoader = () => (
    <div className="flex items-center gap-2">
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        <span>Loading...</span>
    </div>
);