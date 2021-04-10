FROM python:3.9-slim

WORKDIR /code/

# Magic python environment variables
ENV PYTHONUNBUFFERED=1 \
  PYTHONDONTWRITEBYTECODE=1 \
  PYTHONHASHSEED=random \
  PIP_NO_CACHE_DIR=off \
  PIP_DISABLE_PIP_VERSION_CHECK=on

ADD requirements.txt requirements-dev.txt /code/

RUN apt-get update \
    && apt-get install -y build-essential libpq5 libpq-dev \
    && pip install pip-tools \
    && pip-sync requirements.txt requirements-dev.txt \
    && apt-get remove -y --purge build-essential libpq-dev \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

ADD . /code/

ENV MEDIA_ROOT /data/media

RUN DJANGO_SECRET_KEY=assetbuild DATABASE_URL=sqlite://:memory: python manage.py collectstatic

VOLUME /data

CMD ["gunicorn", "-b", "0.0.0.0:8000", "--workers=4", "--threads=4", "--worker-tmp-dir=/dev/shm", "--worker-class=gthread", "--log-file=-", "config.wsgi:application"]
EXPOSE 8000
