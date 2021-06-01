import { shallow } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import { Button } from './components/Button.styles';

describe('Button', () => {
  const noop = () => {};

  // test the button component
  // it = particular object -> Button
  it('trigger onClick event handler when clicked', () => {
    const onClick = jest.fn();
    shallow(<Button onClick="{onClick}" />).simulate('click');
    expect(onClick).toHaveBeenCalledTimes(0);
  });

  it('uses custom title', () => {
    const title = 'A custom title';
    const button = shallow(<Button onClick={noop} title={title} />);
    expect(button.text()).toBe(title);
  });

  it('renders with minimal props', () => {
    const button = renderer.create(<Button onClick={noop} />).toJSON;
    expect(button).toMatchSnapshot();
  });

  it('renders with provided title (snapshot)', () => {
    const button = renderer.create(<Button onClick={noop} title={'title'} />).toJSON;
    expect(button).toMatchSnapshot();
  });
});
