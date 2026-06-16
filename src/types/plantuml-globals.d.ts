interface PlantUmlRenderResult {
  status: string;
  message?: string;
  line?: number;
}

declare function cheerpjInit(options?: {
  disableLoadTimeReporting?: boolean;
  disableErrorReporting?: boolean;
}): Promise<void>;
declare function cheerpjRunMain(main: string, jar: string, ...args: string[]): Promise<void>;
declare function cjCall(className: string, method: string, ...args: unknown[]): Promise<string>;
declare function cjFileBlob(filename: string): Promise<Blob>;
declare function cheerpjGetFSMountForPath(path: string): { dbConnection: IDBDatabase };
