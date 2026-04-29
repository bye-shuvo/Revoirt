import { useIsCollaborating } from "../../states/store"

const Navigation = () => {

  const setIsCollaborating = useIsCollaborating((state) => state.setIsCollaborating);

  return (
    <nav className="bg-mist-900 h-[7%] w-full flex items-center">
      <ul className="h-full w-full flex justify-between items-center px-3">
        <li id="logo"><h1 className='font-saira-stencil-one text-3xl text-white cursor-pointer' title="Code together | Build Fast">REVOIRT</h1></li>
        <li id="right-utils" className="flex items-center gap-10 h-full">
          <div id="joined-users" className="flex relative justify-center items-center w-fit h-full">
            {
              Array.from({ length: 5 }).map((_, index) => {
                return <span key={index} className={`relative h-8 w-8 flex rounded-full bg-purple-500 border border-green-400 overflow-hidden`} style={{ left: index * -10 }}> <img src={undefined} alt={`user-${index+1}`} /> </span>
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
