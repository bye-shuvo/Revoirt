import { editor } from 'monaco-editor';
import Editor from "@monaco-editor/react"
import { useRef, useEffect, useState, useCallback } from "react";

import { useCursorPosition, useDeletedFilePath, useFileCount, useFilePath, useFiles, useLineCount, useShowToast, type file } from "../../states/store.ts";
import { putFile } from "../../utills/hooks/useIDB.ts";
import { useSessionStorage } from "../../utills/hooks/useSessionStorage.ts";
import useDebounce from '../../utills/hooks/useDebounce.tsx';
import EditorNavigator from './EditorNavigator.tsx';
import EditorFallback from './EditorFallback.tsx';
import { useEditorCollaboration } from '../../utills/services/CollaborationProvider.ts';

const RevoirtEditor = () => {
  const [file, setFile] = useState<file>();
  const [editorDidMount, setEditorDidMount] = useState<boolean>(false);
  const [unsavedfilePaths, setunsavedfilePaths] = useState<Array<string>>([]);
  const isCollaborating = useRef<boolean>(false);

  const editorRef = useRef<editor.IStandaloneCodeEditor>(null);
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
  useShowToast((state) => state.showToast);
  const setShowToast = useShowToast((state) => state.setShowToast);

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
  const handleEditorDidMount = useCallback(async (editor: editor.IStandaloneCodeEditor) => {
    setEditorDidMount(true);
    editorRef.current = editor;
    editor.focus();
    editor?.getModel()?.setValue(currentContent.current);

    const updateLineCount = () => {
      setLineCount(editor.getModel()?.getLineCount() ?? 0);
    };
    updateLineCount();

    //editor event that runs / fires every time the monaco editor changes model / file changes

    editor.onDidChangeModel(updateLineCount);
    editor.onDidChangeModelContent(updateLineCount);

    //Current position of the cursor
    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition({ ln: e.position.lineNumber, col: e.position.column });
    })

    editor.onDidDispose(() => { setCursorPosition({ ln: 1, col: 1 }); setEditorDidMount(false) })
  }, [path]);

  //Editor onchange handler
  const handleValueChange = useCallback(async (value: string | undefined) => {
    if (value !== undefined) {
      currentContent.current = value;
      if (currentFilesRef.current?.find((f) => f.path === path)?.content === value) {
        setunsavedfilePaths(prev => prev.filter((p) => p !== path));
      }
      else {
        setunsavedfilePaths(prev => [...prev, path]);
      }
      debounce(() => getUpdatedFiles(value));
    }
  }, [path]);

  //Saves the updated file in IDB
  const updateFile = async (e: KeyboardEvent): Promise<void> => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (!file) return;
      if (!unsavedfilePaths.includes(path)) return;

      const updatedFile: file = { ...file, content: currentContent.current, updatedAt: Date.now() }
      setunsavedfilePaths(prev => prev.filter((file) => file !== path));
      await putFile(updatedFile);

      if (!currentFilesRef.current) return;

      currentFilesRef.current = currentFilesRef?.current?.map((file) => file.path === path ? updatedFile : file ?? []);
      setFiles(currentFilesRef.current);
      setShowToast({ doShow: true, type: "success", message: "File saved" });
    }
  }

  //Side Effects

  useEffect(() => {
    if (!path) return;
    refreshEditor();
    if (editorRef.current && !isCollaborating.current) {
      editorRef.current?.getModel()?.setValue(currentContent.current);
    }
  }, [path]);

  useEffect(() => {
    if (!files) return;
    initializeFiles();
  }, [files]);

  useEffect(() => {
    document.addEventListener("keydown", updateFile);
    return () => { document.removeEventListener("keydown", updateFile) }
  }, [file, unsavedfilePaths]);

//yjs implementation for collaborative editor
  useEditorCollaboration(editorRef , currentFilesRef , isCollaborating ,editorDidMount , path);

  return (
    <>
      {
        (!path) ? <EditorFallback /> :
          <div className="h-full text-white no-scrollbar">
            <EditorNavigator navFilesRef={navFilesRef} unsavedfilePaths={unsavedfilePaths} handleFileClose={handleFileClose} />
            <Editor
              height="calc(100% - 3.5rem)"
              language={file?.type}
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
