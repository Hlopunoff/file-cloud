import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { storage } from '../../firebase';
import { RootState } from '..';
import { ref, listAll, uploadBytesResumable, StorageReference, deleteObject } from 'firebase/storage';
import {v4 as uuidv4} from 'uuid';
import { IFile } from '../../models/IFile';

interface IInitialState {
    isLoading: boolean;
    error: string;
    files: IFile[];
}

const initialState: IInitialState = {
    isLoading: true,
    files: [],
    error: ''
};

export const getFiles = createAsyncThunk<any, undefined, { rejectValue: string}>(
    'files/getFiles',
    async (_, {rejectWithValue}) => {
        try {
            const listRef = ref(storage, 'files/');
            const files = await listAll(listRef);
            
            const data = files.items.map(file => {
                return {
                    name: file.name,
                    path: file.fullPath,
                    id: uuidv4()
                };
            });
            return data;
        } catch (error) {
            rejectWithValue((error as Error).message);
        }
    }
);

export const uploadFiles = createAsyncThunk<any, {files: FileList, purpose: "upload" | "update"}, {rejectValue: string, state: RootState}>(
    'files/uploadFiles',
    async ({files, purpose}, {rejectWithValue, getState}) => {
        try {
            const data: Pick<IFile, "id" | 'name' | "path">[] = [];
            const sendFile = async (initialFile:File) => {
                const storageRef = ref(storage, `files/${initialFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, initialFile);

                 uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        switch (error.code) {
                            case 'storage/unauthorized':
                                break;
                            case 'storage/canceled':
                                break;
                            case 'storage/unknown':
                                break;
                        }
                    }
                );
                data.push({ name: initialFile.name, path: `files/${initialFile.name}`, id: uuidv4() });
            };
            Array.from(files).forEach(async (file) => {
                if (getState().files.files.some(f => f.name === file.name) && purpose === 'upload') {
                    const blob = file.slice(0, file.size, 'text/plain');
                    const newFile = new File([blob], file.name.split('.').join(`(${uuidv4()}).`), {type: 'text/plain'});
                    await sendFile(newFile);
                } else {
                    await sendFile(file);
                }
            });
            return data;
        } catch (error) {
            rejectWithValue((error as Error).message);
        }
    }
);

export const deleteFile = createAsyncThunk<any, {ref: StorageReference, id: string}, {rejectValue: string}>(
    'files/deleteFile',
    async ({ref, id}, {rejectWithValue}) => {
        try {
            await deleteObject(ref);
            return id;
        } catch (error) {
            rejectWithValue((error as Error).message);
        }
    }
);

const filesSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getFiles.pending, (state) => {
            state.isLoading = true;
            state.error = '';
        })
        .addCase(getFiles.fulfilled, (state, action) => {
            state.files = action.payload;
            state.isLoading = false;
        })
        .addCase(getFiles.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        })
        .addCase(uploadFiles.pending, (state) => {
            state.isLoading = true;
            state.error = '';
        })
        .addCase(uploadFiles.fulfilled, (state, action) => {
            state.files = [...state.files, ...action.payload];
            state.isLoading = false;
        })
        .addCase(uploadFiles.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        })
        .addCase(deleteFile.fulfilled, (state, action) => {
            state.files = state.files.filter(file => file.id !== action.payload);
        });
    }
});

export default filesSlice.reducer;