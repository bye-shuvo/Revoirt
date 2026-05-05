import React from "react";
import { useIsCollaborating, useRemoteUserCount } from "../../states/store"

const Navigation = () => {

  //global states


  const setIsCollaborating = useIsCollaborating((state) => state.setIsCollaborating);
  const count = useRemoteUserCount((state) => state.remoteUserCount);
  let remoteUserCount : number ;
  if (count ===  0) {
    remoteUserCount = Number(window.sessionStorage.getItem('connected_users'));
  }
  else{
    remoteUserCount = count ;
  }
  console.log(remoteUserCount);

  return (
    <nav className="bg-mist-900 h-[7%] w-full flex items-center">
      <ul className="h-full w-full flex justify-between items-center px-3">
        <li id="logo"><h1 className='font-saira-stencil-one text-3xl text-white cursor-pointer' title="Code together | Build Fast">REVOIRT</h1></li>
        <li id="right-utils" className="flex items-center gap-10 h-full">
          {(remoteUserCount > 0) && 
          (<div id="connected-users" className="flex gap-2 items-center text-green-600"><span id="connection-indicator" className="h-1.5 w-1.5 rounded-full bg-green-400 animate-ping"></span>{remoteUserCount} user{remoteUserCount > 1 ? "s" : ""} connected</div>)}
          <div id="joined-users" className="flex relative justify-center items-center w-fit h-full">
            {
              Array.from({ length: 5 }).map((_, index) => {
                return <span key={index} className={`relative h-8 w-8 flex rounded-full bg-purple-500 border border-green-400 overflow-hidden`} style={{ left: index * -10 }}> <img src={undefined} alt={`user-${index + 1}`} /> </span>
              })
            }
          </div>
          <button id="collaborate" className="bg-sky-500 border-b-3 border-sky-700 cursor-pointer h-[70%] px-2" onClick={() => setIsCollaborating(true)}>Collaborate</button>
          <button id="profile" title="navigate profile" className="object-center object-cover h-9 w-9 bg-green-300 rounded-full cursor-pointer"></button>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation
