import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
      <p>&copy; {new Date().getFullYear()} {t('all_rights_reserved')}</p>
    </footer>
  );
};

export default Footer;
