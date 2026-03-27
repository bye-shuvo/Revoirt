import Editor, { type Monaco } from "@monaco-editor/react"
import { useRef, useEffect, useState } from "react";

import { useDeletedFilePath, useFileCount, useFilePath, useFiles, useLineCount } from "../states/store.ts";
import { putFile } from "./utils/useIDB.ts";
import { get, put } from "./utils/useSessionStorage.ts";

interface file {
  path: string,  // primary key
  name: string,
  type: string,
  extension: string,
  parentPath: string,
  content: string,
  createdAt: number,
  updatedAt: number,
}

const RevoirtEditor = () => {
  const editorRef = useRef<Monaco>(null);
  const [file, setFile] = useState<file>();
  const currentContent = useRef<string>("");
  const navFilesRef = useRef<file[]>([]);
  const currentFilesRef = useRef<file[] | null>(null);

  //Global states
  const path = useFilePath((state) => state.path);
  const setPath = useFilePath((state) => state.setPath);
  const files = useFiles((state) => state.files);
  const setLineCount = useLineCount((state) => state.setLineCount);
  const deletedPath = useDeletedFilePath((state) => state.deletedPath);
  const fileCount = useFileCount((state) => state.fileCount); //Imported only to re render the UI
  const setFileCount = useFileCount((state) => state.setFileCount);

  //Helper Functions

  const initializeFiles = async (): Promise<void> => {
    try {
      const stashFiles = await get("files"); //Data from session storage
      currentFilesRef.current = stashFiles;
      console.log("This section did run stashfiles");
    } catch {
      if (files) { //Data from global storage
        currentFilesRef.current = files;
        console.log("This section did run files");
      } else {
        console.error("Unexpected Errors Occured!!!");
      }
    }
    finally {
      if (!deletedPath) return;
      handleFileClose(deletedPath);
    }
  }

  const refreshEditor = (): void => {
    const openFile = currentFilesRef.current?.find((file: file) => file.path === path);
    if (!openFile) return;

    setFile(openFile);
    currentContent.current = openFile?.content ?? "";

    const navFiles = navFilesRef.current;
    navFilesRef.current = navFiles.some((file) => file.path === path) ? navFiles : [...navFiles, openFile];
    setFileCount(navFilesRef?.current.length);
  }

  const handleFileClose = (closePath: string) => {
    const navFiles = navFilesRef.current;
    const remainingFiles = navFiles.filter((file) => file.path !== closePath);
    navFilesRef.current = remainingFiles;
    setFileCount(navFilesRef.current?.length);

    if (closePath === path) {
      const lastFile = remainingFiles.at(-1);
      setPath(lastFile ? lastFile?.path : "");
      setFile(lastFile ? lastFile : undefined);
    }
  }

  const getUpdatedFiles = async (value: string): Promise<void> => {
    const currentFile = currentFilesRef.current?.find((file: file) => file.path === path);
    if (!currentFile) return;

    const updatedFile: file = { ...currentFile, content: value };
    const restFiles = currentFilesRef.current?.filter((file) => file.path !== path) ?? [];
    const updatedFiles = [...restFiles, updatedFile];
    currentFilesRef.current = updatedFiles;
    await put("files", updatedFiles);
  }

  //Handler Functions

  //Editor onmount handle
  const handleEditorDidMount = async (editor: Monaco) => {
    editorRef.current = editor;
    editor.focus();
    const count = editor?.getModel()?.getLineCount();
    setLineCount(count);
  };

  //Editor onchange handler
  const handleValueChange = async (value: string | undefined) => {
    if (value !== undefined) {
      currentContent.current = value;
      await getUpdatedFiles(value);
    }
  }
  //Saves the updated file in IDB
  const updateFile = async (e: KeyboardEvent): Promise<void> => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (!file) return;

      const updatedFile: file = { ...file, content: currentContent.current, updatedAt: Date.now() }
      await putFile(updatedFile);
    }
  }

  //Side Effects

  useEffect(() => {
    if(!path) return;
    refreshEditor();
  }, [path]);

  useEffect(() => {
    if (!files) return;
    initializeFiles();
  }, [files]);

  useEffect(() => {
    document.addEventListener("keydown", updateFile);
    return () => document.removeEventListener("keydown", updateFile);
  }, [file]);

  return (
    <>
      {
        (!path) ? <div className="h-full bg-inherit flex justify-center items-center flex-col gap-5 text-white">
          <h1 className="text-5xl">Welcome To <span className="font-bold text-transparent bg-linear-90 from-red-500 to-blue-500 bg-clip-text">Revoirt</span></h1>
          <h2 className="text-xl border border-gray-400 p-2">Code Together | Build Fast</h2>
          <p className="text-2xl text-white">Create a new file to get started !!!</p>
        </div> :
          <div className="h-full text-white">
            <nav className="border-b border-gray-600 h-[7%] bg-[#181818]">
              <ul className="h-full w-full flex">
                {
                  navFilesRef.current?.map((file, index) => {
                    return <li key={index} className={`cursor-pointer px-5 flex gap-2 items-center ${path === file?.path ? "bg-[#222222]" : ""}`} onClick={() => setPath(file?.path)}><svg className='h-5 w-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 234.5C512 217.5 505.3 201.2 493.3 189.2L386.7 82.7C374.7 70.7 358.5 64 341.5 64L192 64zM453.5 240L360 240C346.7 240 336 229.3 336 216L336 122.5L453.5 240z" /></svg>{file?.name}<svg onClick={(e) => { e.stopPropagation(); handleFileClose(file?.path) }} className="h-7 w-7 p-1 rounded-sm hover:bg-gray-600/50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" /></svg></li>
                  })
                }
              </ul>
            </nav>
            <Editor
              height="100%"
              language={file?.type}
              value={currentContent.current}
              theme="vs-dark"
              path={path}
              options={{
                fontSize: 20,
                minimap: { enabled: true },
                automaticLayout: true,
                wordWrap: "on",
                tabSize: 2,
                cursorStyle: "line",
                formatOnPaste: true,
                renderLineHighlight: "all",
                mouseWheelZoom: true,
                fontFamily: "Fira Code",
              }}
              onMount={handleEditorDidMount}
              onChange={handleValueChange}
            />
          </div>
      }
    </>
  )
}

export default RevoirtEditor
