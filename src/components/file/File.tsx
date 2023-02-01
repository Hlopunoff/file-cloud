import {FC} from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import {ref} from 'firebase/storage';
import { storage } from '../../firebase';
import { IFile } from '../../models/IFile';
import { deleteFile } from '../../store/slices/filesSlice';

import s from './file.module.scss';

export const File:FC<Pick<IFile, "id" | "name" | "path" | "link">> = ({name, path, id, link}) => {
    const dispatch = useAppDispatch();

    const onDelete = () => {
        dispatch(deleteFile({ref: ref(storage, path), id}));
    };

    return (
        <li className={s['file']} data-file-path={path}>
            <a
                href={link}
                download={name}
                className={`${s['file__btn']} ${s['file__btn_download']}`}>{name}
            </a>
            <div className={s['file__actions']}>
                <button 
                    onClick={onDelete}
                    className={`${s['file__btn']} ${s['file__btn_delete']}`}>Удалить</button>
                <Link to={`/files/${id}`} className={`${s['file__btn']} ${s['file__btn_edit']}`}>Редактировать</Link>
            </div>
        </li>
    );
};