from django import forms
from PbimsApp.models import *
import datetime

class ChurnForm(forms.Form):
    outlet = forms.ModelChoiceField(queryset=GetAllOutlets(), label="Select an Outlet")
    #outlet = forms.CharField(required=True, max_length=50, widget=forms.TextInput(attrs={'class': "form-control input-sm", 'placeholder': 'Topic'}))
    dateupto = forms.DateField(required=True, initial=datetime.date.today)
