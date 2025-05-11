export function getSecretKeys() {
    const envKeys: Record<string, string> = {};
    // 查找所有 SECRET_ACCOUNT_ 开头的环境变量
    Object.keys(process.env).forEach(key => {
        if (key.startsWith('SECRET_ACCOUNT_')) {
            const secretValue = process.env[key];
            // 使用环境变量的值作为密钥，环境变量的Key作为账户名
            const secretAccount = key.replace('SECRET_ACCOUNT_', '').toLowerCase();
            envKeys[secretValue] = secretAccount;
        }
    });
    return envKeys;
}