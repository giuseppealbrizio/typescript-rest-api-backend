import {cleanObject} from '../../utils/objects.utils';

describe('cleanObject', () => {
  it('should remove null and undefined values from an object and its nested objects', () => {
    const input = {
      a: 1,
      b: null,
      c: {
        d: 'hello',
        e: null,
        f: {
          g: 2,
          h: undefined,
        },
      },
      d: [
        {
          a: 1,
          b: [null, undefined, 1, 2, 3],
        },
        {
          b: null,
        },
      ],
    };
    const expectedOutput = {
      a: 1,
      c: {
        d: 'hello',
        f: {
          g: 2,
        },
      },
      d: [
        {
          a: 1,
          b: [1, 2, 3],
        },
      ],
    };
    expect(cleanObject(input)).toEqual(expectedOutput);
  });
});
