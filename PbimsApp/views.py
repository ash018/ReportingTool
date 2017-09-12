from django.db import connection, connections
from django.shortcuts import render
from django.http import HttpResponse, StreamingHttpResponse
import re
import csv
import datetime
import time
import sys
from .forms import *
from .models import *
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import urllib3
import json
import urllib.request
import requests
import numpy
import pandas as pd
from .forms import *
from django.views.generic import FormView, RedirectView
from django.urls import reverse, reverse_lazy
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import REDIRECT_FIELD_NAME, login as auth_login, logout as auth_logout
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.debug import sensitive_post_parameters
from django.views.generic import FormView, RedirectView
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required


def index(request):
    return render(request, 'PbimsApp/dashboard.html', {'result': ''})


def login(request):
    if 'userid' in request.session and request.session['userid'] is not None:
        return HttpResponseRedirect('home/')


    if request.method == 'POST':
        userid = request.POST.get('userid')
        password = request.POST.get('password')
        if ValidateLoginDB(userid, password):   #Check for login data into DB.
            request.session['userid'] = userid
            request.session['password'] = password
            request.session['username'] = GerUsernameFromUserId(userid)[0]['username']
            if userid == 'admin':
                request.session['userstatus'] = 'admin'
            else:
                request.session['userstatus'] = 'general'
            return HttpResponseRedirect('home/')
        else:
            return render(request, 'PbimsApp/login.html', {'message': 'Login Failed. Please contact system administrator.', 'PageTitle': 'Login Failed'})
    return render(request, 'PbimsApp/login.html')


def home(request):
    obj = UserPanel()
    reportList = obj.GetDashboardsByUser(request.session['userid'])
    result = {'reportList': reportList , 'PageTitle': 'MIS Reporting Home'}
    return render(request, 'PbimsApp/home.html', result)

def report(request):
    reportList = UserPanel().GetDashboardsByUser(request.session['userid'])
    if request.method == 'POST':
        dashboardId = request.POST.get('dashboardId') if request.POST.get('dashboardId') else request.POST.get('selectedDashboardId')
        reportRow = GetReportUrl(request.session['userid'], dashboardId)
        print(reportRow)
    else:
        reportRow = []
        reportRow.append({})
    return render(request, 'PbimsApp/report.html', {'dataset': reportRow[0], 'reportList':reportList, 'PageTitle': 'View Report'})

def managedashboard(request):
    alertMessage = ""
    ##Check if "Add dashboard" is requested from managedashboard page
    if request.method == 'POST' and request.POST.get('actionType') == "AddDashboard":
        title = request.POST.get('title')
        description = request.POST.get('description')
        url = request.POST.get('url')
        obj = Dashboard()
        obj.InsertDashboardInfo(title, description, url)
        alertMessage = "Success! Dashboard information successfully recorded."

    if request.method == 'POST' and request.POST.get('actionType') == "EditDashboard":
        Id = request.POST.get('dashboardId')
        title = request.POST.get('Title')
        description = request.POST.get('Description')
        url = request.POST.get('Url')
        obj = Dashboard()
        obj.UpdateDashboardInfo(Id, title, description, url)
        alertMessage = "Success! Dashboard information updated successfully."

    if request.method == 'POST' and request.POST.get('actionType') == "DeleteDashboard":
        Id = request.POST.get('dashboardId')
        obj = Dashboard()
        obj.DeleteDashboardInfo(Id)
        alertMessage = "Success! Dashboard entry deleted successfully."

    obj = Dashboard()
    dashboardList = obj.GetAllDashboardList()
    reportList = UserPanel().GetDashboardsByUser(request.session['userid'])
    return render(request, 'PbimsApp/managedashboard.html', {'dashboardList': dashboardList, 'message': alertMessage, 'reportList': reportList, 'PageTitle': 'Manage Dashboard'})


def manageuser(request):
    alertMessage = ""
    ##Check if "Add User" is requested from manageuser page
    if request.method == 'POST' and request.POST.get('actionType') == "AddUser":
        userid = request.POST.get('userid')
        username = request.POST.get('username')
        password = request.POST.get('password')
        email = request.POST.get('email')
        isactive = request.POST.get('status')
        print(isactive)
        obj = UserPanel()
        result = obj.InsertUserInfo(userid, username, password, email, isactive)
        if result:
            alertMessage = "Success! User information recorded successfully."
        else:
            alertMessage = "Info! UserId already exists with the provided userid: " + userid

    if request.method == 'POST' and request.POST.get('actionType') == "EditUser":
        userid = request.POST.get('UserId')
        password = request.POST.get('Password')
        email = request.POST.get('Email')
        isactive = request.POST.get('status')
        obj = UserPanel()
        obj.UpdateUserInfo(userid, password, email, isactive)
        alertMessage = "Success! User information updated successfully."

    if request.method == 'POST' and request.POST.get('actionType') == "DeleteUser":
        userid = request.POST.get('UserId')
        obj = UserPanel()
        obj.DeleteUserInfo(userid)
        alertMessage = "Success! User information deleted successfully."

    obj = UserPanel()
    userList = obj.GetAllUserList()
    reportList = UserPanel().GetDashboardsByUser(request.session['userid'])
    return render(request, 'PbimsApp/manageuser.html', {'userList': userList, 'message': alertMessage,'reportList': reportList, 'PageTitle': 'Manage User'})


def managepermission(request):
    alertMessage = ""
    userid = request.session['userid']
    if request.method == 'POST' and request.POST.get('actionType') == "AddPermission":  #If Add Mapping button was clicked, execute below actions
        userid = request.POST.get('userid_grant_access')
        dashboardId = request.POST.get('dashboardId_grant_access')
        obj = UserPanel()
        result = obj.AddNewUserDashboard(userid, dashboardId)
        if result:
            alertMessage = "<div class='alert alert-success'>Success! Dashboard:" + str(dashboardId)+ " has been successfully assigned to user:" + str(userid) + " </div>"
        else:
            alertMessage = "<div class='alert alert-danger'>Sorry! Dashboard:" + str(dashboardId) + " has already been assigned to user:" + str(userid) + " </div>"

    if request.method == 'POST' and request.POST.get('actionType') == "DeletePermission": #If Delete Mapping button was clicked, execute below actions
        userid = request.POST.get('userid_delete_access')
        dashboardId = request.POST.get('dashboardId_delete_access')
        obj = UserPanel()
        obj.DeleteReportMapping(userid, dashboardId)
        alertMessage = "<div class='alert alert-success'>Success! DASHBOARD:" + str(dashboardId) + " has been successfully deleted from USER:" + str(userid) + " </div>"

    if request.method == 'POST' and request.POST.get('actionType') == "UpdateOrder": #If Delete Mapping button was clicked, execute below actions
        reportOrder = request.POST.get('reportOrder')
        userid = request.POST.get('UserIdForUpdate')
        if reportOrder != "":
            reportOrder = json.loads(reportOrder)
            print(reportOrder)
            strNewOrder = ','.join([str(item) for item in reportOrder])
            print(userid + " - " + strNewOrder)
            obj = UserPanel()
            obj.UpdateReportOrder(userid, strNewOrder)
            alertMessage = "<div class='alert alert-success'>Success! Dashboard order has been successfully updated for USER:" + userid +  " </div>"
        else:
            alertMessage = "<div class='alert alert-danger'>Alert! You have not updated any order for the reports </div>"


    obj = UserPanel()
    userDashboardMap = obj.GetAllUserWithDashboard()    #Summary table: Dataset for User - Dashboard Mapping Table view
    userDistinct = obj.GetDistinctUserList()   #Distinct Users dropdown populate
    dashboardDistinct = obj.GetDistinctDashboardList(userid)  #Distinct Dashboards dropdown populate, load those dashboards that the user does not have permission
    dashboardAssigned = obj.GetDashboardsByUser(userid)  #Get the reports, report order of selected user

    reportList = UserPanel().GetDashboardsByUser(request.session['userid'])
    returnToView = {'userDashboardMapList': userDashboardMap,
                    'message': alertMessage,
                    'distinctUsers': userDistinct,
                    'distinctDashboards': dashboardDistinct,
                    'dashboardAssigned': dashboardAssigned,
                    'selectedUserId': userid,
                    'reportList': reportList,
                    'PageTitle': 'Manage Permission'
                    }
    return render(request, 'PbimsApp/managepermission.html', returnToView)


def feedback(request):
    alertMessage = ""
    if request.method == 'POST':
        rating = request.POST.get('rating')
        if not rating:
            rating = "0"
        comment = request.POST.get('comment')
        obj = Feedback()
        obj.AddFeedback(request.session['userid'], rating, comment)
        alertMessage = "Thanks for sharing your feedback."

    reportList = UserPanel().GetDashboardsByUser(request.session['userid'])
    returnToView = {
        'message': alertMessage,
        'reportList': reportList,
        'PageTitle': 'Share Feedback'
    }
    return render(request, 'PbimsApp/feedback.html', returnToView)


def showfeedback(request):
    alertMessage = ""
    obj = Feedback()
    feedbacks = obj.GetAllFeedbacks(request.session['userid'])
    reportList = UserPanel().GetDashboardsByUser(request.session['userid'])
    returnToView = {
        'message': alertMessage,
        'feedbacks': feedbacks,
        'reportList': reportList,
        'PageTitle': 'User Feedbacks'
    }
    return render(request, 'PbimsApp/showfeedback.html', returnToView)

def changePassword(request):
    alertMessage = ''
    reportList = UserPanel().GetDashboardsByUser(request.session['userid'])
    if request.method == 'POST':
        password = request.POST.get('old_password')
        print(password)
        UserPanel().UpdateUserPassword(request.session['userid'], password)
        alertMessage = '<div class="alert alert-success">User password has been successfully updated.</div>'
        request.session['password'] = password
    returnToView = {
        'message': alertMessage,
        'reportList': reportList,
        'PageTitle': 'Change Password'
    }
    return render(request, 'PbimsApp/changePassword.html', returnToView)


def AJX_GetUserDashboardsNotAssigned(request):
    selectedUser = request.GET.get('selectedUser', None)
    print(selectedUser)
    obj = UserPanel()
    dropdownDashboards = obj.GetDistinctDashboardList(selectedUser)
    return HttpResponse(json.dumps({'result': dropdownDashboards}), content_type="application/json")


def AJX_GetUserDashboardsAssigned(request):
    selectedUser = request.GET.get('selectedUser', None)
    print(selectedUser)
    obj = UserPanel()
    dropdownDashboards = obj.GetDashboardsByUser(selectedUser)
    return HttpResponse(json.dumps({'result': dropdownDashboards}), content_type="application/json")

def logout(request):
    request.session.flush()
    return HttpResponseRedirect('login')

# def ValidateLogin(request):
#     if request.method == 'POST':
#         userid = request.POST.get('userid')
#         password = request.POST.get('password')
#         if ValidateLoginDB(userid, password):
#             request.session['userid'] = userid
#             request.session['password'] = password
#             return HttpResponseRedirect('/home/')

#
# class SignIn(FormView):
#     success_url = reverse_lazy('home')
#     form_class = AuthenticationForm
#     redirect_field_name = REDIRECT_FIELD_NAME
#     template_name = 'PbimdApp/login.html'
#
#     @method_decorator(sensitive_post_parameters('password'))
#     @method_decorator(csrf_protect)
#     @method_decorator(never_cache)
#     def dispatch(self, request, *args, **kwargs):
#         # Sets a test cookie to make sure the user has cookies enabled
#         if ValidateLogin(request.user):
#             return HttpResponseRedirect('/home/')
#
#         request.session.set_test_cookie()
#
#         return super(SignIn, self).dispatch(request, *args, **kwargs)
#
#     def form_valid(self, form):
#         auth_login(self.request, form.get_user())
#
#         # If the test cookie worked, go ahead and
#         # delete it since its no longer needed
#         if self.request.session.test_cookie_worked():
#             self.request.session.delete_test_cookie()
#
#         return super(SignIn, self).form_valid(form)
#
#     def get_success_url(self):
#         redirect_to = self.request.GET.get(self.redirect_field_name)
#         if not is_safe_url(url=redirect_to, host=self.request.get_host()):
#             redirect_to = self.success_url
#         return redirect_to
#
#
# class SignOut(RedirectView):
#     """
#     Provides users the ability to logout
#     """
#     url = '/?next=home'
#
#     def get(self, request, *args, **kwargs):
#
#         if (request.user.groups.filter(name='UDCUser').exists()):
#             token = Token.objects.filter(UserId=request.user).order_by('-entryDate').first()
#             url_name = 'udc_logout'
#             url = reverse_lazy(url_name, kwargs={'logout_token': token.RefreshToken})
#             value = requests.get(url=url[1:])
#         auth_logout(request)
#         return super(SignOut, self).get(request, *args, **kwargs)
#



