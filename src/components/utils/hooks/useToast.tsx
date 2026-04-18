import { useEffect, useRef, useState } from "react";

interface position {
  top: string | undefined,
  left: string | undefined,
  bottom: string | undefined,
  right: string | undefined,
}

const Toast = ({ type, message, top, left, bottom, right }: { type: string, message: string, top?: string, left?: string, bottom?: string, right?: string }) => {
  const [delay, setDelay] = useState<number | undefined>(100);
  const timerRef = useRef<number>(null);

  const position: position = {
    top: top ? top : undefined,
    left: left ? left : undefined,
    bottom: bottom ? bottom : undefined,
    right: right ? right : undefined
  }

  useEffect(() => {
    const timer = () => {
      setDelay((prev) => {
        if (prev && prev <= 0) {
          if (!timerRef.current) return;
          clearInterval(timerRef.current);
          return 0;
        }
        return prev && prev - 2;
      });
    };
    timerRef.current = setInterval(timer, 50);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  return (
    <>
      <div
        style={{
          top: position.top,
          left: position.left,
          bottom: position.bottom,
          right: position.right,
        }}
        className={`absolute z-100 text-white backdrop-blur-2xl bg-[#2D425C]/50 p-4 pt-3 pb-3 rounded-sm`}
      >
        <p
          className={`${type === "general"
              ? "bg-sky-500"
              : type === "confirmation"
                ? "bg-green-500"
                : type === "error"
                  ? "bg-red-500"
                  : type === "warning" ? "bg-yellow-500" : "bg-slate-500"
            } absolute h-full w-2 left-0 top-0 rounded-bl-sm rounded-tl-sm`}
        ></p>
        <span className="flex h-full w-full justify-center items-end">
          <p className="text-md font-semibold z-10">{message}</p>
        </span>
        <p
          id="progress-bar"
          className={`${type === "general"
              ? "bg-sky-500/50"
              : type === "confirmation"
                ? "bg-green-500/50"
                : type === "Error"
                  ? "bg-red-500/50"
                  : "bg-yellow-500/50"
            } absolute h-full w-full left-0 bottom-0 transition-all ease-linear duration-100`}
          style={{ width: `${String(delay)}%` }}
        ></p>
      </div>
    </>
  );
};

export default Toast;