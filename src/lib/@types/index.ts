export interface CookieOptions {
  secure?: boolean;
  httpOnly?: boolean;
  path?: string;
  expires?: Date;
  maxAge?: number;
  sameSite?: true | false | 'lax' | 'strict' | 'none' | undefined;
  priority?: 'low' | 'medium' | 'high' | undefined;
}
