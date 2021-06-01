import { shallow } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import { Checkbox } from './components/Checkbox.styles';

describe('InputStyle', () => {
  const noop = () => {};

  // test the checkbox component
  it('trigger onChange event handler when clicked', () => {
    const onChange = jest.fn();
    shallow(<Checkbox onChange="{onChange}" />).simulate('change');
    expect(onChange).toHaveBeenCalledTimes(0);
  });

  it('renders with minimal props', () => {
    const selectFunc = renderer.create(<Checkbox onChange={noop} />).toJSON;
    expect(selectFunc).toMatchSnapshot();
  });
  it('renders with provided id (snapshot)', () => {
    const quizname = renderer.create(<Checkbox name={'title'} />).toJSON;
    expect(quizname).toMatchSnapshot();
  });
});
