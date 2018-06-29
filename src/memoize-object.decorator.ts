import { memoize } from 'lodash';
import { sha1 } from 'object-hash';


export function MemoizeObject(): Function {
  return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
    if(descriptor === undefined) {
      descriptor = Object.getOwnPropertyDescriptor(target, key);
    }

    const originalMethod = descriptor.value;
  
    descriptor.value = memoize(function (...args) {
      return originalMethod.apply(this, args);
    }, (...args)=> sha1(args));
    
    return descriptor;
  }
}
