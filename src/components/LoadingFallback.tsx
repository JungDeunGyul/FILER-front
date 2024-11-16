interface LoadingFallbackProps {
  message: string;
}

const LoadingFallback = ({ message }: LoadingFallbackProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-medium text-gray-700">{message}</p>
    </div>
  );
};

export default LoadingFallback;
