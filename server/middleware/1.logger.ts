import { defineEventHandler, getRequestIP, getRequestHeader } from 'h3'

export function getClientIp(req: any): string {
    return (req.headers['x-forwarded-for']
        || req.connection.remoteAddress
        || req.socket.remoteAddress) as string
}

export default defineEventHandler(async (event) => {
    const startTime = Date.now()
    const ip = getRequestIP(event) || getClientIp(event.node.req)
    const method = event.method
    const path = decodeURIComponent(event.path)
    const userAgent = getRequestHeader(event, 'user-agent')

    // 等待请求处理完成
    await event.node.res.on('finish', () => {
        const endTime = Date.now()
        const responseTime = endTime - startTime
        const statusCode = event.node.res.statusCode

        // 构建日志信息
        const logInfo = {
            timestamp: new Date().toLocaleString(),
            ip,
            method,
            path,
            statusCode,
            responseTime: `${responseTime}ms`,
            userAgent
        }

        // 打印日志
        console.log(logInfo.timestamp, logInfo.ip, logInfo.method, logInfo.path, logInfo.statusCode, logInfo.responseTime, logInfo.userAgent);
    })
}) 