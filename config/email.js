export const EMAIL = {
    HOST: process.env.EMAIL_HOST || 'smtp.qq.com',
    PORT: process.env.EMAIL_PORT || 587,
    SECURE: process.env.SECURE === 'true',
    USER: process.env.EMAIL_USER,
    PASS: process.env.EMAIL_PASS,
    FROM: process.env.EMAIL_FROM,
    CODE: process.env.EMAIL_CODE || '1234',
};

