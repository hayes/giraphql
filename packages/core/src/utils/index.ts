export * from './params';
export * from './enums';

export function assertNever(value: never): never {
  throw new TypeError(`Unexpected value: ${value}`);
}