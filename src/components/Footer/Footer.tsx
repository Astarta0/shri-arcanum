import React from 'react';

import Link from 'src/components/Link';
import './Footer.css';

const Footer = () => (
    <footer className="footer">
        <div className="footer__title">Trade secrets of Yandex LLC. 16, Lev Tolstoy Str., Moscow,
            Russia, 119021
        </div>
        <div className="footer__version">UI: 0.1.15</div>
        <div className="footer__copyright">
            © 2007—2019
            <Link href="https://yandex.ru">Yandex</Link>
        </div>
    </footer>
);

export default Footer;
