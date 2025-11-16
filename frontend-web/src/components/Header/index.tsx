import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import './Header.css';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>{t('app.title')}</h1>
          </Link>

          <nav className="nav">
            <Link to="/">{t('nav.home')}</Link>
            <Link to="/services">{t('nav.services')}</Link>
            <Link to="/parcours">{t('nav.parcours')}</Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard">{t('nav.dashboard')}</Link>
                {user?.role === 'partner' && <Link to="/partner">Partenaire</Link>}
                {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
                <button onClick={handleLogout} className="btn btn-outline">
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn btn-primary">
                  {t('nav.register')}
                </Link>
              </>
            )}
          </nav>

          <div className="language-switcher">
            <button onClick={() => changeLanguage('fr')} className={i18n.language === 'fr' ? 'active' : ''}>
              FR
            </button>
            <button onClick={() => changeLanguage('en')} className={i18n.language === 'en' ? 'active' : ''}>
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
