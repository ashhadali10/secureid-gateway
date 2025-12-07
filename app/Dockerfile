# Stage 1: Build (agar koi frontend hota, lekin hum sirf backend use kar rahe)
FROM node:18-alpine AS base

# Non-root user create karein — CKS ka sab se important rule!
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Working directory set karein
WORKDIR /app

# Dependencies pehle copy karein (cache ke liye acha hai)
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# App code copy karein
COPY . .

# Non-root user set karein
USER 1001

# App chalayein
CMD ["node", "app.js"]
