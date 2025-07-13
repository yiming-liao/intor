import { Logger } from "logry";

export const mockIntorLogger = () => {
  const mockLogDebug = jest.fn();
  const mockLogInfo = jest.fn();
  const mockLogWarn = jest.fn();
  const mockLogError = jest.fn();

  const child = jest.fn().mockReturnValue({
    debug: mockLogDebug,
    info: mockLogInfo,
    warn: mockLogWarn,
    error: mockLogError,
  });

  return {
    mockLogger: { child } as unknown as Logger,
    mockLogDebug,
    mockLogInfo,
    mockLogWarn,
    mockLogError,
  };
};
