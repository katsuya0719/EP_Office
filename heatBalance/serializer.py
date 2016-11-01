from rest_framework import serializers
from heatBalance.models import heatBalance

class heatBalSerializer(serializers.ModelSerializer):
	class Meta:
		model=heatBalance
		fields=('id','project','sensibleH','sensibleC')

	