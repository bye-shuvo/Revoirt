import { useState } from "react"

interface file {
  name: string,
  content: string
}
const files: file[] = [{
  name: "index.js",
  content: ""
}, {
  name: "utils.js",
  content: ""
}]
const FileExplorar = ({ value }: { value: string }) => {
  const [selectedFile, setSelectedFile] = useState(0);
  const handleFileChange = (e: React.MouseEvent<HTMLLIElement>) => {
    setSelectedFile(Number(e.currentTarget.dataset.index));
    files[Number(e.currentTarget.dataset.index)].content = value;
  }

  return (
    <aside className='h-full w-[15%] bg-amber-300'>
      <ul className="flex flex-col justify-center w-full">
        {
          files.map((file, index) => {
            return <li key={index} data-index={index} aria-braillelabel={file.name} onClick={handleFileChange} className={`p-2 text-md hover:bg-gray-700/50 ${selectedFile === index ? "bg-gray-700" : "bg-none"}`}>{file.name}</li>
          })
        }
      </ul>
    </aside>
  )
}

export default FileExplorar
