from django.conf import settings


class DatabaseModelsRouter(object):

    """
    A router to control all database operations on models in
    the myapp2 application
    """

    def db_for_read(self, model, **hints):
        if model._meta.app_label in settings.DATABASE_MODELS_MAPPING:
            return settings.DATABASE_MODELS_MAPPING[model._meta.app_label]
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label in settings.DATABASE_MODELS_MAPPING:
            return settings.DATABASE_MODELS_MAPPING[model._meta.app_label]
        return None

    def allow_relation(self, obj1, obj2, **hints):
        db1 = settings.DATABASE_MODELS_MAPPING.get(obj1._meta.app_label)
        db2 = settings.DATABASE_MODELS_MAPPING.get(obj2._meta.app_label)
        if db1 and db2:
            return db1 == db2
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):

        if db in settings.DATABASE_MODELS_MAPPING.values():
            return settings.DATABASE_MODELS_MAPPING.get(app_label) == db
        elif app_label in settings.DATABASE_MODELS_MAPPING:
            return False