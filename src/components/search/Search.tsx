import {useState, FC} from 'react';

import s from './search.module.scss';

interface ISearchProps {
    getSearchParam: (value: string) => void;
    onClose: () => void;
}

export const Search:FC<ISearchProps> = ({getSearchParam, onClose}) => {
    const [searchParam, setSearchParam] = useState('');

    const onSearch:React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setSearchParam(e.target.value);
    };

    return (
        <div className={s['search']}>
            <h4 className={s['search__title']}>Найти слово(а)</h4>
            <input 
            type="text" 
            className={s['search__field']} 
            placeholder='Поиск'
            value={searchParam}
            onChange={onSearch}/>
            <button 
            className={s['search__btn']}
            onClick={() => {
                getSearchParam(searchParam.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").trim());
                onClose();
            }}>Найти</button>
        </div>
    );
};