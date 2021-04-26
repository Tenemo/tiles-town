import React from 'react';
import ContactPage from './ContactPage';

describe('ContactPage', () => {
    it('matches snapshot', () => {
        const wrapper = shallow(
            <ContactPage />
        );
        expect(wrapper).toMatchSnapshot();
    });
});