export class ErrorResponse extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data: any
  ) {
    super(statusText);
  }
}