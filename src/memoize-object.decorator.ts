import { memoize } from 'lodash';
import { sha1 } from 'object-hash';

export function MemoizeObject(): Function {
  return function(target: Object, key: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
    if(descriptor === undefined) {
      descriptor = Object.getOwnPropertyDescriptor(target, key);
    }

    const originalMethod: Function = descriptor.value;
  
    descriptor.value = memoize(function(...args: any[]) {
      return originalMethod.apply(this, args);
    }, (...args: any[]) => {
      const startTime = Date.now();
      const sha1Hash = sha1(args);
      const stopTime = Date.now();

      if(stopTime - startTime >= 5000) {
        console.warn(`@MemoizeObject() decorator for ${key.toString()} method is running for too long (above 5000ms)`);
      }

      return sha1Hash;
    });
    
    return descriptor;
  }
}