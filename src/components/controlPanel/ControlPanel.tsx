import { useAppDispatch } from '../../hooks/redux';
import { uploadFiles } from '../../store/slices/filesSlice';

import s from './controlPanel.module.scss';

export const ControlPanel = () => {
    const dispatch = useAppDispatch();

    const onUploadFile:React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if(e.target.files) {
            dispatch(uploadFiles({files: e.target.files, purpose: 'upload'}));
        }
    };

    return (
        <div className={s['panel']}>
            <div className={s['panel__action']}>
                <label 
                    htmlFor="upload" 
                    className={s['panel__actionLabel']}>
                    Добавить файл</label>
                <input 
                    type="file" 
                    className={s['panel__actionInput']} 
                    id="upload"
                    onChange={onUploadFile}
                    multiple
                    accept='text/plain'
                    />
            </div>
        </div>
    );
};