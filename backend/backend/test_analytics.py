import os
import django
import sys
from pathlib import Path

# Setup Django
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from tickets.analytics import calculate_sla_compliance, calculate_fcr_rate, get_workload_stats

print("SLA Compliance:", calculate_sla_compliance(), "%")
print("FCR Rate:", calculate_fcr_rate(), "%")
print("Agent Workload:", get_workload_stats())
