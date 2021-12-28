export interface Auth {
  ytapi: string;
}

export async function asyncMap<A, B>(arr: A[], mapFunc: ((elm: A) => Promise<B>)) {
  const out = [] as B[];
  for (let i = 0; i < arr.length; i++) {
    const val = await mapFunc(arr[i]);
    out.push(val);
  }
  return out;
}

export async function asyncForEach<A>(arr: A[], mapFunc: ((elm: A) => Promise<void>)) {
  await asyncMap(arr, mapFunc);
}
