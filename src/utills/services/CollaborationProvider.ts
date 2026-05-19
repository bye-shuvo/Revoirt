import React, { useEffect } from "react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { WebsocketProvider } from "y-websocket";
import { editor } from "monaco-editor";
import { type file } from "../../states/store";
import { useSessionStorage } from "../hooks/useSessionStorage";
import { putAllFiles } from "../hooks/useIDB";
import { getRemoteUsersCount } from "./getRemoteUser";

//session storage hook initialized
const sessionStorage = new useSessionStorage();

//.env variables
const wsServerUrl = import.meta.env.VITE_WS_SERVER_URL;

export const useEditorCollaboration = (
  editorRef: React.RefObject<editor.IStandaloneCodeEditor | null>,
  currentFilesRef: React.RefObject<file[] | null>,
  isCollaborating: React.RefObject<boolean>,
  editorDidMount: boolean,
  path: string,
) => {
  //yjs implementation for collaborative code editor
  // Yjs documents are collections of shared objects that sync automatically.
  return useEffect(() => {
    if (!editorRef.current) return;
    const model = editorRef.current?.getModel();
    if (!model) return;

    const currentFile = currentFilesRef.current?.find((f) => f.path === path);
    if (!currentFile || !wsServerUrl) return;
    //yjs document to simulate a remote user
    const ydocument = new Y.Doc();

    //websocketprovider for syncronizing remote users
    const provider = new WebsocketProvider(
      wsServerUrl,
      currentFile?.id,
      ydocument,
    );

    const ytext = ydocument.getText(currentFile?.id); //shared text type

    let binding: MonacoBinding | null = null;

    const handleSync = (isSyncronized: boolean) => {
      if (isSyncronized) {
        if (editorRef.current) {
          binding?.destroy();
          isCollaborating.current = true;
          binding = new MonacoBinding(
            ytext,
            model,
            new Set([editorRef.current]),
            provider.awareness,
          );
        } else return;
        if (ytext.length === 0) {
          const sharedFile = currentFilesRef.current?.find(
            (f) => f.path === path,
          );
          sharedFile && ytext.insert(0, sharedFile?.content);
        } else return;
      } else return;
    };

    provider.on("sync", handleSync);

    return () => {
      isCollaborating.current = false;
      provider.off("sync", handleSync);
      binding?.destroy();
      provider.destroy();
      ydocument.destroy();
    };
  }, [path, editorDidMount]);
};

export const useFilesCollaboration = (
  roomId: string,
  setFiles: (files: file[]) => void,
  setRemoteUserCount: (remoteUserCount: number) => void,
  files?: file[],
) => {
  if (!roomId) return;

  const ydoc = new Y.Doc();
  const provider = new WebsocketProvider(wsServerUrl, roomId, ydoc);
  const yarray = ydoc.getArray<file>(roomId); //shared array type
  setRemoteUserCount(Math.max(0, provider.awareness.getStates().size));
  window.sessionStorage.setItem(
    "connected_users",
    JSON.stringify(Math.max(0, provider.awareness.getStates().size)),
  );

  let cleanupAwareness: (() => void) | undefined = getRemoteUsersCount(
    provider,
    setRemoteUserCount,
  );

  const handleSync = async (isSyncronized: boolean) => {
    if (isSyncronized) {
      if ((files && files?.length !== 0) && yarray.length === 0) {
        yarray.insert(0, files);
      }
      setFiles(yarray.toArray());
      console.log(yarray.toArray());
      await sessionStorage.put("files", yarray.toArray());
      putAllFiles(yarray.toArray());
    } else return;
  };

  provider.on("sync", handleSync);

  return () => {
    cleanupAwareness?.(); //cleanup the remote users count
    provider.off("sync", handleSync);
    provider.destroy();
    ydoc.destroy();
  };
};
