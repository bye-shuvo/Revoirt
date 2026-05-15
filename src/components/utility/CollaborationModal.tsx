import { useEffect, useRef, useState } from "react";
import {
  useIsCollaborating,
  useIsSessionClicked,
  useIsSessionEnded,
  useIsSessionStarted,
} from "../../states/store.ts";
// import useDebounce from "../../utills/hooks/useDebounce.tsx";
import Toast from "../../utills/hooks/useToast.tsx";
import { encryptRoomId } from "../../utills/services/hashRoomId.ts";
import { changeURLHash, omitURLHash } from "../../utills/services/changeURL.ts";

const CollaborationModal = () => {
  const link = import.meta.env.VITE_APP_SERVER_URL;

  const [organizationName, setOrganizationName] = useState<string>("");
  const [sharedLink, setSharedLink] = useState<string>(link);
  const [isCopied, setISCopied] = useState<boolean>(false);

  //global states
  const setIsCollaborating = useIsCollaborating((state) => state.setState);
  const isSessionStarted = useIsSessionStarted((state) => state.state);
  const setIsSessionStarted = useIsSessionStarted((state) => state.setState);
  const setIsSessionEnded = useIsSessionEnded((state) => state.setState);
  const isSessionClicked = useIsSessionClicked((state) => state.state);
  const setIsSessionClicked = useIsSessionClicked((state) => state.setState);

  //Ref objects
  const islandRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);

  //Handler functions

  const handleModalClick = (e: Event) => {
    if (
      islandRef.current &&
      e.target instanceof Element &&
      !islandRef.current.contains(e.target)
    ) {
      setIsCollaborating(false);
    } else return;
  };

  const handleOrganizationNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setOrganizationName(e.target.value);
  };

  const handleSessionStart = async () => {
    cleanupRef?.current?.();
    setIsSessionClicked(true);
    if (!organizationName) return;
    const roomId = `${organizationName.trim()}-${Date.now().toString()}`;
    const roomIdHash = await encryptRoomId(roomId); //creates hash for the files
    changeURLHash(
      `room=${organizationName.trim()}-${encodeURIComponent(roomIdHash)}`,
    );
    setSharedLink(window.location.href);
    setIsSessionStarted(true);
  };

  const handleSessionEnd = async () => {
    setIsSessionEnded(true);
    setIsSessionClicked(true);
    setIsSessionStarted(false);
    setIsCollaborating(false);
    omitURLHash(link);
    setOrganizationName("");
  };

  //Side Effects

  useEffect(() => {
    document.addEventListener("mousedown", handleModalClick);
    return () => document.removeEventListener("mousedown", handleModalClick);
  }, []);

  useEffect(() => {
    if (!organizationName) {
      setSharedLink(link);
    }
    return () => {};
  }, [organizationName]);

  return (
    <>
      {isSessionClicked && organizationName ? (
        <Toast
          type={"success"}
          message="Session Started"
          duration={1500}
          onDone={() => setIsSessionClicked(false)}
          bottom="5%"
          left="50%"
        />
      ) : (
        isSessionClicked &&
        !organizationName && (
          <Toast
            type={"error"}
            message="Organization name is required"
            duration={1500}
            onDone={() => setIsSessionClicked(false)}
            bottom="5%"
            left="45%"
          />
        )
      )}
      {isCopied && (
        <Toast
          type={"success"}
          message="Copied!!!"
          duration={1000}
          onDone={() => setISCopied(false)}
          bottom="5%"
          left="50%"
        />
      )}
      <div
        ref={islandRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-mist-700 min-h-[70%] w-[35%] z-100 p-10 text-white flex flex-col items-center border border-gray-400 gap-5"
      >
        <h2 className="text-3xl text-center font-bold">Live Collaboration</h2>
        <p className="text-sm text-center">
          Invite people to join the live editor
        </p>
        <div id="organization-creation" className="mt-10">
          <h3 className="mb-2">Enter your desired room name</h3>
          <input
            type="text"
            placeholder="Type here"
            className="p-1 outline-2 outline-gray-600 w-full"
            onChange={handleOrganizationNameChange}
          />
          <p className="mt-10">Share the below link for live Collaboration</p>
          <input //bug here <-------------
            type="text"
            className="p-1 outline-2 outline-gray-600 mr-2 w-[70%]"
            value={sharedLink}
            readOnly
          />
          <button
            className={`${isSessionStarted ? "bg-sky-500 border-sky-600" : "bg-gray-500 border-gray-600"} p-1.5 border-b-2  active:border-0 w-[25%] cursor-pointer`}
            disabled={!isSessionStarted}
            onClick={() => {
              window.navigator.clipboard.writeText(sharedLink);
              setISCopied(true);
            }}
          >
            Copy Link
          </button>
        </div>
        {!isSessionStarted ? (
          <button
            className="session-start mt-10 p-2 bg-purple-600 border-b-3 border-purple-800 active:border-0 cursor-pointer"
            onMouseDown={(e) => {
              e.stopPropagation();
              handleSessionStart();
            }}
          >
            Start Session
          </button>
        ) : (
          <button //bug here <-------------
            className="session-start mt-10 p-2 bg-red-500 border-b-3 border-red-700 active:border-0 cursor-pointer"
            onMouseDown={(e) => {
              e.stopPropagation();
              handleSessionEnd();
            }}
          >
            End Session
          </button>
        )}
        <p id="description" className="mt-5 text-sm p-5 flex bg-sky-700/50">
          <svg
            className="shrink-0 h-4 w-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              className="fill-sky-500"
              d="M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM224 160a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm-8 64l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"
            />
          </svg>{" "}
          enter you desired organization name, then start the session, copy and
          share the link with people wants to join you and collaborate.
        </p>
      </div>
    </>
  );
};

export default CollaborationModal;
