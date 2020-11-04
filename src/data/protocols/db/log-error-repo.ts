export interface LogErrorRepo{
  logError(stack: string): Promise<void>
}
