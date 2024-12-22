# Stage 1: Build React application
FROM node:18 AS react-build
WORKDIR /app
COPY src/ ./src
COPY package.json package-lock.json ./
RUN npm install
RUN npm run build

# Stage 2: Prepare Django environment
FROM python:3.10 AS django-build
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy React build output and Django project files
COPY --from=react-build /app/build ./build
COPY . .

# Set static and media root environment variables
ENV DJANGO_STATIC_ROOT=/app/build/staticfiles
ENV DJANGO_MEDIA_ROOT=/app/build/media

# Collect static files
RUN python manage.py collectstatic --noinput

# Stage 3: Nginx and production-ready app
FROM nginx:latest
WORKDIR /app

# Copy static and media files
COPY --from=django-build /app/build /app/build

# Copy Nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy Django application
COPY --from=django-build /app /app

# Expose port for Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
