import { useEffect, FC, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFile, editFile } from "../../store/slices/fileSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { uploadFiles } from '../../store/slices/filesSlice';

import { Modal } from '../modal/Modal';
import { Search } from '../search/Search';

import s from './editFile.module.scss';

interface IEditProps {
    fileId: string | undefined;
}

export const EditFile:FC<IEditProps> = ({fileId}) => {
    const [isOpen, setIsOpen] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [file] = useAppSelector((state) => state.files.files.filter(({ id }) => id === fileId));
    const { file: f, isLoading, error: isError } = useAppSelector(state => state.file);

    useEffect(() => {
        dispatch(getFile(file.path));
    }, [ ]);

    const onHandleChange:React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        dispatch(editFile(e.target.value));
    };

    const onSave: React.MouseEventHandler<HTMLButtonElement> = () => {
        const newBlob = new Blob([f!.content.trim()]);
        const file = new File([newBlob], f!.name, { type: 'text/plain' });
        const dt = new DataTransfer();
        dt.items.add(file);
        const fileList = dt.files;

        dispatch(uploadFiles({files: fileList, purpose: 'update'}));
        navigate('/');
    };

    const onOpenModal: React.MouseEventHandler<HTMLButtonElement> = () => {
        setIsOpen(true);
    };

    const loading = isLoading ? <span>Загрузка...</span> : null,
          error = isError ? <span>Ошибка!</span> : null,
          content = !(isLoading || isError || !f) ? (
            <textarea
            className={s['edit__field']}
            value={f.content}
            onChange={onHandleChange}></textarea>
    ) : null;

    return (
        <>
            <div className={s['edit']}>
                <h3 className={s['edit__filename']}>{file.name}</h3>
                {loading}
                {error}
                {content}
                <div className={s['edit__btns']}>
                    <button
                        className={`${s['edit__btn']} ${s['edit__btn_save']}`}
                        onClick={onSave}>
                        Сохранить</button>
                    <button 
                    className={`${s['edit__btn']} ${s['edit__btn_search']}`}
                    onClick={onOpenModal}>Поиск</button>
                </div>
                <p className={s['edit__text']} ref={textRef}>{!(isLoading || isError || !f) ? f.content : null}</p>
            </div>
            <Modal 
            isOpen={isOpen} 
            onClose={() => {
                setIsOpen(false);
            }}>
                <Search 
                getSearchParam={(value: string) => {
                    const reg = new RegExp(value, 'gi');
                    if(textRef.current) {
                        textRef.current.innerHTML = textRef.current.textContent!.replace(reg, match => `<mark>${match}</mark>`);
                    }
                }}
                onClose={() => {
                    setIsOpen(false);
                }}/>
            </Modal>
        </>
    );   
};