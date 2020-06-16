import { MemoizeObject } from './memoize-object.decorator';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

chai.use(spies);

interface TestCase {
  execute: (param: Object) => void;
  verify: (_: Object) => void;
}

class SimpleCase implements TestCase {
  @MemoizeObject()
  execute(param: object) {
    this.verify(param);
  }

  verify(_: object) {}
}

class CircularCase implements TestCase {
  @MemoizeObject({circular: true})
  execute(param: object) {
    this.verify(param);
  }

  verify(_: object) {}
}

describe('MemoizeObject', () => {
  let spy: Function;
  let test: TestCase;

  it('should memoize primitives', () => {
    test = new SimpleCase();
    spy = chai.spy.on(test, 'verify');

    runDecoratorTests({circular: false, type: 'primitive'});
  });

  it('should memoize complex structures', () => {
    test = new SimpleCase();
    spy = chai.spy.on(test, 'verify');

    runDecoratorTests({circular: false, type: 'object'});
  });

  it('should memoize circular structures when circular flag is set to true', () => {
    test = new CircularCase();
    spy = chai.spy.on(test, 'verify');
  
    runDecoratorTests({circular: true});
  });

  function runDecoratorTests({circular, type}: {circular: boolean, type?: 'primitive' | 'object'}) {
    const {initial, next}: {initial: number | object, next: number | object} = circular || type === 'object'
      ? mockComplexParams({circular})
      : mockPrimitiveParams();

    test.execute(initial);
    test.execute(initial);
    test.execute(initial);
    test.execute(next);
    
    expect(spy).to.have.been.called.twice;
    expect(spy).to.have.been.first.called.with(initial);
    expect(spy).to.have.been.second.called.with(next);
  }
});

function mockPrimitiveParams(): {initial: number, next: number} {
  const initial: number = Math.random();

  return {
    initial,
    next: initial + 1
  };
}

function mockComplexParams(options: {circular?: boolean}): {initial: object, next: object} {
  const initial: object = mockObject(options);

  return {
    initial,
    next: {...initial, property: 'updatedProperty'}
  };
}

function mockObject({circular, property}: {circular?: boolean, property?: string} = {}): object {
  const mock: {[key: string]: any} = {
    property,
    objectProperty: {nestedProperty: 'nestedProperty'}
  };

  if(circular) {
    mock.circularProperty = mock;
  }

  return mock;
}
