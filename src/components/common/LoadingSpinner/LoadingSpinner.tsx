import React from "react";

import styles from "./LoadingSpinner.module.css";

interface LoadingSpinnerProps extends React.PropsWithChildren {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = (props) => {
  const { className } = props;

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen max-h-screen ${
        className || ""
      }`}
    >
      <div
        className={`flex items-center justify-center w-28 h-28 rounded-full bg-white before:content-[''] before:block before:w-16 before:h-16 before:rounded-full before:border-8 before:border-solid before:border-violet-700 before:border-r-transparent before:border-l-transparent ${styles.spinner} animate-[pulse_1.5s_ease-in-out_infinite]`}
      />
      <span className="font-bold text-2xl mt-4 text-violet text-violet-700">
        Loading...
      </span>
    </div>
  );
};

export default LoadingSpinner;
