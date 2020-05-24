import os
from pathlib import Path

import environ

ROOT_DIR = Path(__file__).resolve(strict=True).parent.parent

APPS_DIR = ROOT_DIR / "leaderboard"

env = environ.Env()
if os.path.exists(str(ROOT_DIR / ".env")):
    env.read_env(str(ROOT_DIR / ".env"))


# General Settings
DEBUG = env.bool("DJANGO_DEBUG", False)
SECRET_KEY = env("DJANGO_SECRET_KEY")
TIME_ZONE = "UTC"
LANGUAGE_CODE = "en-us"
USE_I18N = True
USE_L10N = True
USE_TZ = True


# Databases
DATABASES = {
    "default": env.db("DATABASE_URL"),
}
DATABASES["default"]["ATOMIC_REQUESTS"] = True


# URLs
ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"


# Apps
DJANGO_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # "django.contrib.humanize", # Handy template tags
    "django.contrib.admin",
    "django.forms",
]

THIRD_PARTY_APPS = [
    "corsheaders",
    "django_extensions",
    "rest_framework",
    "rest_framework.authtoken",
]

LOCAL_APPS = ["leaderboard.scores", "leaderboard.users"]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS


# Authentication
AUTHENTICATION_BACKENDS = ["django.contrib.auth.backends.ModelBackend"]
AUTH_USER_MODEL = "users.User"
LOGIN_REDIRECT_URL = "users:redirect"
LOGIN_URL = "account_login"

# Passwords
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
]
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# Middleware
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    # "django.middleware.locale.LocaleMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    # "django.middleware.common.BrokenLinkEmailsMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# Static
STATIC_ROOT = str(ROOT_DIR / "static")
STATIC_URL = "/static/"
#STATICFILES_DIRS = [str(APPS_DIR / "static"), str(ROOT_DIR / "frontend" / "build")]
STATICFILES_FINDERS = [
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
]


# Media
MEDIA_ROOT = env('MEDIA_ROOT', default=str(APPS_DIR / "media"))
MEDIA_URL = "/media/"


# Templates
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [str(APPS_DIR / "templates")],
        "OPTIONS": {
            "loaders": [
                "django.template.loaders.filesystem.Loader",
                "django.template.loaders.app_directories.Loader",
            ],
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    }
]

# Security
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = "DENY"

# Email

# TODO: move this to not the console backend
EMAIL_BACKEND = env(
    "DJANGO_EMAIL_BACKEND", default="django.core.mail.backends.console.EmailBackend"
)

# Admin
ADMIN_URL = "admin/"
ADMINS = [("""Kaleb Elwert""", "belak@coded.io")]
MANAGERS = ADMINS

# Logging
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "%(levelname)s %(asctime)s %(module)s "
            "%(process)d %(thread)d %(message)s"
        }
    },
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        }
    },
    "root": {"level": "INFO", "handlers": ["console"]},
}

# Rest Framework
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework.authentication.TokenAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
}

# CORS
CORS_ORIGIN_ALLOW_ALL = True
