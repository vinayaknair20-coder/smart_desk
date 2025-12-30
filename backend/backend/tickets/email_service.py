from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def send_ticket_created_notification(ticket, user_email):
    """
    Send email to user when they create a ticket
    """
    subject = f'Ticket #{ticket.id} Created - {ticket.subject}'
    
    html_message = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #3b82f6;">Ticket Created Successfully</h2>
        <p>Hello,</p>
        <p>Your support ticket has been created and our team will review it shortly.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Ticket Details:</h3>
            <p><strong>Ticket ID:</strong> #{ticket.id}</p>
            <p><strong>Subject:</strong> {ticket.subject}</p>
            <p><strong>Priority:</strong> {ticket.get_priority_id_display()}</p>
            <p><strong>Queue:</strong> {ticket.get_queue_display()}</p>
            <p><strong>Status:</strong> {ticket.get_status_display()}</p>
        </div>
        
        <p>You can track your ticket status in your dashboard.</p>
        <p>Thank you for contacting us!</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px;">
            This is an automated message from Smart Service Desk. Please do not reply to this email.
        </p>
    </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        html_message=html_message,
        fail_silently=False,
    )


def send_ticket_assigned_notification(ticket, agent):
    """
    Send email to agent when ticket is assigned to them
    """
    subject = f'New Ticket Assigned - #{ticket.id}: {ticket.subject}'
    
    html_message = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #22c55e;">New Ticket Assigned to You</h2>
        <p>Hello {agent.username},</p>
        <p>A new support ticket has been assigned to you.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Ticket Details:</h3>
            <p><strong>Ticket ID:</strong> #{ticket.id}</p>
            <p><strong>Subject:</strong> {ticket.subject}</p>
            <p><strong>Priority:</strong> <span style="color: {'#ef4444' if ticket.priority_id == 1 else '#f97316' if ticket.priority_id == 2 else '#22c55e'};">{ticket.get_priority_id_display()}</span></p>
            <p><strong>Queue:</strong> {ticket.get_queue_display()}</p>
            <p><strong>Created:</strong> {ticket.creation_time.strftime('%Y-%m-%d %H:%M')}</p>
        </div>
        
        <p><strong>Description:</strong></p>
        <p style="background-color: #f9fafb; padding: 10px; border-left: 4px solid #3b82f6;">
            {ticket.description[:200]}{'...' if len(ticket.description) > 200 else ''}
        </p>
        
        <p>Please log in to your agent console to respond to this ticket.</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px;">
            This is an automated message from Smart Service Desk.
        </p>
    </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[agent.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_ticket_status_changed_notification(ticket, user_email, old_status, new_status):
    """
    Send email to user when ticket status changes
    """
    status_map = {1: 'Open', 2: 'Closed'}
    old_status_label = status_map.get(old_status, 'Unknown')
    new_status_label = status_map.get(new_status, 'Unknown')
    
    subject = f'Ticket #{ticket.id} Status Updated - Now {new_status_label}'
    
    html_message = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #3b82f6;">Ticket Status Updated</h2>
        <p>Hello,</p>
        <p>The status of your support ticket has been updated.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Ticket ID:</strong> #{ticket.id}</p>
            <p><strong>Subject:</strong> {ticket.subject}</p>
            <p><strong>Status Change:</strong> <span style="color: #ef4444;">{old_status_label}</span> → <span style="color: #22c55e;">{new_status_label}</span></p>
        </div>
        
        <p>You can view the ticket details and any updates in your dashboard.</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px;">
            This is an automated message from Smart Service Desk. Please do not reply to this email.
        </p>
    </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        html_message=html_message,
        fail_silently=False,
    )


def send_comment_added_notification(ticket, comment, recipient_email, recipient_name):
    """
    Send email when a new comment is added to a ticket
    """
    subject = f'New Reply on Ticket #{ticket.id} - {ticket.subject}'
    
    html_message = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #3b82f6;">New Reply on Your Ticket</h2>
        <p>Hello {recipient_name},</p>
        <p>A new reply has been added to your support ticket.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Ticket ID:</strong> #{ticket.id}</p>
            <p><strong>Subject:</strong> {ticket.subject}</p>
        </div>
        
        <p><strong>New Comment:</strong></p>
        <div style="background-color: #f9fafb; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
            {comment.comment}
        </div>
        
        <p>Please log in to view the full conversation and respond to this ticket.</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px;">
            This is an automated message from Smart Service Desk. Please do not reply to this email.
        </p>
    </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[recipient_email],
        html_message=html_message,
        fail_silently=False,
    )
