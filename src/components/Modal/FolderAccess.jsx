import React from "react";

export function FolderAccess({ setFolderAccessModalOpen }) {
  const handleModalClick = () => {
    setFolderAccessModalOpen(false);
  };

  return (
    <div className="fixed w-full h-full z-10 bg-gray flex flex-col items-center justify-center p-4">
      <div className="text-red-500">해당 폴더에 접근이 불가능합니다</div>
      <div onClick={handleModalClick}>닫기</div>
    </div>
  );
}
