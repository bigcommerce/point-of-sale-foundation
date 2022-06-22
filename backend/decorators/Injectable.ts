/**
 * @returns {GenericClassDecorator<Type<any>>}
 * @constructor
 */
 export const Injectable = () : GenericClassDecorator<Type<any>> => {
    return (_target: Type<any>) => {};
  };