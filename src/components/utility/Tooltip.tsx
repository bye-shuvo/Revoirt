import { useEffect, useRef, useState } from "react";
import {
  useCursorPosition,
  useFileCount,
  useFilePath,
  useFiles,
  useIsSessionStarted,
  useLineCount,
  type file,
} from "../../states/store.ts";

const Tooltip = () => {
  const currentFileRef = useRef<file | undefined>(undefined);
  const connectedRoomRef = useRef<string | undefined>(undefined);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string | undefined>(
    "",
  );

  //global states
  const path = useFilePath((state) => state.path);
  const files = useFiles((state) => state.files);
  const lineCount = useLineCount((state) => state.lineCount);
  const fileCount = useFileCount((state) => state.fileCount);
  const cursorPostion = useCursorPosition((state) => state.cursorPosition);
  const getDate = (currentFile: file | undefined) => {
    if (currentFile?.updatedAt) {
      const date = new Date(currentFile?.updatedAt);
      return date.toString().replace("GMT+0600 (Bangladesh Standard Time)", "");
    }
  };
  const isSessionStarted = useIsSessionStarted((state) => state.state);

  useEffect(() => {
    currentFileRef.current = files?.find((file) => file?.path === path);
    setLastUpdatedTime(getDate(currentFileRef.current));
  }, [files, path]);

  useEffect(() => {
    const room = window.location.hash.split("=").at(-1)?.split("_").at(0);
    connectedRoomRef.current = room;
    if (!room) return;
  }, [isSessionStarted]);

  return (
    <div className="absoute bottom-0 h-[5%] w-full flex justify-end gap-5 px-5 items-center text-white bg-[#181818] border-t border-gray-600 font-fira-code">
      {connectedRoomRef.current && (
        <p className="text-green-500">
          Connected Room : {connectedRoomRef.current} {" "}
          <span className="text-white">|</span>{" "}
        </p>
      )}
      {path && <p>Last updated: {lastUpdatedTime} | </p>}
      <p>
        Ln:{cursorPostion.ln} Col:{cursorPostion.col}
      </p>{" "}
      |<p>LOC:{lineCount || 0}</p> |<p>Open Files:{fileCount || 0}</p>
      {path && (
        <p className="flex gap-2 items-center">
          {" "}
          |{" "}
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
          >
            <path
              fill="rgb(255, 255, 255)"
              d="M392.8 65.2C375.8 60.3 358.1 70.2 353.2 87.2L225.2 535.2C220.3 552.2 230.2 569.9 247.2 574.8C264.2 579.7 281.9 569.8 286.8 552.8L414.8 104.8C419.7 87.8 409.8 70.1 392.8 65.2zM457.4 201.3C444.9 213.8 444.9 234.1 457.4 246.6L530.8 320L457.4 393.4C444.9 405.9 444.9 426.2 457.4 438.7C469.9 451.2 490.2 451.2 502.7 438.7L598.7 342.7C611.2 330.2 611.2 309.9 598.7 297.4L502.7 201.4C490.2 188.9 469.9 188.9 457.4 201.4zM182.7 201.3C170.2 188.8 149.9 188.8 137.4 201.3L41.4 297.3C28.9 309.8 28.9 330.1 41.4 342.6L137.4 438.6C149.9 451.1 170.2 451.1 182.7 438.6C195.2 426.1 195.2 405.8 182.7 393.3L109.3 320L182.6 246.6C195.1 234.1 195.1 213.8 182.6 201.3z"
            />
          </svg>
          {currentFileRef.current?.extension.toUpperCase()}
        </p>
      )}
    </div>
  );
};

export default Tooltip;
