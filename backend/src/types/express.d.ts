// Ambient augmentation of Express's Request type — this file has no
// import/export statements on purpose so TypeScript treats it as a global
// script, letting `declare namespace Express` merge into the real one.
declare namespace Express {
  export interface Request {
    /** Set by src/middleware/auth.middleware.ts's requireAuth once a bearer token resolves to a user. */
    userId?: string;
  }
}
