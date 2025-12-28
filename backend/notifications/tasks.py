"""
Celery tasks for sending notification emails.
"""
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings


@shared_task
def send_notification_email(user_id, subject, message):
    """Send notification email to user."""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    try:
        user = User.objects.get(id=user_id)
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        return f"Email sent to {user.email}"
    except User.DoesNotExist:
        return f"User {user_id} not found"
    except Exception as e:
        return f"Failed to send email: {str(e)}"


@shared_task
def send_join_request_notification(group_id, requester_id):
    """Send notification when someone requests to join a group."""
    from django.contrib.auth import get_user_model
    from groups.models import Group
    from .models import Notification
    
    User = get_user_model()
    
    try:
        group = Group.objects.get(id=group_id)
        requester = User.objects.get(id=requester_id)
        
        # Create in-app notification for group leader
        Notification.objects.create(
            recipient=group.leader,
            notification_type='join_request',
            title='New Join Request',
            message=f'{requester.get_full_name()} wants to join {group.name}',
            actor=requester,
            group=group,
            link=f'/groups/{group.id}/requests'
        )
        
        # Send email
        send_mail(
            subject=f'New Join Request for {group.name}',
            message=f'{requester.get_full_name()} has requested to join your group "{group.name}".\n\nLog in to review the request.',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[group.leader.email],
            fail_silently=True,
        )
        
        return "Notification sent"
    except Exception as e:
        return f"Failed: {str(e)}"


@shared_task
def send_request_response_notification(join_request_id, accepted):
    """Send notification when a join request is accepted/rejected."""
    from groups.models import JoinRequest
    from .models import Notification
    
    try:
        request = JoinRequest.objects.select_related('group', 'user').get(id=join_request_id)
        
        notification_type = 'request_accepted' if accepted else 'request_rejected'
        title = f'Request {"Accepted" if accepted else "Rejected"}'
        message = f'Your request to join {request.group.name} has been {"accepted" if accepted else "rejected"}.'
        
        Notification.objects.create(
            recipient=request.user,
            notification_type=notification_type,
            title=title,
            message=message,
            actor=request.group.leader,
            group=request.group,
            link=f'/groups/{request.group.id}' if accepted else '/explore'
        )
        
        return "Notification sent"
    except Exception as e:
        return f"Failed: {str(e)}"
