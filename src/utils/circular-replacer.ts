const isObject = (value: any): value is object => typeof value === 'object';

export const circularReplacer = (): any => {
  const references: WeakSet<object> = new WeakSet();

  return (_: string, value: any) => {
    if(isObject(value) && value !== null) {
      if(references.has(value)) {
        return;
      }

      references.add(value);
    }

    return value;
  };
};
