import { useState } from "react";
import { useFiles, useSelectedFile } from "../states/store.ts";

const FileExplorar = () => {
  const [isNewFileCreating , setIsNewFileCreating] = useState(false);
  const [fileName , setFileName] = useState("");
  const selectedFile = useSelectedFile((state) => state.selectedFile);
  const setSelectedFile = useSelectedFile((state) => state.setSelectedFile);
  const files = useFiles((state) => state.files);
  const setFiles = useFiles((state) => state.setFiles);
  const handleFileChange = (e: React.MouseEvent<HTMLLIElement>) => {
    setSelectedFile(Number(e.currentTarget.dataset.index));
  }

  const handleFileCreate = () => {
    setIsNewFileCreating(true);
    setFiles({name: fileName , content: ""});
  }

  console.log(files);

  return (
    <aside className='h-full w-[15%] bg-amber-300'>
      <button className="border-0 rounded-none" onClick={handleFileCreate}><svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M128 64C92.7 64 64 92.7 64 128L64 512C64 547.3 92.7 576 128 576L308 576C285.3 544.5 272 505.8 272 464C272 363.4 349.4 280.8 448 272.7L448 234.6C448 217.6 441.3 201.3 429.3 189.3L322.7 82.7C310.7 70.7 294.5 64 277.5 64L128 64zM389.5 240L296 240C282.7 240 272 229.3 272 216L272 122.5L389.5 240zM464 608C543.5 608 608 543.5 608 464C608 384.5 543.5 320 464 320C384.5 320 320 384.5 320 464C320 543.5 384.5 608 464 608zM480 400L480 448L528 448C536.8 448 544 455.2 544 464C544 472.8 536.8 480 528 480L480 480L480 528C480 536.8 472.8 544 464 544C455.2 544 448 536.8 448 528L448 480L400 480C391.2 480 384 472.8 384 464C384 455.2 391.2 448 400 448L448 448L448 400C448 391.2 455.2 384 464 384C472.8 384 480 391.2 480 400z"/></svg></button>
      <ul className="flex flex-col justify-center w-full">
        {
          files.map((file, index) => {
            return <li key={index} data-index={index} aria-braillelabel={file.name} onClick={handleFileChange} className={`p-2 text-md hover:bg-gray-700/50 ${selectedFile === index ? "bg-gray-700" : "bg-none"}`}>{file.name}</li>
          })
        }
        {
          isNewFileCreating && <input className="px-4 py-2 text-md border rounded-lg" type="text" onChange={(e) => setFileName(e.target.value)}/>
        }
      </ul>
    </aside>
  )
}

export default FileExplorar
