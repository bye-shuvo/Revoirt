import type { editor } from 'monaco-editor';
import Editor, { type Monaco } from "@monaco-editor/react"
import { useRef, useEffect, useState } from "react";

import { useCursorPosition, useDeletedFilePath, useFileCount, useFilePath, useFiles, useLineCount, type file } from "../states/store.ts";
import { putFile } from "./utils/useIDB.ts";
import { useSessionStorage } from "./utils/useSessionStorage.ts";
import useDebounce from './utils/useDebounce.tsx';

const RevoirtEditor = () => {
  const [file, setFile] = useState<file>();
  const [unsavedfilePaths, setunsavedfilePaths] = useState<Array<string>>([]);

  const editorRef = useRef<Monaco>(null);
  const currentContent = useRef<string>("");
  const navFilesRef = useRef<file[]>([]);
  const currentFilesRef = useRef<file[] | null>(null);

  //SessionStorage Class Object
  const sessionStorage = new useSessionStorage();
  //useDebounceHook call
  const debounce = useDebounce();

  //Global states
  const path = useFilePath((state) => state.path);
  const setPath = useFilePath((state) => state.setPath);
  const files = useFiles((state) => state.files);
  const setFiles = useFiles((state) => state.setFiles);
  const setLineCount = useLineCount((state) => state.setLineCount);
  const deletedPath = useDeletedFilePath((state) => state.deletedPath);
  useFileCount((state) => state.fileCount); //Imported only to re render the UI
  const setFileCount = useFileCount((state) => state.setFileCount);
  const setCursorPosition = useCursorPosition((state) => state.setCursorPosition);

  //Helper Functions

  const initializeFiles = async (): Promise<void> => {
    try {
      const stashFiles = await sessionStorage.get("files"); //Data from session storage
      currentFilesRef.current = stashFiles;
    } catch {
      if (files) { //Data from global storage
        currentFilesRef.current = files;
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
      console.log(lastFile ? lastFile?.path : "");
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
    await sessionStorage.put("files", updatedFiles);
  }

  //Handler Functions

  //Editor onmount handler
  const handleEditorDidMount = async (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.focus();

    const updateLineCount = () => {
      setLineCount(editor.getModel()?.getLineCount() ?? 0);
    };
    updateLineCount();

    //editor event that runs / fires every time the monaco editor changes model / file changes

    editor.onDidChangeModel(updateLineCount);
    editor.onDidChangeModelContent(updateLineCount);

    //Current position of the cursor
    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition({ ln: e.position.lineNumber, col: e.position.column })
    })
  };

  //Editor onchange handler
  const handleValueChange = async (value: string | undefined) => {
    if (value !== undefined) {
      currentContent.current = value;
      setunsavedfilePaths(prev => [...prev, path]);
      debounce(() => getUpdatedFiles(value));
    }
  }
  //Saves the updated file in IDB
  const updateFile = async (e: KeyboardEvent): Promise<void> => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (!file) return;

      const updatedFile: file = { ...file, content: currentContent.current, updatedAt: Date.now() }
      setunsavedfilePaths(prev => prev.filter((file) => file !== path));
      await putFile(updatedFile);
      currentFilesRef.current && setFiles(currentFilesRef.current);
    }
  }

  //Side Effects

  useEffect(() => {
    if (!path) return;
    refreshEditor();
  }, [path]);

  useEffect(() => {
    if (!files) return;
    initializeFiles();
  }, [files]);

  useEffect(() => {
    document.addEventListener("keydown", updateFile);
    return () => { document.removeEventListener("keydown", updateFile) }
  }, [file]);

  return (
    <>
      {
        (!path) ? <div className="h-full bg-inherit flex justify-center items-center flex-col gap-5 text-white font-fira-code">
          <h1 className="text-lg">
            <p className='text-xl text-purple-300'>Welcome</p>
            <p className='text-xl text-purple-300'>To</p>
            <p className='font-saira-stencil-one font-extrabold text-[11rem] leading-38 text-transparent bg-clip-text bg-linear-[160deg] from-purple-400 to-amber-300'>Revoirt</p>
            <p className='text-xl text-amber-300'><svg className='h-9 w-9 rotate-90 mx-2 inline' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M160 512C142.3 512 128 526.3 128 544C128 561.7 142.3 576 160 576L256 576C309 576 352 533 352 480L352 173.3L425.4 246.7C437.9 259.2 458.2 259.2 470.7 246.7C483.2 234.2 483.2 213.9 470.7 201.4L342.7 73.4C330.2 60.9 309.9 60.9 297.4 73.4L169.4 201.4C156.9 213.9 156.9 234.2 169.4 246.7C181.9 259.2 202.2 259.2 214.7 246.7L288 173.3L288 480C288 497.7 273.7 512 256 512L160 512z" /></svg>A Collaborative code editor</p>
          </h1>
          <pre className="text-xl border-2 rounded-md bg-mist-800 border-gray-400 p-2 flex items-center">Code Together <svg className='h-7 w-7' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M176 168C189.3 168 200 157.3 200 144C200 130.7 189.3 120 176 120C162.7 120 152 130.7 152 144C152 157.3 162.7 168 176 168zM256 144C256 176.8 236.3 205 208 217.3L208 288L384 288C410.5 288 432 266.5 432 240L432 217.3C403.7 205 384 176.8 384 144C384 99.8 419.8 64 464 64C508.2 64 544 99.8 544 144C544 176.8 524.3 205 496 217.3L496 240C496 301.9 445.9 352 384 352L208 352L208 422.7C236.3 435 256 463.2 256 496C256 540.2 220.2 576 176 576C131.8 576 96 540.2 96 496C96 463.2 115.7 435 144 422.7L144 217.4C115.7 205 96 176.8 96 144C96 99.8 131.8 64 176 64C220.2 64 256 99.8 256 144zM488 144C488 130.7 477.3 120 464 120C450.7 120 440 130.7 440 144C440 157.3 450.7 168 464 168C477.3 168 488 157.3 488 144zM176 520C189.3 520 200 509.3 200 496C200 482.7 189.3 472 176 472C162.7 472 152 482.7 152 496C152 509.3 162.7 520 176 520z" /></svg> | Build Faster <svg className='h-7 w-7 inline rotate-180' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M557.7 64.9L363.5 139.6L365.8 110.3C366.8 97.5 353 88.8 341.8 95.2L165.3 197.4C102.6 233.7 64 300.6 64 373C64 485.1 154.9 576 267 576C339.4 576 406.3 537.4 442.6 474.7L544.8 298.3C551.3 287.2 542.6 273.3 529.7 274.3L500.4 276.6L575.1 82.4C575.7 80.9 576 79.2 576 77.6C576 70.1 570 64.1 562.5 64.1C560.8 64.1 559.2 64.4 557.7 65zM256 256C326.7 256 384 313.3 384 384C384 454.7 326.7 512 256 512C185.3 512 128 454.7 128 384C128 313.3 185.3 256 256 256zM256 352C256 334.3 241.7 320 224 320C206.3 320 192 334.3 192 352C192 369.7 206.3 384 224 384C241.7 384 256 369.7 256 352zM272 448C280.8 448 288 440.8 288 432C288 423.2 280.8 416 272 416C263.2 416 256 423.2 256 432C256 440.8 263.2 448 272 448z" /></svg></pre>
          <p className="text-lg text-white">Create a new file to get started !!!</p>
          <div id='command-pallete' className='rounded-lg border-green-400 border-2 p-2'><pre>open terminal <svg className='h-5 w-5 inline' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M598.6 342.6C611.1 330.1 611.1 309.8 598.6 297.3L470.6 169.3C458.1 156.8 437.8 156.8 425.3 169.3C412.8 181.8 412.8 202.1 425.3 214.6L498.7 288L64 288C46.3 288 32 302.3 32 320C32 337.7 46.3 352 64 352L498.7 352L425.3 425.4C412.8 437.9 412.8 458.2 425.3 470.7C437.8 483.2 458.1 483.2 470.6 470.7L598.6 342.7z" /></svg> ctrl + `</pre></div>
        </div> :
          <div className="h-full text-white no-scrollbar">
            <nav className="border-b border-gray-600 h-14 bg-[#181818]">
              <ul className="h-full w-full flex">
                {
                  navFilesRef.current?.map((file, index) => {
                    return <li key={index} className={`cursor-pointer px-5 flex gap-2 items-center ${path === file?.path ? "bg-[#222222]" : ""}`} onClick={() => setPath(file?.path)}><svg className='h-5 w-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 234.5C512 217.5 505.3 201.2 493.3 189.2L386.7 82.7C374.7 70.7 358.5 64 341.5 64L192 64zM453.5 240L360 240C346.7 240 336 229.3 336 216L336 122.5L453.5 240z" /></svg>{file?.name}{unsavedfilePaths?.includes(file?.path) ? <span className="h-3 w-3 rounded-full bg-white ml-1"></span> : <svg onClick={(e) => { e.stopPropagation(); handleFileClose(file?.path) }} className="h-7 w-7 p-1 rounded-sm hover:bg-gray-600/50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" /></svg>}</li>
                  })
                }
              </ul>
            </nav>
            <Editor
              height="calc(100% - 3.5rem)"
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
