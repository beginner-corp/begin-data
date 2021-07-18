export type BeginDataType =
  | number
  | string
  | boolean
  | null
  | Array<BeginDataType>
  | { [key: string]: BeginDataType | undefined };
export type DataGetSingleParams = {
  table: string;
  key: string;
};
export type DataGetMultipleParams = Array<DataGetSingleParams>;
export type DataGetEntireTableParams = {
  table: string;
  limit?: number;
  /**
   * If your table contains many documents (or a greater number of documents than your limit), it will return a cursor
   */
  cursor?: string;
};
export type DataGetSingleResult =
  | {
    table: string;
    key: string;
    [others: string]: BeginDataType | undefined;
  }
  | null
  | undefined;
export type DataGetSingleCallback = (
  err: Error | null | undefined,
  result: DataGetSingleResult,
) => void;
export type DataGetMultipleResult = Array<{
  table: string;
  key: string;
  [others: string]: BeginDataType | undefined;
}>;
export type DataGetMultipleCallback = (
  err: Error | null | undefined,
  result: DataGetMultipleResult,
) => void;
export type DataGetEntireTableResult = DataGetMultipleResult & {
  cursor?: string;
};
export type DataGetEntireTableCallback = (
  err: Error | null | undefined,
  result: DataGetEntireTableResult,
) => void;

export type DataSetSingleParams = {
  table: string;
  /**
   * If no key is supplied, Begin Data will automatically supply a pseudo-random, unique, immutable key
   */
  key?: string;
  /**
   * Any document can be automatically expunged by setting a ttl value.
   *
   * ttl is a Number corresponding to a specific future Unix epoch (expressed in seconds).
   *
   * Documents will typically be automatically destroyed within 48 hours of the ttl expiring.
   *
   * Tip: during the intervening time between ttl expiry and actual expunging, the document will still be available; if its ttl is mutated or unset, the document's new ttl state will be respected.
   */
  ttl?: BeginDataType | undefined;
  [others: string]: BeginDataType | undefined;
};
export type DataSetMultipleParams = Array<DataSetSingleParams>;
export type DataSetSingleResult = {
  table: string;
  key: string;
  [others: string]: BeginDataType | undefined;
};
export type DataSetSingleCallback = (
  err: Error | null | undefined,
  result: DataSetSingleResult,
) => void;
export type DataSetMultipleResult = Array<{
  table: string;
  key: string;
  [others: string]: BeginDataType | undefined;
}>;
export type DataSetMultipleCallback = (
  err: Error | null | undefined,
  result: DataSetMultipleResult,
) => void;

export type DataDestroySingleParams = {
  table: string;
  key: string;
};
export type DataDestroyMultipleParams = Array<DataDestroySingleParams>;
export type DataDestroySingleResult = void;
export type DataDestroyMultipleResult = void;
export type DataDestroySingleCallback = (err: Error | null | undefined) => void;
export type DataDestroyMultipleCallback = (
  err: Error | null | undefined,
) => void;

export type DataCountParams = {
  table: string;
};
export type DataCountResult = number;
export type DataCountCallback = (
  err: Error | null | undefined,
  result: DataCountResult,
) => void;

export type DataIncrementParams = {
  table: string;
  key: string;
  prop: string;
};
export type DataIncrementResult = {
  table: string;
  key: string;
  [others: string]: BeginDataType | undefined;
};
export type DataIncrementCallback = (
  err: Error | null | undefined,
  result: DataGetSingleResult,
) => void;

export type DataDecrementParams = {
  table: string;
  key: string;
  prop: string;
};
export type DataDecrementResult = {
  table: string;
  key: string;
  [others: string]: BeginDataType | undefined;
};
export type DataDecrementCallback = (
  err: Error | null | undefined,
  result: DataDecrementResult,
) => void;

export type DataPageParams = {
  table: string;
  limit?: number;
};
export type DataPageResult = Array<{
  table: string;
  key: string;
  [others: string]: BeginDataType | undefined;
}>;

/**
 * @see https://docs.begin.com/en/data/begin-data
 */
export interface BeginData {
  /**
   * As you'd imagine, data.get() is responsible for getting documents.
   *
   * data.get() can get a single document, batch get multiple documents, or get an entire table.
   */
  get(params: DataGetSingleParams): Promise<DataGetSingleResult>;
  get(params: DataGetSingleParams, callback: DataGetSingleCallback): void;
  get(params: DataGetMultipleParams): Promise<DataGetMultipleResult>;
  get(params: DataGetMultipleParams, callback: DataGetMultipleCallback): void;
  get(params: DataGetEntireTableParams): Promise<DataGetEntireTableResult>;
  get(
    params: DataGetEntireTableParams,
    params: DataGetEntireTableCallback,
  ): void;

  /**
   * data.set() is responsible for creating new documents, and updating existing ones.
   *
   * data.set() can operate on a single document, or batch up to 25 documents.
   *
   * A single data.set() request cannot exceed 10KB.
   *
   * Your supplied data can be any quantity of the following supported types:
   *   - Number
   *   - String
   *   - Binary (Must be base64 encoded)
   *   - Boolean
   *   - Null
   *   - Array
   *   - Object
   *
   * Limits:
   *   - data.set() has a maximum batch size of 25 documents and 10KB per call.
   *   - Empty attributes are invalid and will produce errors.
   */
  set(params: DataSetSingleParams): Promise<DataSetSingleResult>;
  set(params: DataSetSingleParams, callback: DataSetSingleCallback): void;
  set(params: DataSetMultipleParams): Promise<DataSetMultipleeResult>;
  set(params: DataSetMultipleParams, callback: DataSetMultipleCallback): void;

  /**
   * data.destroy() is responsible for destroying documents.
   *
   * Valid data.destroy() calls require passing a one or more objects containing a table and key; there is no limit to the number of documents a single call can destroy.
   */
  destroy(params: DataDestroySingleParams): Promise<DataDestroySingleResult>;
  destroy(
    params: DataDestroySingleParams,
    callback: DataDestroySingleCallback,
  ): void;
  destroy(
    params: DataDestroyMultipleParams,
  ): Promise<DataDestroyMultipleResult>;
  destroy(
    params: DataDestroyMultipleParams,
    callback: DataDestroyMultipleCallback,
  ): void;

  /**
   * data.count() returns the count of a table's documents.
   */
  count(params: DataCountParams): Promise<DataCountResult>;
  count(params: DataCountParams, callback: DataCountCallback): void;

  /**
   * data.incr() increments the number property.
   */
  incr(params: DataIncrementParams): Promise<DataIncrementResult>;
  incr(params: DataIncrementParams, callback: DataIncrementCallback): void;

  /**
   * data.decr() decrements the number property.
   */
  decr(params: DataDecrementParams): Promise<DataDecrementResult>;
  decr(params: DataDecrementParams, callback: DataDecrementCallback): void;

  /**
   * data.page()
   */
  page(params: DataPageParams): AsyncIterable<DataPageResult>;
}
/**
 * @see https://docs.begin.com/en/data/begin-data
 */
const data: BeginData;
export default data;
