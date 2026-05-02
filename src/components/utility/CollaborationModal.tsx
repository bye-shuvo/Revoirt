import { useEffect, useRef, useState } from "react"
import { useFiles, useIsCollaborating, useRemoteUserCount } from "../../states/store.ts";
// import useDebounce from "../../utills/hooks/useDebounce.tsx";
import Toast from "../../utills/hooks/useToast.tsx";
import { encryptRoomId } from "../../utills/services/hashRoomId.ts";
import { useFilesCollaboration } from "../../utills/services/CollaborationProvider.ts";
import { changeURLHash } from "../../utills/services/changeURL.ts";

const CollaborationModal = () => {
  const link = import.meta.env.VITE_APP_SERVER_URL;

  const [organizationName, setOrganizationName] = useState<string>("");
  const [sharedLink, setSharedLink] = useState<string>(link);
  const [isSessionStarted, setIsSessionStarted] = useState<boolean>(false);
  const [isSessionClicked, setIsSessionClicked] = useState<boolean>(false);
  const [isCopied, setISCopied] = useState<boolean>(false);

  //global states
  const setIsCollaborating = useIsCollaborating((state) => state.setIsCollaborating);
  const files = useFiles((state) => state.files);
  const setFiles = useFiles((state) => state.setFiles);
  const setRemoteUserCount = useRemoteUserCount((state) => state.setRemoteUserCount);


  //Ref objects
  const islandRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);

  //Handler functions

  const handleModalClick = (e: Event) => {
    if (
      islandRef.current &&
      e.target instanceof Element &&
      !Array.from(islandRef.current.children).includes(e.target) &&
      !Array.from(islandRef.current.children[2].children).includes(e.target) &&
      (e.target !== islandRef.current)
    ) {
      setIsCollaborating(false);
    } else return;
  }

  const handleOrganizationNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrganizationName(e.target.value);
  }

  const handleSessionStart = async () => {
    cleanupRef?.current?.();
    setIsSessionClicked(true);
    if (organizationName) {
      setIsSessionStarted(true);
      const roomId = `${organizationName.trim()}-${Date.now().toString()}`
      const roomIdHash = await encryptRoomId(roomId); //creates hash for the files
      changeURLHash(`room=${organizationName.trim()}-${encodeURIComponent(roomIdHash)}`);
      setSharedLink(window.location.href);
      cleanupRef.current = useFilesCollaboration(roomIdHash, setFiles, files, setRemoteUserCount);
    }
    else return;
  }

  //Side Effects

  useEffect(() => {
    document.addEventListener('mousedown', handleModalClick);
    return () => document.removeEventListener('mousedown', handleModalClick);
  }, []);

  useEffect(() => {
    if (!organizationName) { setSharedLink(link); setIsSessionStarted(false); }
    return () => setSharedLink(link);
  }, [organizationName]);

  useEffect(() => () => cleanupRef.current?.(), []); // cleanup on unmount

  return (
    <>
      {
        (isSessionClicked && organizationName) ? <Toast type={"success"} message="session started" duration={1500} onDone={() => setIsSessionClicked(false)} bottom="5%" left="50%" /> : (isSessionClicked && !organizationName) && <Toast type={"error"} message="Organization name is required" duration={1500} onDone={() => setIsSessionClicked(false)} bottom="5%" left="45%" />
      }
      {
        isCopied && <Toast type={"success"} message="Copied!!!" duration={1000} onDone={() => setISCopied(false)} bottom="5%" left="50%" />
      }
      <div ref={islandRef} className="absolute left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/3 bg-mist-700 h-[70%] w-[35%] z-100 p-10 text-white flex flex-col items-center border border-gray-400 gap-5">
        <h2 className="text-3xl text-center font-bold">Live Collaboration</h2>
        <p className="text-sm text-center">Invite people to join the live editor</p>
        <div id="organization-creation" className="mt-10">
          <h3 className="mb-2">Enter your desired organization name</h3>
          <input type="text" placeholder="Type here" className="p-1 outline-2 outline-gray-600 w-full" onChange={handleOrganizationNameChange} />
          <p className="mt-10">Share the below link for live Collaboration</p>
          <input type="text" className="p-1 outline-2 outline-gray-600 mr-2 w-[70%]" value={sharedLink} readOnly />
          <button className={`${isSessionStarted ? "bg-sky-500 border-sky-600" : "bg-gray-500 border-gray-600"} p-1.5 border-b-2  active:border-0 w-[25%] cursor-pointer`} disabled={!isSessionStarted} onClick={() => { window.navigator.clipboard.writeText(sharedLink); setISCopied(true) }}>Copy Link</button>
        </div>
        <button className="session-start mt-10 p-2 bg-purple-600 border-b-3 border-purple-800 active:border-0 cursor-pointer" onClick={handleSessionStart}>start session</button>
        <p id="description" className="mt-10 text-sm p-5 flex bg-sky-700/50"><svg className="shrink-0 h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path className="fill-sky-500" d="M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM224 160a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm-8 64l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z" /></svg> enter you desired organization name, then start the session, copy and share the link with people wants to join you and collaborate.</p>
      </div>
    </>
  )
}

export default CollaborationModal
