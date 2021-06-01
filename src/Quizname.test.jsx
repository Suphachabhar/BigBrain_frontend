import { shallow } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import { Quizname } from './components/Quizname.style';

describe('OptionStyle', () => {
  // test the option style component
  it('uses custom title', () => {
    const title = 'A custom title';
    const quizname = shallow(<Quizname title={title} />);
    expect(quizname.text()).toBe(title);
  });

  it('renders with provided title (snapshot)', () => {
    const quizname = renderer.create(<Quizname title={'title'} />).toJSON;
    expect(quizname).toMatchSnapshot();
  });
});
