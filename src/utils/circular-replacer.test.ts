import { circularReplacer } from './circular-replacer';
import { expect } from 'chai';

describe('circularReplacer', () => {
  it('should remove circular properties from self referencing structures', () => {
    const circularStructure: {[key: string]: any} = mockObjectWithCircularProperty();
    const result: string = JSON.stringify(circularStructure, circularReplacer());
    const expectedResult: string = JSON.stringify(getBaseObject());

    expect(result).to.equal(expectedResult);
  });
});

function getBaseObject(): {[key: string]: any} {
  return {
    property: 'property',
    objectProperty: {nestedProperty: 'nestedProperty'}
  };
}

function mockObjectWithCircularProperty(): {[key: string]: any} {
  const mock: {[key: string]: any} = getBaseObject();

  mock.circularProperty = mock;

  return mock;
}

  