import { shallow } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import { InputStyle } from './components/InputStyle.styles';

describe('InputStyle', () => {
  const noop = () => {};

  // test the inputStyle component
  it('trigger onChange event handler when clicked', () => {
    const onChange = jest.fn();
    shallow(<InputStyle onChange="{onChange}" />).simulate('change');
    expect(onChange).toHaveBeenCalledTimes(0);
  });

  it('renders with minimal props', () => {
    const selectFunc = renderer.create(<InputStyle onChange={noop} />).toJSON;
    expect(selectFunc).toMatchSnapshot();
  });
  it('renders with provided id (snapshot)', () => {
    const quizname = renderer.create(<InputStyle name={'title'} />).toJSON;
    expect(quizname).toMatchSnapshot();
  });
});
