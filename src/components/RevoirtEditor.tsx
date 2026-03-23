import Editor, { type Monaco } from "@monaco-editor/react"
import { useRef, useEffect, useState } from "react";

import { useFilePath, useFiles, useLineCount } from "../states/store.ts";
import { putFile } from "./utils/useIDB.ts";

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

  const getLineCount = () => {
    const count = editorRef.current?.getModel()?.getLineCount();
    setLineCount(count);
  }

  const getUpdatedFiles = (value: string) => {
    const currentFile = currentFilesRef.current?.find((file) => file.path === path);
    if (!currentFile) return;
    const updatedFile: file = { ...currentFile, content: value };
    const restFiles = currentFilesRef.current?.filter((file) => file.path !== path) || [];
    currentFilesRef.current = [...restFiles, updatedFile];
  }

  const refreshEditor = async (): Promise<void> => {
    getLineCount();

    const openFile = currentFilesRef.current?.find((file: file) => file.path === path);

    if (openFile) {
      setFile(openFile);

      currentContent.current = openFile?.content ?? ""

      const navFiles = navFilesRef.current;
      navFilesRef.current = navFiles.some((file) => file.path === path) ? navFiles : [...navFiles, openFile]
    }
  }

  const handleEditorDidMount = (editor: Monaco) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleValueChange = async (value: string | undefined) => {
    if (value !== undefined) {
      getLineCount()
      currentContent.current = value;
      getUpdatedFiles(value);
    }
  }

  const updateFile = async (e: KeyboardEvent): Promise<void> => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (!file) return;

      const updatedFile: file = { ...file, content: currentContent.current, updatedAt: Date.now() }
      await putFile(updatedFile);
    }
  }

  useEffect(() => {
    refreshEditor();
  }, [path]);

  useEffect(() => {
    document.addEventListener("keydown", updateFile);
    return () => document.removeEventListener("keydown", updateFile);
  }, [file, currentContent.current])

  useEffect(() => {
    (files) && (async () => { currentFilesRef.current = files })()
  }, [files]);

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
                    return <li key={index} className={`cursor-pointer px-5 flex gap-1 items-center ${path === file?.path ? "bg-[#222222]" : ""}`} onClick={() => setPath(file?.path)}><svg className='h-5 w-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 234.5C512 217.5 505.3 201.2 493.3 189.2L386.7 82.7C374.7 70.7 358.5 64 341.5 64L192 64zM453.5 240L360 240C346.7 240 336 229.3 336 216L336 122.5L453.5 240z" /></svg>{file?.name}</li>
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
