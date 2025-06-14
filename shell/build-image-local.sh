#!/bin/bash

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 打印带颜色的信息
info() {
    echo -e "${GREEN}[INFO] $1${NC}"
}

# 处理命令行参数
TAG="latest"
if [ $# -ge 1 ]; then
    TAG="$1"
    info "使用自定义标签: $TAG"
else
    info "未指定标签，使用默认标签: $TAG"
fi

info "开始构建本地镜像..."
docker build -t sugarjl/image-uploader:$TAG .
info "构建完成！标签: $TAG"