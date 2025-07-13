import dotenv from 'dotenv';
import { access } from 'fs';
dotenv.config();

export default {
    qiita: {
        accessToken: process.env.QIITA_ACCESS_TOKEN || '',
    },
    instagram: {
        accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '',
        businessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || '',
    },
}