export class DocumentUpload {
    documentTitle: string;
    moduleName: string;
    source: string;
    objectId: string; 

    constructor(moduleName, source, objectId) {
        this.moduleName = moduleName;
        this.source = source;
        this.objectId = objectId;
    }
}
