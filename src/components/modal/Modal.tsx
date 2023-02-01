import {FC, useEffect, useMemo} from 'react';
import {createPortal} from 'react-dom';

import s from './modal.module.scss';

const modalRootElem = document.querySelector('#modal');
interface IModalProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

export const Modal:FC<IModalProps> = ({children, isOpen, onClose}) => {
    const element = useMemo(() => document.createElement('div'), []);

    useEffect(() => {
        modalRootElem?.appendChild(element);

        return () => {
            modalRootElem?.removeChild(element)
        };
    }, []);

    if(isOpen) {
        return createPortal(
            <div 
            className={s['modal__wrap']} 
            onClick={(e) => {
                if(e.target === e.currentTarget) {
                    onClose();
                }
            }}>
                <div className={s['modal__content']}>{children}</div>
            </div>,
            element
        );
    }

    return null;
};