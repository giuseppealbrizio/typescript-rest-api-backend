import cleanDeep from 'clean-deep';

interface IObjectWithNulls {
  [key: string]: unknown | null | IObjectWithNulls;
}

const cleanObject = (obj: IObjectWithNulls): IObjectWithNulls => {
  return cleanDeep(obj);
};

export {cleanObject};
