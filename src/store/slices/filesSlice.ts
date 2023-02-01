import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { storage } from '../../firebase';
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

export const uploadFiles = createAsyncThunk<any, FileList, {rejectValue: string}>(
    'files/uploadFiles',
    async (files, {rejectWithValue}) => {
        try {
            const data: Pick<IFile, "id" | 'name' | "path">[] = [];
            Array.from(files).forEach(async (file) => {
                const storageRef = ref(storage, `files/${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);

                // Listen for state changes, errors, and completion of the upload.
                await uploadTask.on('state_changed',
                    (snapshot) => {
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
                        // A full list of error codes is available at
                        // https://firebase.google.com/docs/storage/web/handle-errors
                        switch (error.code) {
                            case 'storage/unauthorized':
                                // User doesn't have permission to access the object
                                break;
                            case 'storage/canceled':
                                // User canceled the upload
                                break;

                            // ...

                            case 'storage/unknown':
                                // Unknown error occurred, inspect error.serverResponse
                                break;
                        }
                    }
                );
        
                data.push({name: file.name, path: `files/${file.name}`, id: uuidv4()});
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