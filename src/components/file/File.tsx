import {FC, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import {ref, getDownloadURL} from 'firebase/storage';
import { storage } from '../../firebase';
import { IFile } from '../../models/IFile';
import { deleteFile } from '../../store/slices/filesSlice';

import s from './file.module.scss';

export const File:FC<Pick<IFile, "id" | "name" | "path">> = ({name, path, id}) => {
    const dispatch = useAppDispatch();
    const [downloadUrl, setDownloadUrl] = useState('');

    const getDownloadLink = async () => {
        try {
            const currUrl = await getDownloadURL(ref(storage, path));
            
            setDownloadUrl(currUrl);
        } catch (error) {
            console.log(error);
        }
    };

    const onDelete = () => {
        console.log(id);
        
        dispatch(deleteFile({ref: ref(storage, path), id}));
    };

    useEffect(() => {
        getDownloadLink();
    }, []);

    return (
        <li className={s['file']} data-file-path={path}>
            <a 
                href={downloadUrl} 
                className={`${s['file__btn']} ${s['file__btn_download']}`}
                download={name}>{name}
            </a>
            <div className={s['file__actions']}>
                <button 
                    onClick={onDelete}
                    className={`${s['file__btn']} ${s['file__btn_delete']}`}>Удалить</button>
                <Link to={`/${id}`} className={`${s['file__btn']} ${s['file__btn_edit']}`}>Редактировать</Link>
            </div>
        </li>
    );
};