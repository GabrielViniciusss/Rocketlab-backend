function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error(
      'FATAL ERROR: JWT_SECRET is not defined in your environment variables. Please check your .env file or environment configuration.',
    );
    throw new Error(
      'JWT_SECRET is not defined. Application cannot start securely.',
    );
  }
  return secret;
}

export const jwtConstants = {
  secret: getJwtSecret(),
};
