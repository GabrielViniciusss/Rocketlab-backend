export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};

if (!jwtConstants.secret) {
  throw new Error(
    'JWT_SECRET is not defined in your environment variables. Please check your .env file or environment configuration.',
  );
}
