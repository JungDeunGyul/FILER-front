import React, { useState } from "react";

function ImagePlaceholder({ src, alt }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-72 h-72 mb-6 flex items-center justify-center overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <svg
            className="w-12 h-12 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4V2m0 20v-2m8-8h2M2 12h2m14.93-6.93l1.41-1.41M4.93 17.93l1.41-1.41m10.97 0l1.41 1.41M4.93 6.07l1.41 1.41"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-contain transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export default ImagePlaceholder;
