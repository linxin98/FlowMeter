"""FlowMeter URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.urls import path

import flow
from . import views

urlpatterns = [
    path('', views.flow_view),
    path('select/', views.select_device),
    path('sniff/', views.sniff),
    path('get_flow/', views.get_flow),
    path('address/', views.address_analyze),
    path('name/', views.name_analyze),
    path('burst/', views.burst_analyze)
]
