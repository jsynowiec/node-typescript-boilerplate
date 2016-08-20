import { expect } from 'chai';

import main from '../src/main';

describe('main module', function () {
  it('should export greeter function', () => {
    expect(main).to.haveOwnProperty('greeter');
    expect(typeof main.greeter).to.equal('function');
  });

  describe('greeter function', function () {
    it('should greet a user', () => {
      expect(main.greeter('John')).to.equal('Hello, John');
      expect(main.greeter('Stacy')).to.equal('Hello, Stacy');
    });
  });
});
