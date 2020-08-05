import { get, add, edit, del, importFile, exportFile } from './api';
import { tableTranslator } from './translator';

export const Get = params => get(params).then(tableTranslator);

export const Add = add;

export const Edit = edit;

export const Del = del;

export const ImportFile = importFile;

export const ExportFile = exportFile;