import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // eslint-disable-line import/named

const ContactPage = () => {
    return (
        <section className="contactPage">
            <div className="row">
                <div className="col-sm-12 my-3 text-center">
                    <h5>
                        <a href="https://www.linkedin.com/in/ppiech/">
                            <FontAwesomeIcon icon={['fab', 'linkedin']} /> /ppiech
                        </a>
                    </h5>
                    <h5>
                        <a href="https://github.com/Tenemo">
                            <FontAwesomeIcon icon={['fab', 'github']} /> /Tenemo
                        </a>
                    </h5>
                    <h5>
                        <a href="mailto:piotr@piech.dev">
                            <FontAwesomeIcon icon={['far', 'envelope']} /> piotr@piech.dev
                        </a>
                    </h5>
                </div>
            </div>
        </section>
    );
};

export default ContactPage;
