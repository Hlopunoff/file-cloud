import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { storage } from '../../firebase';
import {  RootState } from '..';
import { ref, listAll, uploadBytesResumable, StorageReference, deleteObject, getBlob } from 'firebase/storage';
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
                    id: uuidv4(),
                    link: ''
                };
            });

            const dataBlobs = await Promise.all(files.items.map(async file => {
                return await getBlob(ref(storage, file.fullPath));
            }));
            const dataLinks = dataBlobs.map(blob => URL.createObjectURL(blob))
            
            
            return data.map((file, i) => ({...file, link: dataLinks[i]}));
        } catch (error) {
            rejectWithValue((error as Error).message);
        }
    }
);

export const uploadFiles = createAsyncThunk<any, {files: FileList, purpose: "upload" | "update"}, {rejectValue: string, state: RootState}>(
    'files/uploadFiles',
    async ({files, purpose}, {rejectWithValue, getState}) => {
        try {
            const data: Pick<IFile, "id" | 'name' | "path" | "link">[] = [];
            const sendFile = async (initialFile:File) => {
                const storageRef = ref(storage, `files/${initialFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, initialFile);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        switch (snapshot.state) {
                            case 'paused':
                                break;
                            case 'running':
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
                const blob1 = new Blob([initialFile.slice(0, initialFile.size)], {type: 'text/plain'});
                const href = URL.createObjectURL(blob1);
                
                data.push({ name: initialFile.name, path: `files/${initialFile.name}`, id: uuidv4(), link: href });
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