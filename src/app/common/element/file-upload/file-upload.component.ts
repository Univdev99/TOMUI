import { NgForm } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ElementService } from '../element.service';
import * as $ from 'jquery';
import * as _ from 'lodash';
import { saveAs } from 'file-saver';
import { elementRest } from '../elementRest';
import { BackEndService } from '../../back-end.service';
import { constants } from '../../../app.constants';
import { DocumentUpload } from './documentupload';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

    supportedFormatAsText = '';
    allowedExtentionTypeArray = [];
    @ViewChild(NgForm, { static: false }) form;
    isuploading = false;
    submitted = false;
    appConstant = constants
    elementRest = elementRest;
    documentTypeClause = '1=2';
    _data: DocumentUpload;
    tempFileSize:number;
    public config = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true
    };
    @Input()
    set data(value) {
        this._data = value;
        if (this.data) {
            if (this.docId && this.docId.length > 0) {
                this.loadDocumentList(this.data.objectId, this.data.documentTitle, this.data.moduleName, this.docId.join(','), this.data.source);
            } else if (this.data.objectId) {
                this.loadDocumentList(this.data.objectId, this.data.documentTitle, this.data.moduleName, null, this.data.source);
            } else {
                this.documentList = [];
            }
        }
    }
    get data() {
        return this._data;
    }

    @Input()
    disable = false;

    // please pass file type as comma seperated string.
    // example '.jpg,.jpeg,.bmp,.png,.html,.htm,.rtf,.txt,.xls,.xlsx,.doc,.docx,.gif,.pdf,.xml,.tif,.tiff' without whitespace between two types
    @Input()
    allowedExtentionType;

    @Input()
    multiple = false;

    @Input()
    dragAndDrop = false;

    @Input()
    fileSize = 10;

    @Input()
    maximumUploadLimit = 5

    @Input()
    docId;

    @Input()
    fileListSize = 0;


    formData = new FormData();

    @Output()
    docLoadEvent = new EventEmitter();


    // added by ketan
    @Output()
    docRemoveEvent = new EventEmitter();

    // Added By Kaushal Baria
    @Output()
    docListEvent = new EventEmitter();

    documentList = [];

    @Input()
    documentViewerIconRequired = true;

    constructor(private elementService: ElementService,
        private delegatorService: BackEndService) {

        $(document).on('dragover dragenter', '#drop-zone', function (event) {
            $('#drop-zone').addClass('onDragFile');
        });
        $(document).on('dragleave dragend drop', '#drop-zone', function () {
            $('#drop-zone').removeClass('onDragFile');
        });
    }

    ngOnInit() {
        if (!this.allowedExtentionType) {
            // this.allowedExtentionType = '.jpg,.jpeg,.bmp,.png,.html,.htm,.rtf,.txt,.xls,.xlsx,.doc,.docx,.gif,.pdf,.xml,.tif,.tiff';
            this.allowedExtentionType = '.doc,.pdf';
            this.allowedExtentionTypeArray = this.allowedExtentionType.split(',');
        } else {
            this.allowedExtentionTypeArray = this.allowedExtentionType.toLowerCase().split(',');
        }
        this.supportedFormatAsText = 'Document upload maximum file size is ' + this.fileSize + ' MB. Maximum document upload count is ' + this.maximumUploadLimit + '. Document upload supported format(s) as ' + this.allowedExtentionType;
        // if (this.data && this.data.objectId) {
        //     this.documentList = this.loadDocumentList(this.data.objectId, this.data.documentTitle, this.data.moduleName, null, this.data.source);
        // }
    }

    loadDocumentList(transactionId, documentTitle, moduleName, docId = null, source = null) {
        const callback = (result, headers) => {
            this.documentList = result;
            this.docLoadEvent.emit(this.documentList);
        };
        const errorCallBack = (result, headers) => { }
        const json = { 'transactionId': transactionId, 'documentTitle': documentTitle, 'docId': docId, 'source': source, 'moduleName': moduleName };
        this.elementService.getDocument(json, callback, errorCallBack);
    }

    viewDocument(docId) {
        // AA this.documentCommonMethodService.viewDocument([docId], 0, this.documentViewerActionControll, this.actionCenterData);
    }

    fileChange(event) {
        const fileList: FileList = event.target.files;
        let supportedDocumentType = false;
        let duplicateFile = false;
        this.tempFileSize = 0;

        const duplicateCheckFileArray = _.filter(this.documentList, 'FileName');

        if (fileList.length > 0) {
            if (_.find(duplicateCheckFileArray, { 'FileName': fileList[0].name.substring(0, fileList[0].name.lastIndexOf('.')) })) {
                duplicateFile = true;
            }
            const filename = fileList[0].name;
            const extension = filename.substring(filename.lastIndexOf('.'), filename.length);
            if (this.allowedExtentionType.indexOf(extension.toLowerCase()) > -1) {
                supportedDocumentType = true;
            }
        }

        if (fileList.length === 1 && supportedDocumentType && !duplicateFile) {

            this.formData = null;
            this.formData = new FormData();
            this.isuploading = true;
            const file: File = fileList[0];

            if (this.fileSize && file.size === 0) {
                //AA this.delegatorService.showMessages('error', { 'message': 'Unable to upload file "' + file.name + '"  cause of size 0 MB.' });
                this.isuploading = false;
                event.target.value = '';
                return;
            }

            if (this.fileSize && this.fileSize < file.size && file.size / 1024 / 1024 > Number(this.fileSize)) {
                // this.delegatorService.showMessages('error', { 'message': 'Selected file "' + file.name + '" can\'t be attached or uploaded as it exceeds the permissible size limit. Please select file size less then or equal to ' + this.fileSize + ' MB.' });
                this.isuploading = false;
                event.target.value = '';
                return;
            }

            if (this.fileListSize + this.documentList.length >= this.maximumUploadLimit) {
                //AA this.delegatorService.showMessages('error', { 'message': 'Maximum ' + this.maximumUploadLimit + ' file(s) allowed.' });
                this.isuploading = false;
                event.target.value = '';
                return;
            }
            // }
            this.tempFileSize = file.size/1024;
            this.tempFileSize = Number(this.tempFileSize.toFixed(2));
            this.formData.append('file', file, file.name);
            this.formData.append('dataObject', JSON.stringify(this.data));

            const callBack = (result, headers) => {
                if (result) {
                    result.forEach(element => {
                        element['size'] = this.tempFileSize;
                        this.documentList.push(element);
                    });

                    // const data = result;
                    // this.documentList.push({ 'documentId': data.documentId, 'docTitle': data.docTitle, 'createdDate': data.createdDate, 'docPath': data.docPath, });
                    this.docListEvent.emit(this.documentList);
                    this.isuploading = false;
                } else {
                    this.isuploading = false;
                    $('#fileUpload').val('');
                    event.stopPropagation();
                    event.preventDefault();
                    //AA this.delegatorService.showMessages('error', { 'message': result.message });
                    return false;
                }
            };

            const errorCallBack = (result, headers) => {
                this.isuploading = false;
                $('#fileUpload').val('');
                event.stopPropagation();
                event.preventDefault();
                return false;
            };

            this.elementService.uploadDocument(this.formData, callBack, errorCallBack);

        } else if (duplicateFile) {
            //AA this.delegatorService.showMessages('info', { 'message': 'Duplicate file will not be processed.' });
            $('#fileUpload').val('');
            event.stopPropagation();
            event.preventDefault();
            return false;
        } else if (!supportedDocumentType) {
            //AA this.delegatorService.showMessages('info', { 'message': 'Files with unsupportable file format will not be processed.' });
            $('#fileUpload').val('');
            event.stopPropagation();
            event.preventDefault();
            return false;
        } else {
            $('#fileUpload').val('');
            event.stopPropagation();
            event.preventDefault();
            return false;
        }
    }

    // F i l e  u p l o a d  m e t h o d  f o r  d r a g  &  d r o p  f u n c t i o n a l i t y
    ondrop(event) {
        $('#drop-zone').removeClass('onDragFile');
        let unsupportedFileTypeError = false;
        let filearr: File[] = [];
        const fileList = Array.from(event.dataTransfer.files);
        let duplicateFiles = [];
        let duplicateFile = false;

        if (fileList.length === 0) {
            //AA this.delegatorService.showMessages('info', { 'message': 'No document(s) found for upload.' });
            event.stopPropagation();
            event.preventDefault();
            return false;
        } else {
            // Get list of current uploaded file(s)
            const duplicateCheckFileArray = _.filter(this.documentList, 'FileName');
            fileList.forEach((e: any, i) => {
                if (_.find(duplicateCheckFileArray, { 'FileName': e.name.substring(0, e.name.lastIndexOf('.')) })) {
                    duplicateFiles.push(e);
                    duplicateFile = true;
                }
            });

            if (duplicateFile) {

                duplicateFiles.forEach(e => {

                    _.remove(fileList, function (element: any) { return element.name === e.name && e.size === e.size })

                });
                //AA this.delegatorService.showMessages('info', { 'message': 'Duplicate file(s) will not be processed.' });
            }
            if (fileList.length !== 0) {
                // T o  c h e c k  a n y  f i l e  e x i s t  o r  n o t
                if (fileList.length > 0 && (fileList.length < (this.maximumUploadLimit > 5 ? 6 : this.maximumUploadLimit + 1))) {
                    // T o  c h e c k  f o r  o n l y  s u p p o r t e d  f i l e  c a n  u p l o a d.
                    for (let i = 0; i < fileList.length; i++) {
                        const file: any = fileList[i];
                        const filename = file.name;
                        const extension = filename.substring(filename.lastIndexOf('.'), filename.length);
                        if (this.allowedExtentionTypeArray.indexOf(extension.toLowerCase()) > -1) {
                            filearr.push(file);
                        } else {
                            unsupportedFileTypeError = true;
                        }
                    }
                    // E R R O R  M E S S A G E  F L A S H  I F  U N S U P P O R T E D  F I L E S  A R R I V E D
                    if (unsupportedFileTypeError && filearr.length === 0) {
                        //AA this.delegatorService.showMessages('info', { 'message': 'Files with unsupportable file format cannot be processed.<br/>Please select valid format files.' });
                    } else if (unsupportedFileTypeError) {
                        // AA this.delegatorService.showMessages('info', { 'message': 'Files with unsupportable file format will not be processed.' });
                    }

                    if (this.data && this.fileListSize + this.documentList.length + filearr.length > this.maximumUploadLimit) {
                        //AA this.delegatorService.showMessages('error', { 'message': 'Maximum ' + this.maximumUploadLimit + ' files allowed.' });
                    } else {
                        this.isuploading = true;
                        // T H I S  W I L L  B E  U P L O A D  F I L E  O N E  B Y  O N E.
                        for (let i = 0; i < filearr.length; i++) {
                            const file: File = filearr[i];
                            if (this.fileSize && file.size === 0) {
                                //AA this.delegatorService.showMessages('error', { 'message': 'Unable to upload file "' + file.name + '"  cause of size 0 MB.' });
                            } else if (file.size && file.size / 1024 / 1024 > Number(this.fileSize)) {
                                //AA this.delegatorService.showMessages('error', { 'message': 'Selected file "' + file.name + '" can\'t be attached or uploaded as it exceeds the permissible size limit. Please select file size less then or equal to ' + this.fileSize + ' MB.' });
                            } else {
                                this.formData = null;
                                this.formData = new FormData();
                                this.formData.append('file', file, file.name);
                                this.formData.append('dataObject', JSON.stringify(this.data));
                                const callBack = (result, headers) => {
                                    if (result) {
                                        const data = result;
                                        this.documentList.push({ 'docTitle': data.docTitle, 'documentId': data.documentId, 'docPath': data.docPath });
                                        this.docListEvent.emit(this.documentList);
                                    } else {
                                        //AA this.delegatorService.showMessages('error', { 'message': result.message });
                                    }
                                };
                                const errorCallBack = (result, headers) => { };
                                this.elementService.uploadDocument(this.formData, callBack, errorCallBack);
                            }
                        }
                        this.isuploading = false;
                    }
                } else {

                    // added condition if user simply drag and drop text on component.
                    let message = fileList.length === 0 ? 'No document(s) found for upload.' : 'You can upload maximum ' + (this.maximumUploadLimit > 5 ? 5 : this.maximumUploadLimit) + ' files at a time.';
                    //AA this.delegatorService.showMessages('info', { 'message': message });
                }
                event.stopPropagation();
                event.preventDefault();
                return false;
            } else {
                event.stopPropagation();
                event.preventDefault();
                return false;
            }
        }
    }

    // -------------t h i s   m e t h o d   i s  r e q u i r e d   b e c a u  s e   o f   i t   n o  n e e d   r e d i r e t i n f   t o   o p e n  f i l e   i n   i t .
    dragover(e) {
        e.preventDefault();
        return false;
    }

    // --------------------------------------------------------------  download document ????? duplicate
    downloadDocument(docId, index) {
        const jsonObj = {
            'acceptType': 'application/octet-stream',
            'docId': docId
        };
        const callBack = (result: Response, headers) => {
            const blob = new Blob([result['_body']], { type: 'application/octet-stream' });
            saveAs(blob, headers.get(this.appConstant.fileName));
        };
        this.elementService.downloadDocument(jsonObj, 'document/commonDocumentDownload', callBack);
    }

    isDuplicateFile(file) {
        let tempObj = _.find(this.documentList, { 'DocTitle': file.name.substring(0, file.name.lastIndexOf('.')) });
        return tempObj ? true : false;
    }

    openDocumentInNewTab(docPath) {
        if (docPath) {
            window.open(docPath)
        }
    }

    deleteDocument(documentId, index) {
        if (documentId) {
            const deleteDocumentSuccess = (result) => {
                this.documentList.splice(index, 1);
            }
            const json = {
                'documentId': documentId
            }
            this.elementService.deleteDocument(json, deleteDocumentSuccess);
        }
    }
}
