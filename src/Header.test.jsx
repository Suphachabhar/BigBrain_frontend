import { shallow } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import { Header } from './components/Header.styles';

describe('Header', () => {
  // test the header component
  it('uses custom title', () => {
    const title = 'A custom title';
    const header = shallow(<Header title={title} />);
    expect(header.text()).toBe(title);
  });

  it('renders with provided title (snapshot)', () => {
    const header = renderer.create(<Header title={'title'} />).toJSON;
    expect(header).toMatchSnapshot();
  });
});
