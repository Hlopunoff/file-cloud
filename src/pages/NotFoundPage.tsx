import {Link} from 'react-router-dom';
export const NotFoundPage = () => {
    return (
        <div 
        className="errorPage" 
        style={{
            marginTop: '40px',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            rowGap: '20px',
            alignItems: 'center'
        }}>
            <h2 className="errorPage__title">Упс, такой страницы не существует</h2>
            <Link 
            to="/"
            style={{
                backgroundColor: '#000',
                color: '#fff',
                textDecoration: 'none',
                padding: '10px',
                borderRadius: '10px'
            }}>Вернуться на главную</Link>
        </div>
    );
};