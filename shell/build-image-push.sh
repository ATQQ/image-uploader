#!/bin/bash

# 设置错误时退出
set -e

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 打印带颜色的信息
info() {
    echo -e "${GREEN}[INFO] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

# 检查 docker 命令是否存在
if ! command -v docker &> /dev/null; then
    error "docker 命令未找到，请先安装 docker"
    exit 1
fi

# 创建并使用新的构建器实例
info "创建新的构建器实例..."
docker buildx create --name multi-platform-builder --use || true

# 启动构建器
info "启动构建器..."
docker buildx inspect --bootstrap

# 构建多平台镜像
info "开始构建多平台镜像..."
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --tag sugarjl/image-uploader:latest \
    --push \
    .

info "构建完成！" 