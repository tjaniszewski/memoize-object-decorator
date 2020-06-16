import { memoize } from 'lodash';
import { sha1 } from 'object-hash';

import { circularReplacer } from './utils';

const MAX_EXECUTION_TIME: number = 200;

export function MemoizeObject({circular}: {circular?: boolean} = {}): Function {
  return function(target: Object, key: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
    if(descriptor === undefined) {
      descriptor = Object.getOwnPropertyDescriptor(target, key);
    }

    const originalMethod: Function = descriptor.value;
  
    descriptor.value = memoize(function(...args: any[]) {
      return originalMethod.apply(this, args);
    }, (...args: any[]): string => {
      const startTime: number = Date.now();
      const hash: string = sha1(JSON.stringify(args, circular ? circularReplacer() : null));
      const stopTime: number = Date.now();
      const executionTime: number = stopTime - startTime;

      if(executionTime > MAX_EXECUTION_TIME) {
        console.warn(`@MemoizeObject() decorator for ${key.toString()} method is running for too long (above ${MAX_EXECUTION_TIME}ms)`);
      }

      return hash;
    });
    
    return descriptor;
  }
}