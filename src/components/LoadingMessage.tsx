interface LoadingMessageProps {
  message?: string;
}

const LoadingMessage = ({
  message = "정보를 불러오는 중입니다...",
}: LoadingMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-r rounded-lg">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-gray-800 border-solid border-opacity-50 mb-4"></div>
      <p className="text-gray-800 text-xl font-semibold">{message}</p>
    </div>
  );
};

export default LoadingMessage;
