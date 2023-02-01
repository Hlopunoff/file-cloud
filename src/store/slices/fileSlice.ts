import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../firebase';
import { IFile } from '../../models/IFile';

interface IInitial {
    isLoading: boolean;
    error: string;
    file: IFile | null;
}

const initialState: IInitial = {
    isLoading: false,
    error: '',
    file: null
};

export const getFile = createAsyncThunk<any, string, {rejectValue: string}>(
    'file/getFile',
    async (fileName, {rejectWithValue}) => {
        try {
            const fileRef = await getDownloadURL(ref(storage, fileName));

            const res = await fetch(fileRef);
            const text = await (await res.blob()).text();
            
            return {
                content: text,
                path: fileName,
                name: fileName.split('/')[1]
            };
        } catch (error) {
            rejectWithValue((error as Error).message);
        }
    }
);

const fileSlice = createSlice({
    name: 'file',
    initialState,
    reducers: {
        editFile: (state, action) => {
            state.file!.content = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(getFile.pending, (state) => {
            state.isLoading = true;
            state.error = '';
        })
        .addCase(getFile.fulfilled, (state, action) => {
            state.file = action.payload;
            state.isLoading = false;
        })
        .addCase(getFile.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });
    }
});

export default fileSlice.reducer;
export const {editFile} = fileSlice.actions;