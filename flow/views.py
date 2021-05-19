import json

from django.http import HttpResponse
from django.shortcuts import render
from scapy.all import *

from flow.models import device


# Create your views here.
def flow(request):
    device.objects.all().delete()
    for item in conf.ifaces.data:
        dev = conf.ifaces.data[item]
        # print(type(dev.description),type(dev.index))
        device_item = device(index=dev.index, description=dev.description)
        device_item.save()
    device_list = device.objects.all().order_by('index')
    return render(request, "flow.html", {'device_list': device_list})


def select_device(request):
    index = request.GET.get('device_index')
    print(index)
    result = {"index": index}
    return HttpResponse(json.dumps(result))