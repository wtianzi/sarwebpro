from django.contrib import admin
from .models import ClueMedia
from .models import GPSData,DataStorage,WaypointsData,GPShistoricalData,ExperimentDataStorage,QuestionnaireModel,ParticipantStatusModel,DemographicsModel,PostExpSurveyModel,WebapplicationModel
import csv
from django.http import HttpResponse
# Register your models here.
class ClueMediaAdmin(admin.ModelAdmin):
    def photo_image(self, obj):
        return mark_safe('<img src="{url}" width="{width}" height={height} />'.format(
            url = obj.photo.url,
            width=obj.photo.width,
            height=obj.photo.height,
            )
    )
    pass
admin.site.register(ClueMedia, ClueMediaAdmin)

class GPSDataAdmin(admin.ModelAdmin):
    list_display = ['deviceid','taskid','gpsdata','created_at','updated_at']
    pass
admin.site.register(GPSData, GPSDataAdmin)
#admin.site.register(ClueMedia)

class DataStorageAdmin(admin.ModelAdmin):
    list_display = ['id','taskid','subtaskid','data','created_at','updated_at']
    pass
admin.site.register(DataStorage, DataStorageAdmin)

class WaypointsDataAdmin(admin.ModelAdmin):
    list_display = ['deviceid','taskid','waypointsdata','created_at','updated_at']
    pass
admin.site.register(WaypointsData, WaypointsDataAdmin)

class GPShistoricalDataAdmin(admin.ModelAdmin):
    list_display = ['deviceid','taskid','gpshistoricaldata','created_at','updated_at']
    pass
admin.site.register(GPShistoricalData, GPShistoricalDataAdmin)

class ExperimentDataStorageAdmin(admin.ModelAdmin):
    actions = ['download_csv']
    list_display = ['id','created_at','details']
    def download_csv(self, request, queryset):
        meta = self.model._meta
        field_names = [field.name for field in meta.fields]
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename={}.csv'.format(meta)
        writer = csv.writer(response)
        writer.writerow(field_names)
        for obj in queryset:
            row = writer.writerow([getattr(obj, field) for field in field_names])
        return response
    download_csv.short_description = "Download CSV file for selected stats."
admin.site.register(ExperimentDataStorage, ExperimentDataStorageAdmin)

class QuestionnaireModelAdmin(admin.ModelAdmin):
    actions = ['download_csv']
    list_display =['id','participantid','taskid','sceneid','trust','transparency','workload',
    'trans1','trans2','trans3','trans4','trans5',
    'trust1','trust2','trust3','trust4','trust5',
    'NASATLX1_mental','NASATLX2_physical','NASATLX3_temporal','NASATLX4_performance','NASATLX5_effort','NASATLX6_frustration',
    'q1','q2','q3','q4','q5','q6','q7','q8','q9','q10','q11','q12',
    'created_at','updated_at']
    def download_csv(self, request, queryset):
        meta = self.model._meta
        field_names = [field.name for field in meta.fields]
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename={}.csv'.format(meta)
        writer = csv.writer(response)
        writer.writerow(field_names)
        for obj in queryset:
            row = writer.writerow([getattr(obj, field) for field in field_names])
        return response
    download_csv.short_description = "Download CSV file for selected stats."

admin.site.register(QuestionnaireModel, QuestionnaireModelAdmin)

class ParticipantStatusModelAdmin(admin.ModelAdmin):
    actions = ['download_csv']
    list_display =['id','participantid','participantindex','participantname','status','taskstatus','created_at','updated_at']
    def download_csv(self, request, queryset):
        meta = self.model._meta
        field_names = [field.name for field in meta.fields]

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename={}.csv'.format(meta)
        writer = csv.writer(response)

        writer.writerow(field_names)
        for obj in queryset:
            row = writer.writerow([getattr(obj, field) for field in field_names])

        return response

    download_csv.short_description = "Download CSV file for selected stats."
    pass
admin.site.register(ParticipantStatusModel, ParticipantStatusModelAdmin)

class DemographicsModelAdmin(admin.ModelAdmin):
    actions = ['download_csv']
    list_display =['id','participantid','participantindex','age','gender','education','sart','q1','q2','q3','q4','q5','q6','q7','q8','q9','q10','created_at','updated_at']
    
    def download_csv(self, request, queryset):
        meta = self.model._meta
        field_names = [field.name for field in meta.fields]

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename={}.csv'.format(meta)
        writer = csv.writer(response)

        writer.writerow(field_names)
        for obj in queryset:
            row = writer.writerow([getattr(obj, field) for field in field_names])

        return response

    download_csv.short_description = "Download CSV file for selected stats."
    pass
admin.site.register(DemographicsModel, DemographicsModelAdmin)


class PostExpSurveyModelAdmin(admin.ModelAdmin):
    actions = ['download_csv']
    list_display =['id','participantid','q1','q2','q3','q4','q5','q6','q7','q8','q9','q10','q11','q12','q13','q14','q15','q16','q17','q18','q19','q20','created_at','updated_at']
    
    def download_csv(self, request, queryset):
        meta = self.model._meta
        field_names = [field.name for field in meta.fields]

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename={}.csv'.format(meta)
        writer = csv.writer(response)

        writer.writerow(field_names)
        for obj in queryset:
            row = writer.writerow([getattr(obj, field) for field in field_names])

        return response

    download_csv.short_description = "Download CSV file for selected stats."
    pass
admin.site.register(PostExpSurveyModel, PostExpSurveyModelAdmin)

class WebapplicationModelAdmin(admin.ModelAdmin):
    actions = ['download_csv']
    list_display =['id','participantid','q1','q2','q3','q4','q5','q6','q7','q8','q9','q10','q11','q12','q13','created_at','updated_at']
    
    def download_csv(self, request, queryset):
        meta = self.model._meta
        field_names = [field.name for field in meta.fields]

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename={}.csv'.format(meta)
        writer = csv.writer(response)

        writer.writerow(field_names)
        for obj in queryset:
            row = writer.writerow([getattr(obj, field) for field in field_names])

        return response

    download_csv.short_description = "Download CSV file for selected stats."
    pass
admin.site.register(WebapplicationModel, WebapplicationModelAdmin)
