declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};