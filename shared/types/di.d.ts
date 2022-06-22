/**
 * Type for what object is instances of
 */
interface Type<T> {
  new (...args: any[]): T;
}

/**
 * Generic `ClassDecorator` type
 */
type GenericClassDecorator<T> = (target: T) => void;
