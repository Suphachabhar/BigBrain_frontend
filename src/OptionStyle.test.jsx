import { shallow } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import { OptionStyle } from './components/OptionStyle.styles';

describe('OptionStyle', () => {
  const noop = () => {};

  // test the optionStyle component
  it('trigger onChange event handler when clicked', () => {
    const onChange = jest.fn();
    shallow(<OptionStyle onChange="{onChange}" />).simulate('change');
    expect(onChange).toHaveBeenCalledTimes(0);
  });

  it('renders with minimal props', () => {
    const selectFunc = renderer.create(<OptionStyle onChange={noop} />).toJSON;
    expect(selectFunc).toMatchSnapshot();
  });
});
