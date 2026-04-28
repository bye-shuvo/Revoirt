import { type file , useFilePath } from "../../states/store.ts";

const EditorNavigator = ({navFilesRef , unsavedfilePaths , handleFileClose} : {navFilesRef : React.RefObject<file[]> , unsavedfilePaths : string[] , handleFileClose : Function}) => {

    const path= useFilePath((state) => state.path);
    const setPath= useFilePath((state) => state.setPath);
  return (
            <nav className="border-b border-gray-600 h-14 bg-[#181818]">
              <ul className="h-full w-full flex">
                {
                  navFilesRef.current?.map((file, index) => {
                    return <li key={index} className={`cursor-pointer px-5 flex gap-2 items-center ${path === file?.path ? "bg-[#222222]" : ""}`} onClick={() => setPath(file?.path)}><svg className='h-5 w-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 234.5C512 217.5 505.3 201.2 493.3 189.2L386.7 82.7C374.7 70.7 358.5 64 341.5 64L192 64zM453.5 240L360 240C346.7 240 336 229.3 336 216L336 122.5L453.5 240z" /></svg>{file?.name}{unsavedfilePaths?.includes(file?.path) ? <span className="h-3 w-3 rounded-full bg-white ml-1"></span> : <svg onClick={(e) => { e.stopPropagation(); handleFileClose(file?.path) }} className="h-7 w-7 p-1 rounded-sm hover:bg-gray-600/50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" /></svg>}</li>
                  })
                }
              </ul>
            </nav>
  )
}

export default EditorNavigator
