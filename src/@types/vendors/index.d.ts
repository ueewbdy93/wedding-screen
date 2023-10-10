// add `declare module 'missing-module-name'` here

declare type ResolvedType<T extends (...args: any[]) => PromiseLike<any>>
  = T extends (...args: any[]) => PromiseLike<infer R> ? R : any;