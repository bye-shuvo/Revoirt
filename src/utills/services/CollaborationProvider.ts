import React, { useEffect } from "react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { WebsocketProvider } from 'y-websocket';
import { editor } from "monaco-editor";
import type { file } from "../../states/store";

//.env variables
const wsServerUrl = import.meta.env.VITE_WS_SERVER_URL;

export const useEditorCollaboration = (editorRef : React.RefObject<editor.IStandaloneCodeEditor | null >, currentFilesRef : React.RefObject<file[] | null> , isCollaborating : React.RefObject<boolean> , editorDidMount : boolean , path : string) => {

 //yjs implementation for collaborative code editor
  // Yjs documents are collections of shared objects that sync automatically.
 return useEffect(() => {
    if (!editorRef.current) return;
    const model = editorRef.current?.getModel();
    if (!model) return;

    const currentFile = currentFilesRef.current?.find((f) => f.path === path)
    if (!currentFile || !wsServerUrl) return;
    //yjs document to simulate a remote user
    const ydocument = new Y.Doc();

    //websocketprovider for syncronizing remote users
    const provider = new WebsocketProvider(wsServerUrl, currentFile?.id, ydocument);

    provider.on('status', (event: any) => {
      console.log(event.status) // logs "connected" or "disconnected"
    })

    const ytext = ydocument.getText(currentFile?.id); //shared text type

    let binding: MonacoBinding | null = null;

    const handleSync = (isSyncronized: boolean) => {
      if (isSyncronized) {
        if (editorRef.current) {
          binding?.destroy();
          isCollaborating.current = true;
          binding = new MonacoBinding(ytext, model, new Set([editorRef.current]), provider.awareness);
        } else return ;
        if (ytext.length === 0) {
          const sharedFile = currentFilesRef.current?.find((f) => f.path === path);
          sharedFile && ytext.insert(0, sharedFile?.content);
        } else return ;
      }
      else return ;
    }

    provider.on('sync', handleSync);

    return () => {
      isCollaborating.current = false;
      provider.off('sync', handleSync);
      binding?.destroy();
      provider.destroy();
      ydocument.destroy();
    }
  }, [path, editorDidMount]);
}