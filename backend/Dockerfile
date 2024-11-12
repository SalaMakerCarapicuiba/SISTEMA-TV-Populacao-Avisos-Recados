FROM python:3.12.6

WORKDIR /app

EXPOSE 8000

COPY . .

RUN pip install django && \
    pip install -r requirements.txt && \
    pip install --upgrade djangorestframework-simplejwt

USER 1001

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

