// add `declare module 'missing-module-name'` here


declare type $Call<Fn extends (...args: any[]) => any> = Fn extends (...args: any[]) => infer RT ? RT : never;