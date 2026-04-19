import { useEffect, useState, useRef } from 'react';
import { deleteFile, executeIDB } from "./utils/hooks/useIDB.ts";
import { useDeletedFilePath, useFilePath, useFiles, type file } from '../states/store.ts';
import { useSessionStorage } from './utils/hooks/useSessionStorage.ts';
import { monacoLanguages } from './utils/monacoLanguages.ts';
import Toast from './utils/hooks/useToast.tsx';
interface toastProps {
  doShow: boolean,
  type: string,
  message: string
}

const FileExplorer = () => {
  const [isAddingNewFile, setIsAddingNewFile] = useState(false);
  const [isRenamingFile, setIsRenamingFile] = useState(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [renameValue, setRenameValue] = useState<string>("");
  const [file, setFile] = useState<file | undefined>(); //put new file
  const [showToast, setShowToast] = useState<toastProps>();

  const inputFile = useRef<HTMLLIElement>(null);
  const renameFile = useRef<HTMLLIElement>(null);
  const changableFileRef = useRef<file | undefined>(undefined);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  //SessionStorage Class Object
  const sessionStorage = new useSessionStorage();

  //global states
  const path = useFilePath((state) => state.path);
  const setPath = useFilePath((state) => state.setPath);
  const files = useFiles((state) => state.files);
  const setFiles = useFiles((state) => state.setFiles);
  const deletedPath = useDeletedFilePath((state) => state.deletedPath);
  const setDeletedPath = useDeletedFilePath((state) => state.setDeletedPath);

  const refreshFiles = async () => {
    const files: file[] = await executeIDB(file);
    setFiles(files);
    await sessionStorage.put("files", files);
  }

  const reloadFiles = async () => {
    try {
      const files: file[] = await sessionStorage.get("files");
      setFiles(files);
    } catch {
      await refreshFiles();
    }
  }

  const handleFileChange = (e: any): void => {
    const trimmedName: string = e.target.value.trim();
    const extension = trimmedName.split(".").pop() ?? "";
    const type = monacoLanguages[extension];
    setFile(
      {
        path: `src/${trimmedName}`,
        name: trimmedName,
        type: type,
        extension: extension,
        parentPath: "src/",
        content: "//Welcome to Revoirt \n //Start coding together",
        createdAt: Date.now(),
        updatedAt: Date.now()
      })
  }

  const createFileEvent = (e: any): void => {
    if (!Array.from(inputFile.current?.children || []).includes(e.target as Element)) {
      setIsAddingNewFile(false);
    }
  }

  const deleteFileEvent = (e: any): void => {
    if (!Array.from(contextMenuRef.current?.children || []).includes(e.target as Element)) {
      setDeletedPath("");
    }
  }

  const renameFileEvent = async (e: any): Promise<void> => {
    if (!Array.from(renameFile.current?.children || []).includes(e.target as Element)) {
      await changeFileName();
      setDeletedPath("");
      setRenameValue("");
      setIsRenamingFile(false);
    }
  }

  const createFile = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      refreshFiles();
      setFile(undefined);
      setIsAddingNewFile(false);
      setShowToast({ doShow: true, type: "success", message: "File Created Successfully" });
    }
  }

  const handleFileDelete = async (path: string) => {
    await deleteFile(path);
    await refreshFiles();
    setDeletedPath("");
    setShowToast({ doShow: true, type: "success", message: "File Deleted Successfully" });
  }

  //Handler Functions to change file name

  const renameEventHandler = async (fileName: string, filePath: string) => {
    if (!deletedPath || !fileName.trim()) return;
    setIsRenamingFile(true);
    setIsContextMenuOpen(false);

    const freashFiles: file[] = await sessionStorage.get("files");
    changableFileRef.current = freashFiles?.find((file) => file?.path === filePath);

    await deleteFile(deletedPath);
    await refreshFiles();

    setRenameValue(fileName);
  }

  const changeFileName = async (): Promise<file | undefined> => {
    if (!changableFileRef.current) return;
    let newName: string;
    let newPath: string;

    if (!renameValue.trim()) {
      newName = "Undefined"
      newPath = `src/${newName}`;
    }
    else {
      newName = renameValue?.trim();
      newPath = `src/${newName}`;
    }

    const newExtension = newName.split(".").pop() ?? "";
    const newType = monacoLanguages[newExtension];
    const updatedFile = { ...changableFileRef.current, name: newName, path: newPath, type: newType, extension: newExtension, updatedAt: Date.now() };
    const updatedFiles: file[] = await executeIDB(updatedFile);
    setFiles(updatedFiles);
    await sessionStorage.put("files", updatedFiles);
    changableFileRef.current = undefined;
  }

  const handleFileNameChange = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      await changeFileName();
      setIsRenamingFile(false);
      setShowToast({ doShow: true, type: "success", message: "File Renamed successfully" });
    }
  }

  const triggerFileCreation = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "f") {
      e.preventDefault();
      setIsAddingNewFile(true);
    }
  }


  //Side Effect perform functions
  useEffect(() => {
    document.addEventListener("mousedown", createFileEvent);
    document.addEventListener("mousedown", deleteFileEvent);
    document.addEventListener("keydown", triggerFileCreation);
    return () => {
      document.removeEventListener("mousedown", createFileEvent);
      document.removeEventListener("mousedown", deleteFileEvent);
      document.removeEventListener("keydown", triggerFileCreation);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", renameFileEvent);
    return () => document.removeEventListener("mousedown", renameFileEvent);
  }, [renameValue])

  useEffect(() => {
    reloadFiles();
  }, []);

  return (
    <aside className='h-full bg-[#181818]'>
      {
        showToast?.doShow && <Toast type={showToast.type} message={showToast.message} duration={1500} onDone={() => {setShowToast({doShow : false ,type : "" , message : ""})}} top='95%' left="50%" />
      }
      <div aria-labelledby="buttons" className="flex gap-2 h-[7%]">
        <button className="py-2 px-5" onClick={() => { setIsAddingNewFile(true) }}><svg className="h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M128 64C92.7 64 64 92.7 64 128L64 512C64 547.3 92.7 576 128 576L308 576C285.3 544.5 272 505.8 272 464C272 363.4 349.4 280.8 448 272.7L448 234.6C448 217.6 441.3 201.3 429.3 189.3L322.7 82.7C310.7 70.7 294.5 64 277.5 64L128 64zM389.5 240L296 240C282.7 240 272 229.3 272 216L272 122.5L389.5 240zM464 608C543.5 608 608 543.5 608 464C608 384.5 543.5 320 464 320C384.5 320 320 384.5 320 464C320 543.5 384.5 608 464 608zM480 400L480 448L528 448C536.8 448 544 455.2 544 464C544 472.8 536.8 480 528 480L480 480L480 528C480 536.8 472.8 544 464 544C455.2 544 448 536.8 448 528L448 480L400 480C391.2 480 384 472.8 384 464C384 455.2 391.2 448 400 448L448 448L448 400C448 391.2 455.2 384 464 384C472.8 384 480 391.2 480 400z" /></svg></button>
      </div>
      <ul className="flex flex-col justify-center w-full">
        {
          files?.map((file: file) => {
            return <li key={file.path} onClick={() => setPath(file.path)}
              onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setDeletedPath(file?.path); setIsContextMenuOpen(true) }} className={`flex gap-2 text-[1rem] cursor-pointer hover:bg-gray-500/50 p-2 relative text-white ${file?.path === path ? "bg-[#222222]" : ""}`} >
              <svg className='h-6 w-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 234.5C512 217.5 505.3 201.2 493.3 189.2L386.7 82.7C374.7 70.7 358.5 64 341.5 64L192 64zM453.5 240L360 240C346.7 240 336 229.3 336 216L336 122.5L453.5 240z" /></svg>
              {file.name}
              {
                (isContextMenuOpen && deletedPath === file?.path) && <div ref={contextMenuRef} className='flex flex-col border border-slate-600 bg-[#181818] absolute z-10 w-7/8 p-2 rounded-sm'><button className='p-1 hover:bg-gray-700/50 rounded-sm' onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); renameEventHandler(file?.name, file?.path) }}>Rename...</button>
                  <p className='w-full border-b border-slate-600'></p>
                  <button className='p-1 hover:bg-gray-700/50 rounded-sm' onMouseDown={(e) => { e.stopPropagation(); handleFileDelete(file?.path); }}>Delete</button>
                </div>
              }
            </li>
          })
        }
        {
          isAddingNewFile && <li ref={inputFile} className='flex gap-2 text-[1rem] cursor-text p-2 items-center'>
            <svg className='h-6 w-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 234.5C512 217.5 505.3 201.2 493.3 189.2L386.7 82.7C374.7 70.7 358.5 64 341.5 64L192 64zM453.5 240L360 240C346.7 240 336 229.3 336 216L336 122.5L453.5 240z" /></svg>
            <input onChange={handleFileChange} onKeyDown={createFile} autoFocus={true} className='w-fit text-[1rem] border rounded-sm outline-none border-blue-400 text-white placeholder:text-white py-0.5' type="text" />
          </li>
        }
        {
          isRenamingFile && <li ref={renameFile} className='flex gap-2 text-[1rem] cursor-text p-2 items-center'>
            <svg className='h-6 w-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 234.5C512 217.5 505.3 201.2 493.3 189.2L386.7 82.7C374.7 70.7 358.5 64 341.5 64L192 64zM453.5 240L360 240C346.7 240 336 229.3 336 216L336 122.5L453.5 240z" /></svg>
            <input value={renameValue} onChange={(e) => { setRenameValue(e.target.value) }} onKeyDown={handleFileNameChange} autoFocus={true} className='w-fit text-[1rem] border rounded-sm outline-none border-blue-400 text-white placeholder:text-white py-0.5' type="text" />
          </li>
        }
      </ul>
    </aside>
  )
}

export default FileExplorer
