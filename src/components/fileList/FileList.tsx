import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import {useEffect} from 'react';
import { IFile } from '../../models/IFile';
import { getFiles } from '../../store/slices/filesSlice';

import { File } from '../file/File';
import s from './fileList.module.scss';

export const FileList = () => {
    const dispatch = useAppDispatch();
    const {isLoading, error: isError, files} = useAppSelector(state => state.files);

    useEffect(() => {
        dispatch(getFiles());
    }, [ ]);

    const loading = isLoading ? <h3>Загрузка...</h3> : null,
          error = isError ? <h3>Ошибка!</h3> : null,
          content = !(loading || error || !files) ? (files as IFile[]).map((file) => {
            return <File name={file.name} path={file.path} key={file.id} id={file.id}/>
    }): null;

    return (
        <>
            <ul className={s['list']}>
                {error}
                {loading}
                {content && content.length ? content : <h3 style={{textAlign: 'center'}}>Файлы не обнаружены</h3>}
            </ul>
        </>
    );
};