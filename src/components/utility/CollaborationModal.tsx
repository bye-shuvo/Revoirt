import { useEffect, useRef } from "react"
import { useIsCollaborating } from "../../states/store";

const CollaborationModal = () => {

  const setIsCollaborating = useIsCollaborating((state) => state.setIsCollaborating);

  const islandRef = useRef<HTMLDivElement>(null);
  const handleModalClick = (e : Event) => {
    e.preventDefault();
    if (
      islandRef.current &&
      e.target instanceof Element &&
      !Array.from(islandRef.current.children).includes(e.target) &&
      (e.target !== islandRef.current)
    ) {
      setIsCollaborating(false);
    } else return;
  }

  useEffect(() => {
    document.addEventListener('mousedown' , handleModalClick);
    return () => document.removeEventListener('mousedown' , handleModalClick);
  } ,[]);

  return (
    <div ref={islandRef} className="absolute left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/3 bg-mist-700 h-140 w-145 z-100 p-10 text-white flex flex-col items-center">
      <h2 className="text-2xl text-center font-bold">Live Collaboration</h2>
      <p className="text-sm text-center">Invite people to join the live editor</p>
      <button className="session-start m-10 p-2 bg-purple-600 border-b-3 border-purple-800 active:border-0 cursor-pointer">start session</button>
    </div>
  )
}

export default CollaborationModal
